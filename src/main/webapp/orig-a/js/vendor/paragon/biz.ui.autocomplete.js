/**
 * biz.ui.autocomplete.js - 자동완성 기능 모듈
 *
 * jQuery UI의 autocomplete 기능을 확장하여 재사용 가능한 모듈로 구현
 * 스크롤 시 자동완성 목록 분리 문제 해결 포함
 *
 * - Licensed under the Apache License, Version 2.0 (the "License");
 * - you may not use this file except in compliance with the License.
 * - You may obtain a copy of the License at
 * -
 * - http://www.apache.org/licenses/LICENSE-2.0
 * -
 * - Unless required by applicable law or agreed to in writing, software
 * - distributed under the License is distributed on an "AS IS" BASIS,
 * - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * - See the License for the specific language governing permissions and
 * - limitations under the License.
 */
(function(utils) {
    utils.ui = utils.ui || {};

    /**
     * 자동완성 모듈 초기화 함수
     * @param {string|jQuery} selector - 자동완성을 적용할 입력 요소 선택자 또는 jQuery 객체
     * @param {Object} options - 자동완성 옵션
     * @param {string} options.url - 데이터 요청할 API URL
     * @param {Object} [options.params] - API 요청 시 전송할 기본 파라미터
     * @param {string} [options.searchParam='searchKeyword'] - 검색어를 담을 파라미터 이름
     * @param {string} [options.searchType] - 검색 유형 파라미터 (있는 경우)
     * @param {Function} [options.dataConverter] - 서버 응답 데이터를 변환하는 함수 (item) => { label, value }
     * @param {number} [options.minLength=2] - 검색 시작을 위한 최소 입력 글자 수
     * @param {number} [options.delay=300] - 타이핑 후 검색 시작까지 지연 시간 (ms)
     * @param {boolean} [options.autoFocus=true] - 첫 번째 항목 자동 포커스 여부
     * @param {string} [options.cssClass='custom-autocomplete'] - 자동완성 메뉴에 적용할 CSS 클래스
     * @param {boolean} [options.showOnClick=false] - 클릭 시 자동완성 목록 표시 여부
     * @param {Function} [options.onSelect] - 항목 선택 시 호출될 콜백 함수 (selectedItem, inputElement) => {}
     * @param {Function} [options.renderItem] - 항목 렌더링을 커스터마이징하는 함수 (ul, item) => $li
     * @param {boolean} [options.readOnly=false] - 입력 요소가 읽기 전용인 경우 자동완성 비활성화
     * @param {boolean} [options.closeOnScroll=true] - 스크롤 시 자동완성 목록 닫기 여부
     * @param {string} [options.mustMatch] - 목록에서 고르지 않은 글자가 남으면 이 문구로 알리고 칸을 비운다
     * @returns {jQuery} - 자동완성이 적용된 jQuery 객체
     */
    utils.ui.autocomplete = function(selector, options) {
        // 기본 옵션 정의
        const defaults = {
            url: '',
            params: {},
            searchParam: 'searchKeyword',
            minLength: 0,
            delay: 300,
            autoFocus: true,
            cssClass: 'custom-autocomplete',
            showOnClick: true, // 기본값을 true로 변경
            readOnly: false,
            closeOnScroll: true, // 스크롤 시 자동완성 닫기 기본값
            dataConverter: function(item) {
                // 기본 데이터 변환 함수
                return {
                    label: item.label || item.name || item.text || item.title || item.value || item,
                    value: item.value || item.id || item.code || item.key || item.label || item
                };
            },
			renderItem: function(ul, item) {
			    // 글자는 .text() 로 넣는다 — 부서명 · 사용자명 등 DB 값이라 HTML 로 넣으면 스크립트가 실행될 수 있다 (2026-10-15 보안점검 M-8)
			    var $div = $("<div style='min-width:300px; white-space:nowrap;'><i class='fa-solid fa-search' style='margin-right:5px;'></i></div>");
			    $div.append(document.createTextNode(item.label == null ? '' : String(item.label)));
			    return $("<li>")
			        .append($div)
			        .appendTo(ul);
			}
        };

        // 옵션 병합
        const settings = $.extend(true, {}, defaults, options);

        // jQuery 객체 얻기
        let $element = typeof selector === 'string' ? $(selector) : selector;

        // 요소 확인
        if (!$element.length) {
            console.error('biz.ui.autocomplete: 선택자에 맞는 요소를 찾을 수 없습니다.', selector);
            return $element;
        }

        // 읽기 전용 여부 확인
        if (settings.readOnly || $element.prop('readonly')) {
            console.log('biz.ui.autocomplete: 읽기 전용 요소는 자동완성이 비활성화됩니다.');
            return $element;
        }

        // URL 확인
        if (!settings.url) {
            console.error('biz.ui.autocomplete: URL이 지정되지 않았습니다.');
            return $element;
        }

        // 데이터 요청 함수
        function fetchData(searchTerm, response) {
            // 요청 파라미터 구성
            let params = $.extend({}, settings.params);

            // 검색 파라미터 설정
            params[settings.searchParam] = searchTerm || '';

            // 검색 유형이 있으면 추가
            if (settings.searchType) {
                params.searchType = settings.searchType;
            }

            // 추가 동적 파라미터가 있으면 처리
            if (typeof settings.getAdditionalParams === 'function') {
                const additionalParams = settings.getAdditionalParams.call($element);
                params = $.extend(params, additionalParams);
            }

            // 서버에 검색 요청
            $.ajax({
                url: settings.url,
                dataType: "json",
                data: params,
                success: function(data) {
                    // 데이터가 있는지 확인
                    if (!data) {
                        response([]);
                        return;
                    }

                    // 데이터 형식에 따라 처리
                    let items = data;
                    if (data.data && Array.isArray(data.data)) {
                        items = data.data;
                    } else if (Array.isArray(data.items)) {
                        items = data.items;
                    } else if (Array.isArray(data.list)) {
                        items = data.list;
                    } else if (!Array.isArray(data)) {
                        items = [data];
                    }

                    // 데이터 변환
                    response($.map(items, settings.dataConverter));
                },
                error: function(xhr, status, error) {
                    console.error('자동완성 데이터 로드 중 오류:', error);
                    response([]);
                }
            });
        }

        // 스크롤 이벤트 핸들러 생성
        function createScrollHandler($element, settings) {
            return function(e) {
                const autocompleteInstance = $element.autocomplete("instance");
                if (autocompleteInstance && autocompleteInstance.menu.element.is(':visible')) {
                    
                    // 자동완성 메뉴 내부에서 발생한 스크롤인지 확인
                    const $menu = autocompleteInstance.menu.element;
                    const $target = $(e.target);
                    
                    // 자동완성 메뉴나 그 하위 요소에서 발생한 스크롤은 무시
                    if ($target.is($menu) || $target.closest($menu).length > 0) {
                        return;
                    }
                    
                    if (settings.closeOnScroll) {
                        // 스크롤 시 자동완성 닫기
                        $element.autocomplete("close");
                    } else {
                        // 스크롤 시 위치 재조정
                        setTimeout(function() {
                            if (autocompleteInstance.menu.element.is(':visible')) {
                                const offset = $element.offset();
                                const height = $element.outerHeight();
                                
                                autocompleteInstance.menu.element.css({
                                    position: 'absolute',
                                    top: offset.top + height,
                                    left: offset.left,
                                    zIndex: 9999
                                });
                            }
                        }, 10);
                    }
                }
            };
        }

        // jQuery UI autocomplete 적용
        $element.autocomplete({
            source: function(request, response) {
                // 클릭 시 표시 옵션이 활성화되어 있고, 검색어가 없거나 최소 길이보다 짧을 때
                if (settings.showOnClick && (request.term === '' || request.term.length < settings.minLength)) {
                    // 빈 검색어로 데이터 요청
                    fetchData('', response);
                    return;
                }
                
                // 검색어가 최소 글자 수보다 적으면 검색하지 않음 (showOnClick이 false인 경우)
                if (!settings.showOnClick && request.term.length < settings.minLength) {
                    response([]);
                    return;
                }

                // 일반적인 검색 수행
                fetchData(request.term, response);
            },
            minLength: settings.showOnClick ? 0 : settings.minLength, // 클릭 시 표시 옵션이면 minLength를 0으로 설정
            delay: settings.delay,
            autoFocus: settings.autoFocus,
            classes: {
                "ui-autocomplete": settings.cssClass
            },
            // 자동완성 메뉴가 열릴 때 스크롤 이벤트 바인딩
            open: function(event, ui) {
                const scrollHandler = createScrollHandler($element, settings);
                const namespace = '.autocomplete-' + ($element.attr('id') || 'default');
                
                // 스크롤 이벤트 바인딩 (네임스페이스 사용)
                $(window).on('scroll' + namespace, scrollHandler);
                
                // 부모 요소들의 스크롤 이벤트도 바인딩
                $element.parents().each(function() {
                    $(this).on('scroll' + namespace, scrollHandler);
                });
                
                // 모바일 터치 이벤트 처리 - 좌우 움직임 완전 차단, 위아래만 허용
                const $menu = $(this).autocomplete("widget");
                let initialLeft = null;
                
                $menu.on('touchstart' + namespace, function(e) {
                    // 초기 좌측 위치 저장
                    const inputOffset = $element.offset();
                    initialLeft = inputOffset.left;
                    
                    // 좌측 위치 즉시 고정
                    $menu.css({
                        left: initialLeft + 'px'
                    });
                });
                
                $menu.on('touchmove' + namespace, function(e) {
                    // 터치 이동 시 항상 좌측 위치 고정
                    if (initialLeft !== null) {
                        $menu.css({
                            left: initialLeft + 'px'
                        });
                    }
                });
                
                $menu.on('touchend' + namespace, function(e) {
                    // 터치 종료 후에도 좌측 위치 고정 유지
                    if (initialLeft !== null) {
                        $menu.css({
                            left: initialLeft + 'px'
                        });
                    }
                });
                
                // 메뉴의 스크롤 영역에 CSS로 좌우 스크롤 차단
                $menu.css({
                    'overflow-x': 'hidden',
                    'touch-action': 'pan-y' // 세로 터치만 허용
                });
                
                // 추가적인 위치 고정을 위한 타이머
                const positionFixInterval = setInterval(function() {
                    if ($menu.is(':visible') && initialLeft !== null) {
                        $menu.css({
                            left: initialLeft + 'px'
                        });
                    } else if (!$menu.is(':visible')) {
                        clearInterval(positionFixInterval);
                    }
                }, 50);
                
                // 사용자 정의 open 콜백 호출
                if (typeof settings.onOpen === 'function') {
                    settings.onOpen.call(this, event, ui);
                }
            },
            // 자동완성 메뉴가 닫힐 때 스크롤 이벤트 해제
            close: function(event, ui) {
                const namespace = '.autocomplete-' + ($element.attr('id') || 'default');
                
                // 스크롤 이벤트 해제
                $(window).off(namespace);
                $element.parents().off(namespace);
                
                // 자동완성 메뉴의 터치 이벤트도 해제
                const $menu = $(this).autocomplete("widget");
                $menu.off(namespace);
                
                // 사용자 정의 close 콜백 호출
                if (typeof settings.onClose === 'function') {
                    settings.onClose.call(this, event, ui);
                }
            },
            // 항목 선택 시 이벤트
            select: function(event, ui) {
                if (typeof settings.onSelect === 'function') {
                    // 사용자 정의 선택 핸들러 호출
                    const result = settings.onSelect.call(this, ui.item, this);

                    // 반환값이 false이면 기본 동작 방지
                    if (result === false) {
                        return false;
                    }
                }

                // 기본 동작: 선택한 항목의 값을 입력 필드에 설정
                $(this).val(ui.item.value);
                // 고른 값을 기억해 둔다. 클릭으로 목록을 다시 열 때 검색어로 쓸지 판단한다.
                $(this).data('biz-ac-selected', ui.item.value);
                return false;
            },
            // mustMatch 칸은 목록에서 고르지 않고 벗어나면 알림 후 비운다(input 을 발생시켜 화면의 숨은 코드도 비운다)
            change: function(event, ui) {
                if (!settings.mustMatch || ui.item || $.trim($(this).val()) === '') return;

                const $input = $(this);
                $input.val('').removeData('biz-ac-selected').trigger('input');
                clearTimeout($input.autocomplete('instance').searching);   // 비운 값으로 목록이 다시 열리지 않게
                utils.showAlert(settings.mustMatch, function() { $input.trigger('focus'); });
            },
            // 포커스 이벤트 (하이라이트된 항목이 변경될 때)
            focus: function(event, ui) {
                //-- 키보드 네이게이션 이벤트 제거
                event.stopPropagation();
                return false;
            }
        });

        // 클릭 시 자동완성 목록 표시 기능 추가
        if (settings.showOnClick) {
            let isProcessing = false;
            
            $element.on('click.autocomplete', function(e) {
                // 이미 처리 중이면 무시
                if (isProcessing) return;
                
                isProcessing = true;
                
                setTimeout(() => {
                    // 자동완성이 닫혀있을 때만 열기
                    if (!$element.autocomplete("widget").is(":visible")) {
                        // 이미 고른 값이 그대로면 그 글자로는 검색되지 않으므로 전체 목록을 연다.
                        const curVal = $element.val();
                        $element.autocomplete("search",
                            $element.data('biz-ac-selected') === curVal ? '' : curVal);
                    }
                    isProcessing = false;
                }, 10);
            });
            
            // 포커스 이벤트는 별도로 처리 (선택적)
            $element.on('focus.autocomplete', function(e) {
                // 포커스만으로는 자동완성을 열지 않음
                // 필요하다면 여기에 추가 로직 구현
            });
        }

        // 커스텀 렌더링 함수 설정
        if (settings.renderItem) {
            $element.autocomplete("instance")._renderItem = settings.renderItem;
        }

        // 자동완성 메뉴 위치 조정 - 항상 아래로 표시하되 화면 크기에 맞게 높이 제한
        $element.autocomplete("option", "position", {
            my: "left top+2",
            at: "left bottom",
            collision: "none", // 항상 아래로 고정
            using: function(position, feedback) {
                const $menu = $(this);
                const $input = feedback.target.element;
                
                // 현재 입력 필드 위치와 크기 정보
                const inputOffset = $input.offset();
                const inputHeight = $input.outerHeight();
                
                // 화면(뷰포트) 크기 정보
                const windowHeight = $(window).height();
                const scrollTop = $(window).scrollTop();
                
                // 자동완성 목록이 표시될 수 있는 최대 높이 계산
                const menuTop = inputOffset.top + inputHeight + 2; // 입력 필드 아래 + 여백
                const availableHeight = windowHeight + scrollTop - menuTop - 10; // 여백 10px 확보
                
                // 위치 설정 - 좌우 위치만 고정하고 위아래는 자유롭게
                $menu.css({
                    position: 'absolute',
                    top: position.top,
                    left: inputOffset.left, // 좌측 위치 고정
                    maxHeight: Math.max(150, availableHeight) + 'px',
                    overflowY: 'auto',
                    zIndex: 9999,
//                    width: $input.outerWidth() + 'px' // 입력 필드와 같은 너비
					minWidth: $input.outerWidth() + 'px',
                });
            }
        });

        // 입력 요소에 자동완성 설정 데이터 저장
        $element.data('biz-autocomplete-settings', settings);

        // 자동완성이 적용된 요소 반환
        return $element;
    };

    /**
     * 자동완성 설정 업데이트 함수
     * @param {string|jQuery} selector - 자동완성이 적용된 입력 요소 선택자 또는 jQuery 객체
     * @param {Object} options - 업데이트할 옵션
     */
    utils.ui.autocomplete.update = function(selector, options) {
        const $element = typeof selector === 'string' ? $(selector) : selector;

        if (!$element.length || !$element.autocomplete("instance")) {
            console.error('biz.ui.autocomplete.update: 자동완성이 적용되지 않은 요소입니다.', selector);
            return;
        }

        // 기존 설정 가져오기
        const currentSettings = $element.data('biz-autocomplete-settings') || {};

        // 새 설정 병합
        const newSettings = $.extend(true, {}, currentSettings, options);

        // 설정 업데이트
        $element.data('biz-autocomplete-settings', newSettings);

        // 업데이트 가능한 옵션들 적용
        if (options.minLength !== undefined) {
            $element.autocomplete("option", "minLength", options.minLength);
        }

        if (options.delay !== undefined) {
            $element.autocomplete("option", "delay", options.delay);
        }

        if (options.autoFocus !== undefined) {
            $element.autocomplete("option", "autoFocus", options.autoFocus);
        }

        if (options.cssClass !== undefined) {
            $element.autocomplete("option", "classes", {
                "ui-autocomplete": options.cssClass
            });
        }

        // 위치 옵션 업데이트
        if (options.position) {
            $element.autocomplete("option", "position", options.position);
        }

        // closeOnScroll 옵션 업데이트
        if (options.closeOnScroll !== undefined) {
            // 기존 스크롤 이벤트 제거
            const namespace = '.autocomplete-' + ($element.attr('id') || 'default');
            $(window).off(namespace);
            $element.parents().off(namespace);
            
            // 새 설정으로 스크롤 핸들러 재생성 (자동완성이 열려있을 때만)
            if ($element.autocomplete("widget").is(":visible")) {
                const scrollHandler = createScrollHandler($element, newSettings);
                $(window).on('scroll' + namespace, scrollHandler);
                $element.parents().each(function() {
                    $(this).on('scroll' + namespace, scrollHandler);
                });
            }
        }

        // showOnClick 옵션 업데이트
        if (options.showOnClick !== undefined) {
            if (options.showOnClick) {
                let isProcessing = false;
                
                // 기존 이벤트 제거
                $element.off('click.autocomplete focus.autocomplete');
                
                // 클릭 이벤트 추가
                $element.on('click.autocomplete', function(e) {
                    if (isProcessing) return;
                    
                    isProcessing = true;
                    
                    setTimeout(() => {
                        if (!$element.autocomplete("widget").is(":visible")) {
                            $element.autocomplete("search", $element.val());
                        }
                        isProcessing = false;
                    }, 10);
                });
                
                // minLength를 0으로 설정
                $element.autocomplete("option", "minLength", 0);
            } else {
                // 클릭 이벤트 제거
                $element.off('click.autocomplete focus.autocomplete');
                // minLength를 원래 값으로 복원
                $element.autocomplete("option", "minLength", newSettings.minLength || 2);
            }
        }
    };

    /**
     * 자동완성 비활성화 함수
     * @param {string|jQuery} selector - 자동완성이 적용된 입력 요소 선택자 또는 jQuery 객체
     */
    utils.ui.autocomplete.disable = function(selector) {
        const $element = typeof selector === 'string' ? $(selector) : selector;

        if ($element.length && $element.autocomplete("instance")) {
            $element.autocomplete("disable");
        }
    };

    /**
     * 자동완성 활성화 함수
     * @param {string|jQuery} selector - 자동완성이 적용된 입력 요소 선택자 또는 jQuery 객체
     */
    utils.ui.autocomplete.enable = function(selector) {
        const $element = typeof selector === 'string' ? $(selector) : selector;

        if ($element.length && $element.autocomplete("instance")) {
            $element.autocomplete("enable");
        }
    };

    /**
     * 자동완성 제거 함수
     * @param {string|jQuery} selector - 자동완성이 적용된 입력 요소 선택자 또는 jQuery 객체
     */
    utils.ui.autocomplete.destroy = function(selector) {
        const $element = typeof selector === 'string' ? $(selector) : selector;

        if ($element.length && $element.autocomplete("instance")) {
            // 스크롤 이벤트 제거
            const namespace = '.autocomplete-' + ($element.attr('id') || 'default');
            $(window).off(namespace);
            $element.parents().off(namespace);
            
            // 자동완성 메뉴의 터치 이벤트도 해제
            const $menu = $element.autocomplete("widget");
            $menu.off(namespace);
            
            $element.autocomplete("destroy");
            $element.removeData('biz-autocomplete-settings');
            // 추가된 이벤트 리스너도 제거
            $element.off('click.autocomplete focus.autocomplete');
        }
    };

    // 스크롤 핸들러 생성 함수를 전역으로 사용할 수 있도록 내보내기
    function createScrollHandler($element, settings) {
        return function(e) {
            const autocompleteInstance = $element.autocomplete("instance");
            if (autocompleteInstance && autocompleteInstance.menu.element.is(':visible')) {
                
                // 자동완성 메뉴 내부에서 발생한 스크롤인지 확인
                const $menu = autocompleteInstance.menu.element;
                const $target = $(e.target);
                
                // 자동완성 메뉴나 그 하위 요소에서 발생한 스크롤은 무시
                if ($target.is($menu) || $target.closest($menu).length > 0) {
                    return;
                }
                
                if (settings.closeOnScroll) {
                    // 스크롤 시 자동완성 닫기
                    $element.autocomplete("close");
                } else {
                    // 스크롤 시 위치 재조정
                    setTimeout(function() {
                        if (autocompleteInstance.menu.element.is(':visible')) {
                            const offset = $element.offset();
                            const height = $element.outerHeight();
                            
                            autocompleteInstance.menu.element.css({
                                position: 'absolute',
                                top: offset.top + height,
                                left: offset.left,
                                zIndex: 9999
                            });
                        }
                    }, 10);
                }
            }
        };
    }

})(window.biz);