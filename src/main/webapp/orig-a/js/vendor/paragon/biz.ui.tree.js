/**
 * biz.ui.tree.js - jsTree 기반 트리 컴포넌트 관련 유틸리티
 * Author: Developed based on requirements
 * Copyright 2025 Vertexid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(utils) {
    // 트리 관련 유틸리티 네임스페이스 생성
    utils.ui = utils.ui || {};
    utils.ui.tree = utils.ui.tree || {};

    // 트리 인스턴스 저장소
    const _treeInstances = {};

    // 기본 옵션
    const _defaultOptions = {
        core: {
            themes: {
                name: 'default',
                dots: true,
                icons: true,
                // variant: 'large' 는 아이콘·행 높이를 32px 로 키운다(화면설계 지적사항) — 기본값(24px) 사용.
                responsive: true
            },
            check_callback: true,
            multiple: false,
            worker: false,
            animation: 200
        },
        types: {
            // 폴더·파일 아이콘은 fas/fa- 프리픽스를 쓰지 않는다 — FontAwesome JS(all.min.js)가
            // fas 계열 <i> 를 감지해 <svg> 로 바꿔치기해 버려서 CSS ::before 로 열림/닫힘
            // 글리프를 바꿔치기할 수 없다(브라우저 확인). 클래스명은 프로젝트 규칙(snake_case,
            // 벤더 접두 없음)을 따른다. layout.css 의 트리 절에서 .tree_folder_icon /
            // .tree_file_icon 자체에 웹폰트 글리프를 직접 지정한다(둘 다 같은 방식·같은 크기).
            default: {
                icon: "tree_folder_icon"
            },
            folder: {
                icon: "tree_folder_icon"
            },
            file: {
                icon: "tree_file_icon"
            }
        },
        state: {
            key: "biz-jstree-state"
        },
        plugins: ["types", "state", "wholerow"]
    };

    /**
     * 트리 초기화 함수
     * @param {string} selector - 트리를 생성할 DOM 요소의 선택자
     * @param {object} options - 트리 옵션
     * @returns {object} - 생성된 jsTree 인스턴스
     */
    utils.ui.tree.init = function(selector, options) {
        if (!selector) {
            console.error("selector가 제공되지 않았습니다.");
            return null;
        }

        // jQuery 객체 확인
        const $element = $(selector);
        if ($element.length === 0) {
            console.error("선택자와 일치하는 요소를 찾을 수 없습니다:", selector);
            return null;
        }

        // 요소의 ID 확인
        const treeId = $element.attr('id');
        if (!treeId) {
            console.error("트리 요소에 ID가 필요합니다.");
            return null;
        }

        // 이미 초기화되었는지 확인
//        if (_treeInstances[treeId]) {
//            console.warn("이미 초기화된 트리입니다:", treeId);
//            return _treeInstances[treeId];
//        }

        // 기본 옵션과 사용자 지정 옵션 병합
        const mergedOptions = mergeOptions(_defaultOptions, options || {});

        // 특별한 데이터 소스 처리 (URL인 경우)
        if (typeof mergedOptions.data === 'string' && mergedOptions.data.startsWith('/')) {
            // URL로부터 데이터 로드 설정
            mergedOptions.core.data = {
                url: utils.getUrl(mergedOptions.data),
                data: function(node) {
                    return { id: node.id === '#' ? '' : node.id };
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('트리 데이터 로드 중 오류 발생:', errorThrown);
                }
            };
            // data 속성 제거 (core.data로 이동했으므로)
            delete mergedOptions.data;
        } else if (mergedOptions.data) {
            // 직접 데이터 배열이 제공된 경우
            mergedOptions.core.data = mergedOptions.data;
            delete mergedOptions.data;
        }

        try {
            // jsTree 초기화
            const treeInstance = $element.jstree(mergedOptions);

            // 트리 인스턴스 저장
            _treeInstances[treeId] = treeInstance;

            // 기본 이벤트 바인딩 (선택 이벤트)
            if (mergedOptions.onSelect && typeof mergedOptions.onSelect === 'function') {
                treeInstance.on('select_node.jstree', function(e, data) {
                    mergedOptions.onSelect(data.node, e);
                });
            }

            return treeInstance;
        } catch (error) {
            console.error("트리 초기화 중 오류 발생:", error);
            return null;
        }
    };

    /**
     * 트리 인스턴스 가져오기
     * @param {string} selector - 트리 요소의 선택자 또는 ID
     * @returns {object} - jsTree 인스턴스
     */
    utils.ui.tree.getInstance = function(selector) {
        let treeId;

        // 선택자가 ID인지 확인
        if (selector.startsWith('#')) {
            treeId = selector.substring(1);
        } else if (document.getElementById(selector)) {
            treeId = selector;
        } else {
            // jQuery 선택자로 처리
            const $element = $(selector);
            if ($element.length === 0) {
                console.error("선택자와 일치하는 요소를 찾을 수 없습니다:", selector);
                return null;
            }
            treeId = $element.attr('id');
        }

        if (!treeId || !_treeInstances[treeId]) {
            console.error("초기화되지 않은 트리입니다:", selector);
            return null;
        }

        return _treeInstances[treeId];
    };

    /**
     * 트리 데이터 로드 함수
     * @param {string} selector - 트리 요소의 선택자
     * @param {Array|string} data - 트리 데이터 또는 데이터를 가져올 URL
     * @param {Function} callback - 데이터 로드 후 실행할 콜백 함수
     */
    utils.ui.tree.loadData = function(selector, data, callback) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            if (typeof data === 'string' && data.startsWith('/')) {
                // URL인 경우 AJAX 요청
                $.ajax({
                    url: utils.getUrl(data),
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        treeInstance.jstree(true).settings.core.data = response;
                        treeInstance.jstree(true).refresh();

                        if (typeof callback === 'function') {
                            callback(response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('트리 데이터 로드 중 오류 발생:', error);

                        if (typeof callback === 'function') {
                            callback({ error: error });
                        }
                    }
                });
            } else {
                // 직접 데이터 배열이 제공된 경우
                treeInstance.jstree(true).settings.core.data = data;
                treeInstance.jstree(true).refresh();

                if (typeof callback === 'function') {
                    callback(data);
                }
            }
        } catch (error) {
            console.error("트리 데이터 로드 중 오류 발생:", error);

            if (typeof callback === 'function') {
                callback({ error: error });
            }
        }
    };

    /**
     * 선택된 노드 가져오기
     * @param {string} selector - 트리 요소의 선택자
     * @returns {object|array} - 선택된 노드 또는 노드 배열
     */
    utils.ui.tree.getSelectedNode = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return null;

        try {
            const selectedNodes = treeInstance.jstree(true).get_selected(true);
            return selectedNodes.length > 0 ? selectedNodes : null;
        } catch (error) {
            console.error("선택된 노드 가져오기 중 오류 발생:", error);
            return null;
        }
    };

    /**
     * 노드 선택하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string} nodeId - 선택할 노드 ID
     * @param {boolean} triggerEvent - 선택 이벤트 발생 여부 (기본값: true)
     */
    utils.ui.tree.selectNode = function(selector, nodeId, triggerEvent = true) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).deselect_all();
            treeInstance.jstree(true).select_node(nodeId, triggerEvent);
        } catch (error) {
            console.error("노드 선택 중 오류 발생:", error);
        }
    };

    /**
     * 노드 추가하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string} parentId - 부모 노드 ID (루트에 추가하려면 '#')
     * @param {object|array} nodeData - 추가할 노드 데이터 또는 노드 배열
     * @param {string} position - 삽입 위치 (기본값: 'last')
     * @returns {string} - 추가된 노드의 ID
     */
    utils.ui.tree.addNode = function(selector, parentId, nodeData, position = 'last') {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return null;

        try {
            return treeInstance.jstree(true).create_node(parentId, nodeData, position);
        } catch (error) {
            console.error("노드 추가 중 오류 발생:", error);
            return null;
        }
    };

    /**
     * 노드 삭제하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string|array} nodeId - 삭제할 노드 ID 또는 ID 배열
     * @returns {boolean} - 삭제 성공 여부
     */
    utils.ui.tree.removeNode = function(selector, nodeId) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return false;

        try {
            return treeInstance.jstree(true).delete_node(nodeId);
        } catch (error) {
            console.error("노드 삭제 중 오류 발생:", error);
            return false;
        }
    };

    /**
     * 노드 업데이트하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string} nodeId - 업데이트할 노드 ID
     * @param {object} nodeData - 업데이트할 노드 데이터
     * @returns {boolean} - 업데이트 성공 여부
     */
    utils.ui.tree.updateNode = function(selector, nodeId, nodeData) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return false;

        try {
            // 노드 참조 가져오기
            const node = treeInstance.jstree(true).get_node(nodeId);
            if (!node) return false;

            // 노드 속성 업데이트
            for (const key in nodeData) {
                if (key === 'text') {
                    treeInstance.jstree(true).rename_node(node, nodeData[key]);
                } else if (key === 'icon') {
                    treeInstance.jstree(true).set_icon(node, nodeData[key]);
                } else {
                    node[key] = nodeData[key];
                }
            }

            // 노드 리프레시
            treeInstance.jstree(true).redraw_node(nodeId, true);
            return true;
        } catch (error) {
            console.error("노드 업데이트 중 오류 발생:", error);
            return false;
        }
    };

    /**
     * 노드 열기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string|array} nodeId - 열 노드 ID 또는 ID 배열
     */
    utils.ui.tree.openNode = function(selector, nodeId) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).open_node(nodeId);
        } catch (error) {
            console.error("노드 열기 중 오류 발생:", error);
        }
    };

    /**
     * 노드 닫기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string|array} nodeId - 닫을 노드 ID 또는 ID 배열
     */
    utils.ui.tree.closeNode = function(selector, nodeId) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).close_node(nodeId);
        } catch (error) {
            console.error("노드 닫기 중 오류 발생:", error);
        }
    };

    /**
     * 모든 노드 열기
     * @param {string} selector - 트리 요소의 선택자
     */
    utils.ui.tree.openAll = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).open_all();
        } catch (error) {
            console.error("모든 노드 열기 중 오류 발생:", error);
        }
    };

    /**
     * 모든 노드 닫기
     * @param {string} selector - 트리 요소의 선택자
     */
    utils.ui.tree.closeAll = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).close_all();
        } catch (error) {
            console.error("모든 노드 닫기 중 오류 발생:", error);
        }
    };

    /**
     * 트리 새로고침
     * @param {string} selector - 트리 요소의 선택자
     */
    utils.ui.tree.refresh = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).refresh();
        } catch (error) {
            console.error("트리 새로고침 중 오류 발생:", error);
        }
    };

    /**
     * 트리 검색 함수
     * @param {string} selector - 트리 요소의 선택자
     * @param {string} query - 검색할 텍스트
     * @param {boolean} showOnly - 일치하는 노드만 표시할지 여부 (기본값: false)
     * @param {boolean} caseSensitive - 대소문자 구분 여부 (기본값: false)
     * @param {boolean} exactMatch - 정확한 일치 여부 (기본값: false)
     */
    utils.ui.tree.search = function(selector, query, showOnly = false, caseSensitive = false, exactMatch = false) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            // 검색 플러그인이 없으면 추가
            if (!treeInstance.jstree(true).settings.plugins.includes("search")) {
                console.warn("검색 기능을 사용하려면 'search' 플러그인이 필요합니다. 플러그인을 자동으로 추가합니다.");
                treeInstance.jstree(true).settings.plugins.push("search");
            }

            // 검색 수행
            treeInstance.jstree(true).search(query, false, showOnly, {
                case_sensitive: caseSensitive,
                exact: exactMatch
            });
        } catch (error) {
            console.error("트리 검색 중 오류 발생:", error);
        }
    };

    /**
     * 트리 이벤트 핸들러 등록
     * @param {string} selector - 트리 요소의 선택자
     * @param {string} eventName - 이벤트 이름 (예: 'select_node', 'create_node')
     * @param {Function} callback - 이벤트 핸들러 함수
     */
    utils.ui.tree.on = function(selector, eventName, callback) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            // jsTree 이벤트 이름에 '.jstree' 접미사 추가
            if (!eventName.endsWith('.jstree')) {
                eventName += '.jstree';
            }

            treeInstance.on(eventName, callback);
        } catch (error) {
            console.error("트리 이벤트 핸들러 등록 중 오류 발생:", error);
        }
    };

    /**
     * 부모-자식 관계의 JSON 데이터를 jsTree 형식으로 변환
     * @param {Array} data - 원본 데이터 배열
     * @param {object} options - 변환 옵션
     * @param {string} options.idKey - ID 필드 이름 (기본값: 'id')
     * @param {string} options.parentKey - 부모 ID 필드 이름 (기본값: 'parentId')
     * @param {string} options.textKey - 텍스트 필드 이름 (기본값: 'text')
     * @param {string} options.rootId - 루트 노드를 식별하는 값 (기본값: null)
     * @returns {Array} - jsTree 형식의 데이터
     */
    utils.ui.tree.convertToTreeFormat = function(data, options = {}) {
        if (!data || !Array.isArray(data)) {
            console.error("유효한 데이터 배열이 아닙니다.");
            return [];
        }

        const opts = {
            idKey: options.idKey || 'id',
            parentKey: options.parentKey || 'parentId',
            textKey: options.textKey || 'text',
            rootId: options.rootId !== undefined ? options.rootId : null
        };

        try {
            // 데이터를 ID 기준 맵으로 변환
            const dataMap = new Map();
            const result = [];

            // 첫 번째 패스: 맵 생성 및 노드 초기화
            data.forEach(item => {
                const id = item[opts.idKey];

                // jsTree 노드 형식으로 변환
                const node = {
                    id: id.toString(),
                    text: item[opts.textKey] || '무제',
                    children: [],
                    data: { ...item } // 원본 데이터 보존
                };

                // 노드 타입 설정 (type 속성이 있으면 사용)
                if (item.type) {
                    node.type = item.type;
                }

                // 아이콘 설정 (icon 속성이 있으면 사용)
                if (item.icon) {
                    node.icon = item.icon;
                }

                // 맵에 저장
                dataMap.set(id.toString(), node);
            });

            // 두 번째 패스: 부모-자식 관계 설정
            data.forEach(item => {
                const id = item[opts.idKey].toString();
                const parentId = item[opts.parentKey] !== undefined ? item[opts.parentKey].toString() : null;

                const node = dataMap.get(id);

                if (parentId === opts.rootId || parentId === null || parentId === undefined || !dataMap.has(parentId)) {
                    // 루트 노드
                    result.push(node);
                } else {
                    // 부모 노드에 자식으로 추가
                    const parentNode = dataMap.get(parentId);
                    if (parentNode) {
                        parentNode.children.push(node);
                    } else {
                        // 부모 노드를 찾을 수 없는 경우 루트로 처리
                        result.push(node);
                    }
                }
            });

            return result;
        } catch (error) {
            console.error("트리 데이터 변환 중 오류 발생:", error);
            return [];
        }
    };

    /**
     * jsTree에서 체크박스 기능 초기화
     * @param {string} selector - 트리 요소의 선택자
     * @param {object} options - 체크박스 옵션
     * @param {Function} options.onCheck - 체크 변경 시 호출할 콜백 함수
     * @returns {boolean} - 초기화 성공 여부
     */
    utils.ui.tree.initCheckbox = function(selector, options = {}) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return false;

        try {
            // 현재 설정 가져오기
            const currentSettings = treeInstance.jstree(true).settings;
            // checkbox 플러그인이 있는지 확인
            if (!currentSettings.plugins.includes("checkbox")) {
                console.warn("체크박스 기능을 사용하려면 'checkbox' 플러그인이 필요합니다. 플러그인을 자동으로 추가합니다.");

                // 플러그인 추가
                currentSettings.plugins.push("checkbox");

                // 체크박스 옵션 설정
                currentSettings.checkbox = {
                    three_state: true,
                    whole_node: false,
                    cascade: 'down+undetermined'
                };

                // 옵션이 있으면 병합
                if (options.checkboxOptions) {
                    currentSettings.checkbox = {
                        ...currentSettings.checkbox,
                        ...options.checkboxOptions
                    };
                }

                // 트리 새로고침
                treeInstance.jstree(true).refresh();

                // 체크 이벤트 핸들러 등록
                if (options.onCheck && typeof options.onCheck === 'function') {
                    treeInstance.on('check_node.jstree uncheck_node.jstree', function(e, data) {
                        options.onCheck(data.node, e);
                    });
                }

                return true;
            } else {
                console.warn("이미 체크박스 플러그인이 초기화되어 있습니다.");
                return true;
            }
        } catch (error) {
            console.error("체크박스 초기화 중 오류 발생:", error);
            return false;
        }
    };

    /**
     * 체크된 노드 가져오기
     * @param {string} selector - 트리 요소의 선택자
     * @returns {array} - 체크된 노드 배열
     */
    utils.ui.tree.getCheckedNodes = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return [];

        try {
            return treeInstance.jstree(true).get_checked(true);
        } catch (error) {
            console.error("체크된 노드 가져오기 중 오류 발생:", error);
            return [];
        }
    };

    /**
     * 노드 체크하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string|array} nodeId - 체크할 노드 ID 또는 ID 배열
     */
    utils.ui.tree.checkNode = function(selector, nodeId) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).check_node(nodeId);
        } catch (error) {
            console.error("노드 체크 중 오류 발생:", error);
        }
    };

    /**
     * 노드 체크 해제하기
     * @param {string} selector - 트리 요소의 선택자
     * @param {string|array} nodeId - 체크 해제할 노드 ID 또는 ID 배열
     */
    utils.ui.tree.uncheckNode = function(selector, nodeId) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).uncheck_node(nodeId);
        } catch (error) {
            console.error("노드 체크 해제 중 오류 발생:", error);
        }
    };

    /**
     * 모든 노드 체크하기
     * @param {string} selector - 트리 요소의 선택자
     */
    utils.ui.tree.checkAll = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).check_all();
        } catch (error) {
            console.error("모든 노드 체크 중 오류 발생:", error);
        }
    };

    /**
     * 모든 노드 체크 해제하기
     * @param {string} selector - 트리 요소의 선택자
     */
    utils.ui.tree.uncheckAll = function(selector) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return;

        try {
            treeInstance.jstree(true).uncheck_all();
        } catch (error) {
            console.error("모든 노드 체크 해제 중 오류 발생:", error);
        }
    };

    /**
     * 노드 드래그 앤 드롭 기능 초기화
     * @param {string} selector - 트리 요소의 선택자
     * @param {object} options - 드래그 앤 드롭 옵션
     * @returns {boolean} - 초기화 성공 여부
     */
    utils.ui.tree.initDragAndDrop = function(selector, options = {}) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return false;

        try {
            // 현재 설정 가져오기
            const currentSettings = treeInstance.jstree(true).settings;

            // dnd 플러그인이 있는지 확인
            if (!currentSettings.plugins.includes("dnd")) {
                console.warn("드래그 앤 드롭 기능을 사용하려면 'dnd' 플러그인이 필요합니다. 플러그인을 자동으로 추가합니다.");

                // 플러그인 추가
                currentSettings.plugins.push("dnd");

                // 드래그 앤 드롭 옵션 설정
                currentSettings.dnd = {
                    is_draggable: true,
                    check_while_dragging: true,
                    touch: true,
                    large_drop_target: true,
                    large_drag_target: true
                };

                // 옵션이 있으면 병합
                if (options.dndOptions) {
                    currentSettings.dnd = {
                        ...currentSettings.dnd,
                        ...options.dndOptions
                    };
                }

                // 트리 새로고침
                treeInstance.jstree(true).refresh();

                // 이동 이벤트 핸들러 등록
                if (options.onMove && typeof options.onMove === 'function') {
                    treeInstance.on('move_node.jstree', function(e, data) {
                        options.onMove(data, e);
                    });
                }

                return true;
            } else {
                console.warn("이미 드래그 앤 드롭 플러그인이 초기화되어 있습니다.");
                return true;
            }
        } catch (error) {
            console.error("드래그 앤 드롭 초기화 중 오류 발생:", error);
            return false;
        }
    };

    /**
     * 컨텍스트 메뉴 초기화 함수
     * @param {string} selector - 트리 요소의 선택자
     * @param {object} items - 메뉴 아이템 객체
     * @returns {boolean} - 초기화 성공 여부
     */
    utils.ui.tree.initContextMenu = function(selector, items) {
        const treeInstance = this.getInstance(selector);
        if (!treeInstance) return false;

        try {
            // 현재 설정 가져오기
            const currentSettings = treeInstance.jstree(true).settings;

            // contextmenu 플러그인이 있는지 확인
            if (!currentSettings.plugins.includes("contextmenu")) {
                console.warn("컨텍스트 메뉴 기능을 사용하려면 'contextmenu' 플러그인이 필요합니다. 플러그인을 자동으로 추가합니다.");

                // 플러그인 추가
                currentSettings.plugins.push("contextmenu");
            }

            // 컨텍스트 메뉴 항목 설정
            currentSettings.contextmenu = {
                items: items || getDefaultContextMenuItems
            };

            // 트리 새로고침
            treeInstance.jstree(true).refresh();

            return true;
        } catch (error) {
            console.error("컨텍스트 메뉴 초기화 중 오류 발생:", error);
            return false;
        }
    };

    /**
     * 기본 컨텍스트 메뉴 항목 가져오기 함수
     * @param {object} node - 현재 노드
     * @returns {object} - 컨텍스트 메뉴 항목 객체
     */
    function getDefaultContextMenuItems(node) {
        return {
            create: {
                label: "새 항목 추가",
                action: function(data) {
                    const inst = $.jstree.reference(data.reference);
                    const obj = inst.get_node(data.reference);
                    inst.create_node(obj, { text: "새 항목" }, "last", function(new_node) {
                        try {
                            inst.edit(new_node);
                        } catch (ex) {
                            setTimeout(function() { inst.edit(new_node); }, 0);
                        }
                    });
                }
            },
            rename: {
                label: "이름 변경",
                action: function(data) {
                    const inst = $.jstree.reference(data.reference);
                    const obj = inst.get_node(data.reference);
                    inst.edit(obj);
                }
            },
            remove: {
                label: "삭제",
                action: function(data) {
                    const inst = $.jstree.reference(data.reference);
                    const obj = inst.get_node(data.reference);
                    if (inst.is_selected(obj)) {
                        inst.delete_node(inst.get_selected());
                    } else {
                        inst.delete_node(obj);
                    }
                }
            }
        };
    }

    /**
     * 옵션 병합 유틸리티 함수
     * @param {object} defaultOpts - 기본 옵션
     * @param {object} userOpts - 사용자 옵션
     * @returns {object} - 병합된 옵션
     */
    function mergeOptions(defaultOpts, userOpts) {
        // 기본 옵션을 복사
        const result = JSON.parse(JSON.stringify(defaultOpts));

        // 사용자 옵션이 없으면 기본 옵션 반환
        if (!userOpts) return result;

        // 첫 번째 수준의 속성 병합
        for (const key in userOpts) {
            if (userOpts.hasOwnProperty(key)) {
                if (key === 'plugins' && Array.isArray(userOpts[key])) {
                    // 플러그인 배열 병합 (중복 제거)
                    result[key] = Array.from(new Set([...result[key], ...userOpts[key]]));
                } else if (key === 'core' && typeof userOpts[key] === 'object') {
                    // core 객체 특별 처리
                    result[key] = mergeOptions(result[key] || {}, userOpts[key]);
                } else if (key === 'types' && typeof userOpts[key] === 'object') {
                    // types 객체 특별 처리
                    result[key] = { ...result[key], ...userOpts[key] };
                } else if (typeof userOpts[key] === 'object' && userOpts[key] !== null && !Array.isArray(userOpts[key]) && typeof result[key] === 'object') {
                    // 깊은 객체 병합
                    result[key] = mergeOptions(result[key], userOpts[key]);
                } else {
                    // 기본 속성 복사
                    result[key] = userOpts[key];
                }
            }
        }

        return result;
    }

})(window.biz = window.biz || {});