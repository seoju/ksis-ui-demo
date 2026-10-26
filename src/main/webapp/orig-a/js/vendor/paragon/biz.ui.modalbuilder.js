/**
 * 모달 빌더 클래스를 수정하여 모달 인스턴스를 전역적으로 관리하는 방식
 * + 모달 내용 변경 기능 추가
 */
(function(utils) {
    utils.ui = utils.ui || {};

    // 전역 모달 저장소
    const _modalInstances = {};

    utils.ui.ModalBuilder = function(){
        this.options = {
            modalId:'',
            url:'',
            params:{modalSize:'size_m'},
            cbFnc:null,
            draggable:true
        }

        // 개별 인스턴스의 모달 저장소
        this.modals = {};

        // 히스토리 관리 (뒤로가기 기능용)
        this.history = [];
    }

    utils.ui.ModalBuilder.prototype = {
        // 기존 메서드들...
        validateOptions: function(options) {
            this.options = Object.assign({}, this.options, options);

            const validations = [
                {
                    condition: this.options.modalId && typeof this.options.modalId === 'string' && this.options.modalId !== '',
                    message: 'Invalid modalId: modalId must be a non-empty string'
                }
            ];

            const failedValidation = validations.find(v => !v.condition);
            if (failedValidation) {
                console.error(failedValidation.message);
                return false;
            }

            return true;
        },

        initModal: function() {
            if (this.options.modalId === "") {
                console.error("Modal ID is undefined!");
                return false;
            }

            let modal = this.modals[this.options.modalId];

            if (!modal) {
                modal = $("<div>").addClass(this.options.modalId);
                $("body").append(modal);
                this.modals[this.options.modalId] = modal;
                _modalInstances[this.options.modalId] = this;
            }

            return true;
        },

        loadModal: function(callback) {
            const self = this;
            let modal = this.modals[this.options.modalId];

            if ($(modal).html() === "") {
                $.get(this.options.url, this.options.params)
                    .done(function(data) {
                        $(modal).html(data);

                        if (typeof utils.convertLang === 'function') {
                            utils.convertLang(modal);
                        }

                        self.setupCloseButton(modal);

                        if (self.options.draggable) {
                            self.setupDraggable(modal);
                        }

                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    })
                    .fail(function(xhr, status, error) {
                        console.error("모달 콘텐츠 로드 중 오류 발생:", xhr.status, xhr.statusText);
                        self.closeModal();
                    });
            } else {
                this.setupCloseButton(modal);

                if (self.options.draggable) {
                    self.setupDraggable(modal);
                }

                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },

        // ★ 새로 추가된 메서드: 모달 내용 변경
        changeContent: function(newUrl, newParams, options) {
            options = options || {};
            const self = this;
            const modal = this.modals[this.options.modalId];

            if (!modal) {
                console.error("모달이 존재하지 않습니다.");
                return false;
            }

            // 히스토리 저장 (뒤로가기 기능용)
            if (options.saveHistory !== false) {
                this.history.push({
                    url: this.options.url,
                    params: this.options.params,
                    content: $(modal).html()
                });
            }

            // 로딩 표시 (선택사항)
            if (options.showLoading !== false) {
                this.showLoading(modal);
            }

            // 새로운 URL과 파라미터로 옵션 업데이트
            this.options.url = newUrl;
            this.options.params = Object.assign({}, this.options.params, newParams);

            // 새 콘텐츠 로드
            $.get(newUrl, this.options.params)
                .done(function(data) {
                    $(modal).html(data);

                    // 언어 변환 등 추가 처리
                    if (typeof utils.convertLang === 'function') {
                        utils.convertLang(modal);
                    }

                    // 이벤트 재설정
                    self.setupCloseButton(modal);

                    if (self.options.draggable) {
                        self.setupDraggable(modal);
                    }

                    // 콜백 실행
                    if (options.callback && typeof options.callback === 'function') {
                        options.callback();
                    }

                    console.log("모달 내용이 성공적으로 변경되었습니다:", newUrl);
                })
                .fail(function(xhr, status, error) {
                    console.error("새 콘텐츠 로드 중 오류 발생:", xhr.status, xhr.statusText);

                    // 오류 시 이전 상태로 복원 (선택사항)
                    if (options.restoreOnError !== false && self.history.length > 0) {
                        self.goBack();
                    }
                });

            return true;
        },

        // ★ 뒤로가기 기능
        goBack: function() {
            if (this.history.length === 0) {
                console.log("뒤로 갈 페이지가 없습니다.");
                return false;
            }

            const previousState = this.history.pop();
            const modal = this.modals[this.options.modalId];

            // 이전 상태로 복원
            this.options.url = previousState.url;
            this.options.params = previousState.params;
            $(modal).html(previousState.content);

            // 이벤트 재설정
            this.setupCloseButton(modal);

            if (this.options.draggable) {
                this.setupDraggable(modal);
            }

            console.log("이전 페이지로 돌아갔습니다.");
            return true;
        },

        // ★ 로딩 표시 메서드
        showLoading: function(modal) {
            const loadingHtml = `
                <div class="modal-loading" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                ">
                    <div style="text-align: center;">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div style="margin-top: 10px;">로딩 중...</div>
                    </div>
                </div>
            `;

            $(modal).find('.popup_layer').css('position', 'relative').append(loadingHtml);
        },

        setupCloseButton: function(modal) {
            const self = this;
            $(modal).find("#btnModalClose").off("click").on("click", function() {
                self.closeModal();
            });
        },

        setupDraggable: function(modal) {
            var $popupLayer = modal.find(".popup_layer");
            $popupLayer.draggable({
                handle: '.pop_header',
                containment: 'window',
                cursor: 'move',
                start: function(event, ui) {
                    const offset = $popupLayer.offset();
                    $popupLayer.css({
                        'transform': 'none',
                        'top': offset.top + 'px',
                        'left': offset.left + 'px'
                    });
                    ui.position.top = offset.top;
                    ui.position.left = offset.left;
                }
            });
        },

        closeModal: function() {
            const modalId = this.options.modalId;
            const modal = this.modals[modalId];

            if (modal) {
                if (this.options.cbFnc && typeof this.options.cbFnc === 'function') {
                    this.options.cbFnc();
                }

                modal.find('.popup_layer').addClass('fold-up-closing');

                setTimeout(() => {
                    $(modal).empty().remove();
                    delete this.modals[modalId];
                    delete _modalInstances[modalId];
                    // 히스토리도 초기화
                    this.history = [];
                }, 300);
            }
        },

        openModal: function(options) {
            if (!this.validateOptions(options)) {
                return false;
            }

            if (!this.initModal()) {
                return false;
            }

            const self = this;
            this.loadModal(function() {
                self.modals[self.options.modalId].show();
            });

            return true;
        }
    };

    // ★ 정적 메서드들 추가
    utils.ui.ModalBuilder.closeModalById = function(modalId) {
        if (_modalInstances[modalId]) {
            _modalInstances[modalId].closeModal();
            return true;
        }
        return false;
    };

    utils.ui.ModalBuilder.getInstance = function(modalId) {
        return _modalInstances[modalId] || null;
    };

    // ★ 모달 내용 변경을 위한 전역 함수
    utils.ui.ModalBuilder.changeModalContent = function(modalId, newUrl, newParams, options) {
        const instance = _modalInstances[modalId];
        if (instance) {
            return instance.changeContent(newUrl, newParams, options);
        }
        console.error("모달 인스턴스를 찾을 수 없습니다:", modalId);
        return false;
    };

    // ★ 뒤로가기를 위한 전역 함수
    utils.ui.ModalBuilder.goBackModal = function(modalId) {
        const instance = _modalInstances[modalId];
        if (instance) {
            return instance.goBack();
        }
        console.error("모달 인스턴스를 찾을 수 없습니다:", modalId);
        return false;
    };

    // 전역 함수들
    window.closeModal = function(modalId) {
        if (!modalId) {
            const ids = Object.keys(_modalInstances);
            if (ids.length > 0) {
                return utils.ui.ModalBuilder.closeModalById(ids[0]);
            }
            return false;
        }
        return utils.ui.ModalBuilder.closeModalById(modalId);
    };

    // ★ 새로운 전역 함수들
    window.changeModalContent = function(modalId, newUrl, newParams, options) {
        return utils.ui.ModalBuilder.changeModalContent(modalId, newUrl, newParams, options);
    };

    window.goBackModal = function(modalId) {
        return utils.ui.ModalBuilder.goBackModal(modalId);
    };

})(window.biz);

// ★ 사용 예시
/*
// 1. 상세보기 모달 열기
const modalBuilder = new biz.ui.ModalBuilder();
modalBuilder.openModal({
    modalId: 'detailModal',
    url: '/board/view.do',
    params: { boardNo: 123 }
});

// 2. 모달 내에서 수정 페이지로 변경 (수정 버튼 클릭 시)
function goToEditMode() {
    changeModalContent('detailModal', '/board/write.do',
        { boardNo: 123, mode: 'edit' },
        {
            callback: function() {
                console.log('수정 모드로 변경됨');
            }
        }
    );
}

// 3. 뒤로가기 (상세보기로 돌아가기)
function goBackToView() {
    goBackModal('detailModal');
}

// 4. 모달 내 HTML에서 직접 사용
<button onclick="goToEditMode()">수정</button>
<button onclick="goBackToView()">뒤로가기</button>
<button onclick="closeModal('detailModal')">닫기</button>
*/