(function(biz) {
	'use strict';

	// 비공개 변수
	let _defaultPageSize = 50;
	let _tables = {}; // 생성된 테이블 인스턴스 저장
	let _tableParams = {}; // 각 테이블의 현재 AJAX 파라미터를 저장하는 변수 추가
	let _tableUrls = {}; // 각 테이블의 URL을 저장하는 변수 추가

	// 비공개 함수: 기본 옵션과 사용자 옵션 병합
	function _mergeOptions(userOptions) {
		const defaultOptions = {
			minHeight: "270px",
			//maxHeight: "100%",
			maxHeight: "668px",
			locale: "ko-kr",
			virtualDom: false,
			renderVertical:"basic",
			// 조회 결과가 없을 때. 빈 표만 남으면 «아직 조회 전인지 / 결과가 없는지» 를 알 수 없다.
			// 화면마다 넣으면 또 복사가 되므로 여기서 한 번만 정한다.
			// 다른 문구를 쓰려면 init 에 placeholder 를 넘기면 덮어쓴다.
			// ※ 아래 _mergeOptions 가 JSON 으로 복제하므로 함수를 넣으면 지워진다. 문자열이어야 한다.
			placeholder: (window.biz && biz.lang && biz.lang.text)
				? biz.lang.text('L.조회데이터없음', '조회할 데이터가 없습니다.')
				: '조회할 데이터가 없습니다.',
			langs: {
				"ko-kr": { // 한국어 로케일 추가
					"groups": {
						"item": "항목",
						"items": "항목들",
					},
					"columns": {
					},
					"data": {
						"loading": "로딩 중...",
						"error": "오류 발생",
					},
					"pagination": {
						"page_size": "페이지 크기",
						"page_title": "페이지 표시",  
						"first": "처음",
						"first_title": "첫 페이지",
						"last": "마지막",
						"last_title": "마지막 페이지",
						"prev": "이전",
						"prev_title": "이전 페이지",
						"next": "다음",
						"next_title": "다음 페이지",
						"all": "전체",
						"counter": {
							"showing": "보기",
							"of": "/",
							"rows": "행",
							"pages": "페이지",
						}
					},
					"headerFilters": {
						"default": "열 필터링...",
						"columns": {}
					}
				}
			},
			//layout: "fitColumns",    
			layout: "fitData",
			sortMode: "remote",
			//			selectableRows:true,  //- 클릭 하면 선택되어져 있다
			selectable: 1, //-- 동시에 선택 가능한 row수
			selectableRowsPersistence: false,
			pagination: true,
			paginationMode: "remote",
			paginationSize: _defaultPageSize,
			paginationSizeSelector: [20, 50, 100],
			paginationInitialPage: 1,
			dataSendParams: {
				size: "rows"      // 페이지 크기 파라미터 (size → rows로 변경)
			},
			ajaxConfig: {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest"
				},
			},
			ajaxLoaderLoading: "<div class='loader'>데이터를 불러오는 중...</div>",
			ajaxError: function(error) {
				console.error("데이터 로딩 에러:", error);
				return "데이터를 불러오는 중 오류가 발생했습니다.";
			}
		};

		// 사용자 정의 컬럼에 기본 headerHozAlign 속성 적용
		if (userOptions.columns && Array.isArray(userOptions.columns)) {
			userOptions.columns.forEach(column => {
				// headerHozAlign이 정의되어 있지 않은 경우에만 기본값 적용
				if (column.headerHozAlign === undefined) {
					column.headerHozAlign = "center";
				}

				// 컬럼 그룹에 대한 처리 (중첩된 컬럼이 있는 경우)
				if (column.columns && Array.isArray(column.columns)) {
					column.columns.forEach(subColumn => {
						if (subColumn.headerHozAlign === undefined) {
							subColumn.headerHozAlign = "center";
						}
					});
				}
			});
		}

		// 깊은 병합을 위한 함수
		function deepMerge(target, source) {
			for (const key in source) {
				if (source.hasOwnProperty(key)) {
					if (source[key] instanceof Object && target[key] instanceof Object) {
						deepMerge(target[key], source[key]);
					} else {
						target[key] = source[key];
					}
				}
			}
			return target;
		}

		return deepMerge(JSON.parse(JSON.stringify(defaultOptions)), userOptions);
	}

	// 비공개 함수: 기본 응답 처리기
	function _defaultResponseHandler(url, params, response) {
		// 서버 응답 형식에 맞게 수정 필요
		// 기본 응답 형식: { data: [...], total: 100, last_page: 10 }

		// 응답 형식 체크 및 표준화
		let processedData = [];
		let lastPage = 1;
		let total = 0;

		// 응답이 배열인지 객체인지 확인
		if (Array.isArray(response)) {
			// 응답 자체가 배열인 경우
			processedData = response;
			total = response.length;
		} else if (response && response.data) {
			// 응답이 {data: [...]} 형태인 경우
			processedData = response.data;
			lastPage = response.last_page || 1;
			total = response.total || processedData.length;
		} else if (response && typeof response === 'object') {
			// 응답이 객체이지만 data 필드가 없는 경우
			// 모든 필드를 데이터로 간주
			processedData = [response];
			total = 1;
		}

		// 페이지 정보 업데이트 (페이지 정보 표시 요소가 있는 경우)
		const tableId = this.element.id;
		const infoContainer = document.getElementById(tableId + "-info");
		if (infoContainer) {
			const currentPageEl = infoContainer.querySelector(".current-page");
			const totalPagesEl = infoContainer.querySelector(".total-pages");
			const totalRowsEl = infoContainer.querySelector(".total-rows");

			if (currentPageEl) currentPageEl.textContent = "현재 페이지: " + this.getPage();
			if (totalPagesEl) totalPagesEl.textContent = "총 페이지: " + lastPage;
			if (totalRowsEl) totalRowsEl.textContent = "총 데이터 수: " + total;
		}
		
		// 좌측 하단 건수 표시
		const paginatorEl = this.element.querySelector(".tabulator-paginator");
		if (paginatorEl) {
			// 기존에 만든 wrapper가 없으면 처음 실행
			let wrapper = paginatorEl.querySelector(".paginator-wrapper");
			if (!wrapper) {
				// 기존 paginator 내부의 모든 요소 백업
				const originalChildren = Array.from(paginatorEl.childNodes);

				// 새로운 wrapper 생성 (flex container)
				wrapper = document.createElement("div");
				wrapper.className = "paginator-wrapper";
				wrapper.style.cssText = "display: flex; justify-content: space-between; align-items: center; width: 100%;";

				// 좌측 총 건수 영역
				const countDiv = document.createElement("div");
				countDiv.className = "tabulator-total-count";
				countDiv.style.cssText = "font-size: 15px; font-weight: 400;";
				countDiv.textContent = `전체: ${total}건`;

				// 우측 페이지 버튼 영역
				const paginationControls = document.createElement("div");
				paginationControls.className = "pagination-controls";
				originalChildren.forEach(child => paginationControls.appendChild(child));

				// 구조 조립
				wrapper.appendChild(countDiv);
				wrapper.appendChild(paginationControls);

				// 기존 paginator 비우고 wrapper 추가
				paginatorEl.innerHTML = "";
				paginatorEl.appendChild(wrapper);
			} else {
				// 이미 생성된 경우 텍스트만 갱신
				const countDiv = wrapper.querySelector(".tabulator-total-count");
				if (countDiv) {
					countDiv.textContent = `전체: ${total}건`;
				}
			}
		}

		
		// 트리 데이터 처리 확인
		if (this.options.dataTree === true) {
			// 데이터가 이미 트리 구조인지 확인
			const hasTreeStructure = processedData.some(item =>
				item._children !== undefined || item.children !== undefined
			);

			// 데이터가 트리 구조가 아니면 트리 구조로 변환
			if (!hasTreeStructure && processedData.length > 0) {
				processedData = _convertToTreeData(processedData);
			}
		}

		// 페이징 사용 여부에 따라 반환 형식 결정
		if (this.options.pagination) {
			// 페이징 사용 시 - 객체 형태로 반환
			return {
				data: processedData,
				last_page: lastPage
			};
		} else {
			// 페이징 미사용 시 - 데이터만 배열 형태로 반환
			return processedData;
		}
	}

	// 데이터를 트리 구조로 변환하는 함수
	function _convertToTreeData(data) {
		if (!data || !Array.isArray(data) || data.length === 0) {
			return [];
		}

		// 여기서는 예시로 parentId 필드를 사용하여 부모-자식 관계를 구성합니다.
		// 실제 구현에서는 데이터 구조에 맞게 수정이 필요합니다.

		// 아이템을 ID별로 매핑
		const itemMap = {};
		const rootItems = [];

		// 첫 번째 패스: 각 아이템을 ID로 매핑
		data.forEach(item => {
			// 아이템 복사본 생성 (원본 수정 방지)
			const itemCopy = { ...item };
			// _children 속성 초기화
			itemCopy._children = [];
			// ID를 기준으로 아이템 저장
			itemMap[item.id] = itemCopy;
		});

		// 두 번째 패스: 부모-자식 관계 구성
		data.forEach(item => {
			if (item.parentId && itemMap[item.parentId]) {
				// 부모가 있는 경우, 부모의 자식으로 추가
				itemMap[item.parentId]._children.push(itemMap[item.id]);
			} else {
				// 부모가 없거나 찾을 수 없는 경우, 루트 아이템으로 간주
				rootItems.push(itemMap[item.id]);
			}
		});

		// 자식이 없는 노드의 _children 속성 제거
		Object.values(itemMap).forEach(item => {
			if (item._children.length === 0) {
				delete item._children;
			}
		});

		return rootItems;
	}

	// 비공개 함수: 페이지 정보 컨테이너 생성
	/**
	 * 엑셀 내보내기용 (2026-10-15 보안점검 H-6).
	 * 표시 함수가 만든 HTML 에서 글자만 뽑는다. DOMParser 로 만든 문서는 화면과 떨어진 문서라
	 * <img onerror> 같은 것이 실행되지 않는다 (document.createElement 한 div 의 innerHTML 은 실행된다).
	 */
	function _htmlToText(html) {
		const doc = new DOMParser().parseFromString(String(html), 'text/html');
		return doc.body ? (doc.body.textContent || '') : '';
	}

	/** 엑셀 내보내기용 : 표 HTML 에 넣을 값을 이스케이프한다 (H-6) */
	function _escCell(value) {
		return String(value === null || value === undefined ? '' : value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function _createPageInfoContainer(tableId) {
		const container = document.createElement("div");
		container.id = tableId + "-info";
		container.className = "grid-page-info";
		container.style.marginTop = "10px";
		container.style.fontSize = "14px";

		container.innerHTML = `
            <span class="current-page">현재 페이지: 1</span> /
            <span class="total-pages">총 페이지: 0</span> |
            <span class="total-rows">총 데이터 수: 0</span>
        `;

		return container;
	}

	// 비공개 함수: 페이지 크기 선택기 생성
	function _createPageSizeSelector(tableId, sizes) {
		const container = document.createElement("div");
		container.className = "grid-controls";
		container.style.marginBottom = "10px";

		// 페이지 크기 선택 드롭다운
		const select = document.createElement("select");
		select.id = tableId + "-page-size";
		select.className = "grid-page-size-selector";

		sizes.forEach(size => {
			const option = document.createElement("option");
			option.value = size;
			option.textContent = size + "개씩 보기";
			if (size === _defaultPageSize) {
				option.selected = true;
			}
			select.appendChild(option);
		});

		// 새로고침 버튼
		const refreshBtn = document.createElement("button");
		refreshBtn.id = tableId + "-refresh";
		refreshBtn.className = "grid-refresh-btn";
		refreshBtn.textContent = "새로고침";
		refreshBtn.style.marginLeft = "10px";

		container.appendChild(select);
		container.appendChild(refreshBtn);

		return {
			container,
			select,
			refreshBtn
		};
	}

	// 비공개 함수: 테이블 URL 가져오기
	function _getTableUrl(tableId) {
		return _tableUrls[tableId] || null;
	}

	// 공개 API
	biz.ui = biz.ui || {};
	biz.ui.grid = {
		/**
		 * 그리드 초기화
		 * @param {string} selector - 그리드를 렌더링할 요소의 CSS 선택자
		 * @param {object} options - 그리드 옵션
		 * @param {array} options.columns - 컬럼 정의
		 * @param {string} [options.url] - AJAX 요청 URL (url 또는 data 중 하나는 필수)
		 * @param {array} [options.data] - 초기 데이터 배열 (url 또는 data 중 하나는 필수)
		 * @param {object} [options.params] - AJAX 요청 추가 파라미터
		 * @param {function} [options.onRowClick] - 행 클릭 이벤트 핸들러
		 * @param {function} [options.onRowDblClick] - 행 더블클릭 이벤트 핸들러
		 * @param {function} [options.onCellClick] - 셀 클릭 이벤트 핸들러
		 * @param {function} [options.onCellEditing] - 셀 에디트 이벤트 핸들러
		 * @param {function} [options.responseHandler] - AJAX 응답 처리 핸들러
		 * @param {boolean} [options.showPageInfo=true] - 페이지 정보 표시 여부
		 * @param {boolean} [options.showControls=true] - 컨트롤(페이지 크기 선택, 새로고침) 표시 여부
		 * @param {array} [options.pageSizes=[20,50, 100]] - 페이지 크기 옵션
		 * @returns {object} - 생성된 Tabulator 인스턴스
		 */
		init: function(selector, options) {
			if (!selector || !options || !options.columns || (!options.url && !options.data)) {
				console.error("필수 옵션이 누락되었습니다. columns과 url 또는 data 중 하나는 필수입니다.");
				return null;
			}

			let selectorId;
			if (typeof selector === 'string') {
				if (selector.startsWith('#')) {
					selectorId = selector;
				} else {
					selectorId = '#'+selector;
				}
			}
			const element = document.querySelector(selectorId);
			if (!element) {
				console.error("선택자와 일치하는 요소가 없습니다:", selector);
				return null;
			}

			const tableId = element.id || "grid-" + Math.random().toString(36).substring(2, 10);
			element.id = tableId;

			// 페이지 크기 및 컨트롤 설정
			const showPageInfo = options.showPageInfo ? options.showPageInfo !== true : false;
			const showControls = options.showControls ? options.showControls !== true : false;
			const pageSizes = options.pageSizes || [20, 50, 100];

			// 컨트롤 및 페이지 정보 컨테이너 추가
			let pageSelector = null;
			if (showControls) {
				const controlElements = _createPageSizeSelector(tableId, pageSizes);
				element.parentNode.insertBefore(controlElements.container, element);
				pageSelector = controlElements.select;

				// 새로고침 버튼 이벤트 설정
				controlElements.refreshBtn.addEventListener("click", function() {
					if (_tables[tableId]) {
						_tables[tableId].setPage(1);
						_tables[tableId].replaceData();
					}
				});
			}

			// 페이지 정보 컨테이너 추가
			if (showPageInfo) {
				const pageInfoContainer = _createPageInfoContainer(tableId);
				element.parentNode.insertBefore(pageInfoContainer, element.nextSibling);
			}

			// 사용자 옵션에 기본 속성 추가
			const userOptions = {
				...options,
				ajaxURL: options.url,
				ajaxParams: options.params || {},
				ajaxResponse: options.responseHandler || _defaultResponseHandler
			};

			// 초기 파라미터 및 URL 저장
			_tableParams[tableId] = options.params || {};
			_tableUrls[tableId] = options.url; // URL 저장

			// 옵션 병합
			const mergedOptions = _mergeOptions(userOptions);

			// 데이터가 로드될 때 파라미터 저장하는 콜백 추가
			mergedOptions.ajaxRequesting = function(url, params) {
				// 현재 파라미터 저장
				_tableParams[tableId] = { ...params };
				return params; // 원래 파라미터 반환
			};

			// Tabulator 인스턴스 생성
			const table = new Tabulator(selectorId, mergedOptions);
			_tables[tableId] = table;
			
			// 페이지 변경 이벤트 바인딩
			if (typeof userOptions.paginationChanged === 'function') {
				table.on("pageLoaded", function(pageno) {
					userOptions.paginationChanged.call(table, pageno);
				});
			}

			// 생성 후 이벤트 바인딩 (공식 문서 스타일)
			if (typeof options.onRowClick === 'function') {
				table.on("rowClick", options.onRowClick);
			}
			if (typeof options.onRowDblClick === 'function') {
				table.on("rowDblClick", options.onRowDblClick);
			}

			if (typeof options.onCellClick === 'function') {
				table.on("cellClick", options.onCellClick);
			}

			if (typeof options.onCellEditing === 'function') {
				table.on("cellEditing", options.onCellEditing);
			}

			// 20260310 SCB 유효성 검사 실패 시 말풍선 툴팁 표시 (공통)
			table.on("validationFailed", function(cell, value, validators) {
				// 기존 툴팁 제거
				var existing = document.getElementById('biz-validation-tooltip');
				if (existing) existing.remove();

				// 메시지 생성
				var messages = validators.map(function(v) {
					var type = v.type || v;
					switch (type) {
						case 'required' : return '필수 입력 항목입니다.';
						case 'integer'  : return '정수만 입력 가능합니다.';
						case 'float'    : return '숫자만 입력 가능합니다.';
						case 'numeric'  : return '숫자만 입력 가능합니다.';
						case 'string'   : return '문자열만 입력 가능합니다.';
						case 'alphanumeric': return '영문자/숫자만 입력 가능합니다.';
						case 'maxLength': return '최대 길이를 초과했습니다.';
						case 'minLength': return '최소 길이 미만입니다.';
						case 'min'      : return '최솟값보다 작습니다.';
						case 'max'      : return '최댓값보다 큽니다.';
						case 'in'       : return '허용된 값이 아닙니다.';
						case 'regex'    : return '형식이 올바르지 않습니다.';
						default         : return '입력값이 올바르지 않습니다.';
					}
				});

				// 말풍선 엘리먼트 생성
				var tooltip = document.createElement('div');
				tooltip.id = 'biz-validation-tooltip';
				tooltip.textContent = messages.join(' / ');
				tooltip.style.cssText = [
					'position:fixed',
					'z-index:99999',
					'background:#d9534f',
					'color:#fff',
					'padding:6px 12px',
					'border-radius:4px',
					'font-size:12px',
					'white-space:nowrap',
					'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
					'pointer-events:none'
				].join(';');

				// 꼬리(화살표) 스타일
				var arrow = document.createElement('div');
				arrow.style.cssText = [
					'position:absolute',
					'top:-6px',
					'left:12px',
					'width:0',
					'height:0',
					'border-left:6px solid transparent',
					'border-right:6px solid transparent',
					'border-bottom:6px solid #d9534f'
				].join(';');
				tooltip.appendChild(arrow);
				document.body.appendChild(tooltip);

				// 셀 위치 기준으로 말풍선 배치
				var rect = cell.getElement().getBoundingClientRect();
				tooltip.style.top  = (rect.bottom + 4) + 'px';
				tooltip.style.left = rect.left + 'px';

				// 3초 후 자동 제거
				var timer = setTimeout(function() { tooltip.remove(); }, 3000);

				// 다음 셀 클릭/편집 시 즉시 제거
				var removeOnce = function() {
					clearTimeout(timer);
					tooltip.remove();
					document.removeEventListener('click', removeOnce);
					document.removeEventListener('keydown', removeOnce);
				};
				setTimeout(function() {
					document.addEventListener('click',   removeOnce);
					document.addEventListener('keydown', removeOnce);
				}, 100);
			});

			// 페이지 크기 변경 이벤트 설정
			if (pageSelector) {
				pageSelector.addEventListener("change", function() {
					const size = parseInt(this.value);

					// 이전에 설정된 페이지 크기와 비교
					const currentSize = table.getPageSize();

					if (size !== currentSize) {
						// 현재 URL과 파라미터 가져오기
						const currentUrl = _getTableUrl(tableId);

						// 페이지 정보 업데이트 (내부 변수만 업데이트)
						_tableParams[tableId] = {
							..._tableParams[tableId],
							page: 1,  // 첫 페이지로 설정
							rows: size // Tabulator의 페이지 크기 파라미터 이름(dataSendParams에 설정된 이름)
						};

						// 페이지 크기 설정 (백엔드 호출 방지)
						table.setPageSize(size);

						// 페이지 크기와 페이지 번호를 한 번에 설정하고 데이터 로드 (한 번의 호출만 발생)
						table.setData(currentUrl, _tableParams[tableId]);
					}
				});
			}

			return table;
		},

		/**
		 * 그리드 인스턴스 가져오기
		 * @param {string} selector - 그리드 요소의 CSS 선택자 또는 ID
		 * @returns {object|null} - Tabulator 인스턴스 또는 null
		 */
		getInstance: function(selector) {
			// selector가 문자열이 아니면 null 반환
			if (typeof selector !== 'string') {
				console.error('Invalid selector. Expected a string.');
				return null;
			}

			// '#'으로 시작하는 경우 처리
			if (selector.startsWith('#')) {
				const id = selector.substring(1);
				// ID로 직접 테이블 인스턴스 조회
				if (_tables[id]) {
					return _tables[id];
				}

				// 요소 선택 시도
				const element = document.querySelector(selector);
				if (!element || !element.id || !_tables[element.id]) {
					return null;
				}
				return _tables[element.id];
			}
			// '#'으로 시작하지 않는 경우 - ID로 간주
			else {
				// ID로 직접 테이블 인스턴스 조회
				if (_tables[selector]) {
					return _tables[selector];
				}

				// '#'을 붙여서 선택자로 요소 선택 시도
				const element = document.querySelector('#' + selector);
				if (!element || !element.id || !_tables[element.id]) {
					return null;
				}
				return _tables[element.id];
			}
		},

		/**
		 * 그리드 데이터 새로고침
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {object} [params] - 새로운 요청 파라미터 (선택적)
		 * @param {number} [page=1] - 이동할 페이지 (선택적)
		 */
		refresh: function(selector, params, page) {
			const table = this.getInstance(selector);
			if (!table) return;

			// 테이블 ID 가져오기 (선택자에서 추출)
			let tableId;
			if (typeof selector === 'string') {
				if (selector.startsWith('#')) {
					tableId = selector.substring(1);
				} else {
					tableId = selector;
				}
			} else {
				tableId = table.element.id;
			}

			// 새 파라미터 설정
			if (params) {
				// 파라미터 업데이트
				_tableParams[tableId] = { ..._tableParams[tableId], ...params };
				table.setData(_getTableUrl(tableId), _tableParams[tableId]);
			} else {
				table.replaceData();
			}

			// 페이지 이동
			if (page) {
				table.setPage(page);
			}
		},

		/**
		 * 그리드에 검색 필터 적용
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {object} filters - 필터 객체 {필드명: 값, ...}
		 */
		search: function(selector, filters) {
			const table = this.getInstance(selector);
			if (!table) return;

			// 테이블 ID 가져오기
			let tableId;
			if (typeof selector === 'string') {
				if (selector.startsWith('#')) {
					tableId = selector.substring(1);
				} else {
					tableId = selector;
				}
			} else {
				tableId = table.element.id;
			}

			// 저장된 현재 파라미터와 새 필터 병합
			const currentParams = _tableParams[tableId] || {};
//			const newParams = { ...currentParams, ...filters };
			const newParams = { ...filters };

			// 파라미터 업데이트
			_tableParams[tableId] = newParams;

			// 데이터 요청
			// 세 번째 파라미터 true를 추가하여 페이지를 1로 리셋하면서 데이터를 불러옴
			// 이렇게 하면 setPage(1)을 별도로 호출할 필요가 없어짐
			table.setData(_getTableUrl(tableId), newParams, true);
		},

		/**
		 * 그리드 설정 업데이트
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {object} options - 업데이트할 옵션
		 */
		updateOptions: function(selector, options) {
			const table = this.getInstance(selector);
			if (!table) return;

			// 업데이트 가능한 옵션들
			if (options.height) table.setHeight(options.height);
			if (options.pageSize) table.setPageSize(options.pageSize);
			if (options.columns) table.setColumns(options.columns);
		},

		/**
		 * 그리드 데이터 선택하기
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {string} row - 그리드 요소의 CSS 선택자
		 * @returns {array} - 선택된 행 데이터 배열
		 */
		selectRow: function(selector, row) {
			const table = this.getInstance(selector);
			if (!table) return [];

			return table.selectRow(row);
		},

		/**
		 * 그리드 데이터 선택하기
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {string} row - 그리드 요소의 CSS 선택자
		 * @returns {array} - 선택된 행 데이터 배열
		 */
		singleSelectRow: function(selector, row) {
			const table = this.getInstance(selector);
			if (!table) return [];

			table.deselectRow();
			return table.selectRow(row);
		},

		/**
		 * 특정 로우를 선택하고, 그 로우의 데이터를 반환합니다.
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {string|number} rowId - 선택할 로우의 고유 ID
		 * @returns {Object|null} - 선택된 행의 데이터 객체 또는 null
		 */
		selectAndGetRowData: function(selector, rowId) {
			const table = this.getInstance(selector);
			if (!table) return null;

			// 1. rowId로 로우 컴포넌트를 찾습니다.
			const rowComponent = table.getRow(rowId);

			// 2. 해당 로우가 존재하면 선택 상태로 만들고 데이터를 반환합니다.
			if (rowComponent) {
				rowComponent.select(); // 해당 로우를 선택 상태로 만듭니다.
				return rowComponent.getData(); // 로우 데이터 반환
			}

			// 로우가 존재하지 않으면 null 반환
			return null;
		},

		/**
		 * 선택된 행 데이터 가져오기
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @returns {array} - 선택된 행 데이터 배열
		 */
		getSelectedRows: function(selector) {
			const table = this.getInstance(selector);
			if (!table) return [];

			return table.getSelectedData();
		},

		/**
		 * 그리드 데이터 업데이트
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {array} data - 새로운 데이터 배열
		 * @param {boolean} [addToExisting=false] - 기존 데이터에 추가할지 여부 (true: 추가, false: 대체)
		 */
		updateData: function(selector, data, addToExisting) {
			const table = this.getInstance(selector);
			if (!table) return;

			// 변수 초기화 - 데이터 복사 (원본 데이터 보존)
			let processedData = Array.isArray(data) ? [...data] : [data];
			// 테이블이 트리 모드인 경우 데이터 변환
			if (table.options.dataTree === true) {
				// 데이터가 이미 트리 구조인지 확인
				const hasTreeStructure = processedData.some(item =>
					item._children !== undefined || item.children !== undefined
				);

				// 데이터가 트리 구조가 아니면 트리 구조로 변환
				if (!hasTreeStructure && processedData.length > 0) {
					processedData = _convertToTreeData(processedData);
				}
			}

			if (addToExisting) {
				// 기존 데이터에 새 데이터 추가
				table.addData(processedData);
			} else {
				// 기존 데이터를 새 데이터로 대체
				table.replaceData(processedData);
			}
		},

		/**
		 * 그리드 데이터 추가
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {array} data - 새로운 데이터 배열
		 * @param {boolean} pos - 그리드의 상단에 추가할건지? true : 상단, false: 하단
		 * @param {int} index - 추가할 위치 인덱스 (선택적, 기본값은 마지막)
		 */
		addRow: function(selector, data, pos, index) {
			const table = this.getInstance(selector);
			if (!table) return;

			if(typeof data === "string"){
				data = JSON.parse(data);
			}

			// SCBCHANGE_20260309 START
			// list editor 컬럼의 첫 번째 값을 기본값으로 자동 적용
			// - 호출 시 명시적으로 넘긴 필드는 그대로 유지 (덮어쓰지 않음)
			// - editorParams가 함수인 동적 컬럼은 컨텍스트가 없으므로 건너뜀
			table.getColumns().forEach(col => {
				const def = col.getDefinition();
				if (def.editor === 'list' && def.field && !(def.field in data)) {
					if (typeof def.editorParams === 'function') return; // 동적 파라미터는 스킵
					const values = def.editorParams && def.editorParams.values;
					if (Array.isArray(values) && values.length > 0) {
						const first = values[0];
						data[def.field] = (first !== null && typeof first === 'object') ? first.value : first;
					}
				}
			});

			// addRows 후 selectableRowsPersistence:false 로 선택이 초기화되므로
			// 미리 Row Component를 저장하고 추가 완료 후 복원
			const prevSelected = table.getSelectedRows();
			// SCBCHANGE_20260309 END

			return table.rowManager.addRows(data, pos, index, true)
				.then((rows)=>{
					if (rows && rows.length > 0) {
						const newRow = rows[0].getComponent();
						prevSelected.forEach(rowComp => rowComp.select());
						newRow.select();
						newRow.scrollTo();
						return newRow;
					}
					return null;
				});
		},

		/**
		 * 그리드 데이터 내보내기 해당 페이지만
		 * @param {string} selector - 그리드 요소의 CSS 선택자
		 * @param {string} type - 내보내기 타입 (csv, json, xlsx, pdf)
		 * @param {string} [filename] - 파일명 (선택적)
		 */
		exportData: function(selector, type, filename) {
			const table = this.getInstance(selector);
			if (!table) return;

			filename = filename || "export_" + new Date().toISOString().slice(0, 10);

			switch (type.toLowerCase()) {
				case 'csv':
					table.download("csv", filename + ".csv");
					break;
				case 'json':
					table.download("json", filename + ".json");
					break;
				case 'xlsx':
					table.download("xlsx", filename + ".xlsx", { sheetName: "데이터" });
					break;
				case 'pdf':
					table.download("pdf", filename + ".pdf", {
						orientation: "portrait",
						title: filename
					});
					break;
				default:
					console.error("지원되지 않는 내보내기 타입:", type);
			}
		},
		/**
		 * makeSelectGetCode
		 * -----------------
		 * API로 코드리스트 조회 → Tabulator list editor/lookup formatter 용 데이터 변환
		 * return: Promise<{ list:[{label,value}], map:{value:label} }>
		 */
		makeSelectGetCode: async function (url) {
			const list = [];
			const map = {};
			await $.ajax({
				url: url,
				type: 'GET',
				dataType: 'json',
				success: function(response) {
					if (response.success && response.data) {
						response.data.forEach(item => {
							if(item.USE_YN === 'Y'){
								list.push({ label: item.LABEL, value: item.CODE });
							}
							map[item.CODE] = item.LABEL;
						});
					}
				}
			});
			return { list, map };
		},
		/**
		 * makeSelectForCode
		 * -----------------
		 * API로 코드리스트 조회 → Tabulator list editor/lookup formatter 용 데이터 변환
		 *
		 * options:
		 *  - upCd: 상위코드 (필수)
		 *  - valueField: 값 필드명 (default: 'cdAbb')
		 *  - textField : 라벨 필드명 (default: 'langCd')
		 *  - useEmptyOption: 빈 옵션 추가 여부
		 *  - callback: 결과 전달용 함수
		 *
		 * return: Promise<{ list:[{label,value}], map:{value:label} }>
		 */

		makeSelectForCode: async function (options) {
			const defaults = {
				upCd: '',
				selectedValue: '',
				onChange: null,
				langCd: 'ko',
				valueField: 'cdAbb',
				textField: 'langCd',
				useEmptyOption: false,
				emptyOptionText: '',
				emptyOptionValue: '',
				cssClass: 'form-control',
				callback: null
			};
			const settings = Object.assign({}, defaults, options);

			if (!settings.upCd) {
				console.error('biz.ui.grid.makeSelectForCode: upCd는 필수입니다.');
				return { list: [], map: {} };
			}

			const data = await new Promise((resolve, reject) => {
				biz.ajax.request({
					url: biz.getUrl('/paragon/common/getCodeListPaging'),
					type: 'GET',
					param: { upCd: settings.upCd, useYn: 'Y' },
					callback: (response) => resolve(Array.isArray(response?.data) ? response.data : []),
					errorCallback: (xhr, status, error) => {
						console.error('코드 데이터 로드 중 오류:', error);
						resolve([]);
					}
				});
			});

			const list = data
				.filter(it => it?.[settings.valueField] != null && it?.[settings.textField] != null)
				.map(it => ({
					value: String(it[settings.valueField]),
					label: it[settings.textField],
				}));

			if (settings.useEmptyOption) {
				list.unshift({ value: String(settings.emptyOptionValue), label: settings.emptyOptionText });
			}

			const map = Object.fromEntries(list.map(({ value, label }) => [value, label]));

			if (typeof settings.callback === 'function') {
				settings.callback({ list, map });
			}

			return { list, map };
		},
		/**
		 * 그리드의 전체 데이터를 Excel 파일로 내보내기
		 * @param {string|object} targetOrSelector - 그리드 요소의 CSS 선택자 또는 Tabulator 인스턴스
		 * @param {object} [options] - 내보내기 옵션
		 * @param {string} [options.fileName="export.xlsx"] - 파일명
		 * @param {string} [options.sheetName="Sheet1"] - 시트명
		 * @param {boolean} [options.includeColumnHeaders=true] - 컬럼 헤더 포함 여부
		 * @param {array} [options.columns] - 내보낼 특정 컬럼 배열 (없으면 모든 컬럼)
		 * @param {boolean} [options.includeHiddenColumns=false] - 숨겨진 컬럼 포함 여부
		 * @param {string} [options.url] - 데이터를 가져올 사용자 정의 URL (없으면 그리드의 URL 사용)
		 * @param {object} [options.params] - 요청 파라미터 (없으면 그리드의 파라미터 사용)
		 */
		exportToExcel: function(targetOrSelector, options = {}) {
			// 대상 그리드 가져오기
			let table;
			if (typeof targetOrSelector === 'string') {
				table = this.getInstance(targetOrSelector);
			} else {
				table = targetOrSelector;
			}

			if (!table) {
				console.error("유효한 그리드 인스턴스를 찾을 수 없습니다.");
				return;
			}

			// 기본 옵션 설정
			const defaults = {
				fileName: "export.xlsx",
				sheetName: "Sheet1",
				includeColumnHeaders: true,
				includeHiddenColumns: false
			};

			// 옵션 병합
			const settings = { ...defaults, ...options };

			// 요소 선택자 가져오기 (로딩 표시용)
			let selector;
			if (typeof targetOrSelector === 'string') {
				selector = targetOrSelector.startsWith('#') ? targetOrSelector : '#' + targetOrSelector;
			} else {
				selector = '#' + table.element.id;
			}

			// 테이블 ID 추출
			const tableId = table.element.id;

			// 로딩 표시
			const $loadingDiv = $('<div class="export-loading">전체 데이터를 불러오는 중입니다...</div>')
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(255,255,255,0.8)',
					zIndex: 1000,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: '16px',
					fontWeight: 'bold'
				});

			$(selector).css('position', 'relative').append($loadingDiv);

			// 전체 데이터를 가져올 URL과 파라미터 설정
			const url = settings.url || _getTableUrl(tableId);

			if (!url) {
				$loadingDiv.remove();
				console.error("그리드에 URL이 설정되지 않았습니다.");
				biz.showAlert('데이터를 가져올 URL이 설정되지 않았습니다.');
				return;
			}

			// 테이블 ID를 통해 저장된 파라미터 접근
			const storedParams = _tableParams[tableId] || {};

			// 페이징 관련 파라미터 제거 (전체 데이터 가져오기 위해)
			const params = { ...storedParams };
			delete params.page;  // 페이지 번호 제거
			delete params.rows;  // 페이지 크기 제거

			// 사용자 지정 파라미터가 있으면 병합
			if (settings.params) {
				Object.assign(params, settings.params);
			}

			// biz.ajax.request 사용하여 전체 데이터 요청
			biz.ajax.request({
				url: url,
				type: 'GET',
				param: params,
				callback: (response) => {
					// 로딩 제거
					$loadingDiv.remove();

					// 응답에서 데이터 추출
					let data = [];
					if (response && response.data && Array.isArray(response.data)) {
						data = response.data;
					} else if (Array.isArray(response)) {
						data = response;
					} else if (response && typeof response === 'object') {
						data = [response]; // 단일 객체인 경우
					}

					if (data.length === 0) {
						biz.showAlert('다운로드할 데이터가 없습니다.');
						return;
					}

					try {
						// 테이블 컬럼 정의 가져오기
						const columns = settings.columns || table.getColumnDefinitions();

						// 표시할 컬럼 필터링 (숨겨진 컬럼 제외)
						const visibleColumns = settings.includeHiddenColumns
							? columns
							: columns.filter(col => !col.hidden);

						// HTML 테이블 생성
						let html = '<table border="1" style="border-collapse:collapse">';

						// 컬럼 헤더 추가
						if (settings.includeColumnHeaders) {
							html += '<thead><tr>';
							visibleColumns.forEach(column => {
								// 체크박스 컬럼 제외
								if (!column.formatter || column.formatter !== "rowSelection") {
									html += `<th style="font-weight:bold;text-align:center;padding:5px;background-color:#f0f0f0;">${_escCell(column.title || column.field || '')}</th>`;
								}
							});
							html += '</tr></thead>';
						}

						// 데이터 행 추가
						html += '<tbody>';
						data.forEach(row => {
							html += '<tr>';
							visibleColumns.forEach(column => {
								// 체크박스 컬럼 제외
								if (!column.formatter || column.formatter !== "rowSelection") {
									// 셀 데이터 가져오기
									let cellValue = row[column.field];

									// formatter가 존재하는 경우 적용
									if (column.formatter && typeof column.formatter === 'function') {
										try {
											// formatter 호출을 위한 모의 객체 생성
											const mockCell = {
												getValue: () => cellValue,
												getRow: () => ({ getData: () => row }),
												getField: () => column.field
											};

											cellValue = column.formatter(mockCell, column, row);

											// 표시 함수 결과(HTML)를 글자로 : 실행되지 않는 문서에서 글자만 뽑는다 (H-6)
											// 태그가 없어도 escapeHtml 만 한 결과(&amp; · &quot; · &#39;)는 되돌려야 해서 & 가 있을 때도 거친다.
											// 그러지 않으면 아래 _escCell 이 한 번 더 이스케이프해 엑셀에 &amp; 가 그대로 찍힌다.
											if (typeof cellValue === 'string' && /[<&]/.test(cellValue)) {
												cellValue = _htmlToText(cellValue);
											}
										} catch (e) {
											console.warn(`Formatter error for column ${column.field}:`, e);
										}
									}

									// 셀 정렬 스타일 정의. 값은 이스케이프해서 넣는다 — 아래에서 innerHTML 로 표를 만든다 (H-6)
									const alignment = /^(left|center|right)$/.test(column.hozAlign) ? column.hozAlign : 'left';
									html += `<td style="padding:5px;text-align:${alignment}">${_escCell(cellValue)}</td>`;
								}
							});
							html += '</tr>';
						});
						html += '</tbody></table>';

						// 임시 컨테이너에 테이블 추가
						const tempDiv = document.createElement('div');
						tempDiv.style.display = 'none';
						tempDiv.innerHTML = html;
						document.body.appendChild(tempDiv);

						// SheetJS를 사용하여 엑셀 파일 생성
						const wb = XLSX.utils.table_to_book(tempDiv.querySelector('table'), {
							sheet: settings.sheetName,
							raw: true // 날짜 등의 형식 변환 방지
						});

						// 파일 다운로드
						XLSX.writeFile(wb, settings.fileName);

						// 임시 컨테이너 제거
						document.body.removeChild(tempDiv);
					} catch (error) {
						console.error("엑셀 내보내기 중 오류 발생:", error);
						biz.showAlert('엑셀 내보내기 중 오류가 발생했습니다: ' + error.message);
					}
				},
				errorCallback: function(xhr, status, error) {
					// 로딩 제거
					$loadingDiv.remove();
					console.error('데이터 로드 오류:', error);
					biz.showAlert('전체 데이터를 불러오는 중 오류가 발생했습니다.');
				}
			});
		},

		/**
		 * 날짜 형태로 변경해 주는
		 */
		formatDate: function(cell, formatterParams, onRendered) {
			return biz.string.formatDate(cell.getValue());
		},
		/**
		 * 날짜 시간 형태로 변경해 주는
		 */
		formatDatetime: function(cell, formatterParams, onRendered) {
			return biz.string.formatDatetime(cell.getValue());
		},
		/**
		 * 날짜 시간 초 형태로 변경해 주는
		 */
		formatFullDatetime: function(cell, formatterParams, onRendered) {
			return biz.string.formatFullDatetime(cell.getValue());
		},

		/**
		 * 컨테이너 내부의 모든 Tabulator 인스턴스 redraw 차단
		 * 탭 전환 시 DOM detach 전에 호출하여 resize 이벤트로 인한 데이터 파손 방지
		 * @param {HTMLElement} containerEl - 컨테이너 DOM 요소
		 */
		blockRedrawAll: function(containerEl) {
			if (!containerEl) return;
			Object.keys(_tables).forEach(function(id) {
				var el = document.getElementById(id);
				if (el && containerEl.contains(el)) {
					try { _tables[id].blockRedraw(); } catch(e) {}
				}
			});
		},

		/**
		 * 컨테이너 내부의 모든 Tabulator 인스턴스 redraw 복원
		 * 탭 복원 후 DOM append 다음에 호출
		 * @param {HTMLElement} containerEl - 컨테이너 DOM 요소
		 */
		restoreRedrawAll: function(containerEl) {
			if (!containerEl) return;
			Object.keys(_tables).forEach(function(id) {
				var el = document.getElementById(id);
				if (el && containerEl.contains(el)) {
					try {
						_tables[id].restoreRedraw();
						_tables[id].redraw(true);
					} catch(e) {}
				}
			});
		},

	};

})(window.biz = window.biz || {});