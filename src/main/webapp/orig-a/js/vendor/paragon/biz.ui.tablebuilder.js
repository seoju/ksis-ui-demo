/**
 - Author: Kang, se won
 -
 - Copyright 2025 Vertexid
 -
 - Licensed under the Apache License, Version 2.0 (the "License");
 - you may not use this file except in compliance with the License.
 - You may obtain a copy of the License at
 -
 - http://www.apache.org/licenses/LICENSE-2.0
 -
 - Unless required by applicable law or agreed to in writing, software
 - distributed under the License is distributed on an "AS IS" BASIS,
 - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 - See the License for the specific language governing permissions and
 - limitations under the License.

 */
// biz.ui.table.js - UI 컴포넌트 관련 유틸리티
/*
1. TableBuilder 클래스 주요 특징

- 객체 지향적 설계: 각 테이블은 독립적인 인스턴스로 관리됩니다.
- 이벤트 핸들링: 다양한 이벤트(클릭, 마우스오버 등)를 지원합니다.
- 데이터 바인딩: 데이터와 테이블 구조를 분리해 관리합니다.
- 포맷팅: 각 컬럼별 사용자 정의 포맷팅을 지원합니다.
- 페이징: 데이터 양이 많을 때 페이지 처리를 지원합니다.

2. 사용 예제
	// 1. 인스턴스 생성
	const tableBuilder1 = new biz.ui.TableBuilder();

	// 2. 테이블 생성
	tableBuilder1.makeTable({
		tableArea: $('#tableArea1'),
		tableId: 'employeeTable',
		params: {
			pageNo: 1,
			pageRow: 10
		},
		columns: [
			{ field: 'id', title: 'ID', width: '50px' },
			{ field: 'name', title: '이름', width: '100px' },
			// 기타 컬럼들...
		],
		on: {
			onClickRow: function(e) {
				const rowData = $(this).data('row');
				alert(`${rowData.name}님을 선택했습니다.`);
			}
		},
		data: sampleData,
		pagination: {
			id: 'pagination1',
			callback: function(page) {
				// 페이지 변경 처리
			}
		}
	});



*/
(function(utils) {
	utils.ui = utils.ui || {};

	//-- 데이터 꺼내오기
	const getRowData = function(idx, col, row) {
		let rtnVal = row[col.field];
		const params = {
			idx: idx,
			col: col,
			row: row
		}
		if (col.formatter && typeof col.formatter === 'function') {
			rtnVal = col.formatter(rtnVal, params);
		}
		return rtnVal !== undefined ? rtnVal : '';
	}
	// 테이블 생성 기능을 클래스형 패턴으로 리팩토링
	utils.ui.TableBuilder = function() {
		// 인스턴스별 상태 변수
		this.options = {
			tableArea: null,
			tableId: "",
			params: {
				pageNo: 0,
				pageRow: 0
			},
			colunms: [],
			on: {},
			data: [],
			url: "",     // AJAX 호출 URL 추가
			searchFnc: null  // 검색 조건 반환 함수 추가
		};

		this.rowData = [];
		this.totalCount = 0;
		this.isLoading = false;
	};

	utils.ui.TableBuilder.prototype = {
		// 옵션 검증 메서드
		validateOptions: function(options) {
			// 깊은 복사로 옵션 병합 (jQuery 의존성 제거)
			this.options = Object.assign({}, this.options, options);

			const validations = [
				{
					condition: this.options.tableArea && typeof this.options.tableArea === 'object',
					message: 'Invalid tableArea'
				},
				{
					condition: this.options.tableId && typeof this.options.tableId === 'string' && this.options.tableId !== '',
					message: 'Invalid tableId'
				},
				{
					condition: this.options.colunms && Array.isArray(this.options.colunms) && this.options.colunms.length > 0,
					message: 'Invalid columns: columns must be a non-empty array'
				}
			];

			const failedValidation = validations.find(v => !v.condition);
			if (failedValidation) {
				console.error(failedValidation.message);
				return false;
			}

			// columns 상세 검증
			for (const column of this.options.colunms) {
				const columnValidation = this.validateColumn(column);
				if (!columnValidation.isValid) {
					console.error(columnValidation.message);
					return false;
				}
			}

			// 데이터 설정
			//			this.rowData = this.options.data.rows || [];
			//			this.totalCount = this.options.data.total || 0;
			// data 체크 및 설정 (url이 없거나 초기 데이터가 있는 경우)
			if (!this.options.url || (this.options.data && (this.options.data.rows || Array.isArray(this.options.data)))) {
				const data = this.options.data || {};
				this.rowData = data.rows || (Array.isArray(data) ? data : []);
				this.totalCount = data.total || this.rowData.length || 0;
			}
			return true;
		},

		// 컬럼 검증 메서드
		validateColumn: function(col) {
			const basicChecks = [
				{
					condition: col.field && typeof col.field === 'string',
					message: `Column field must be a string: ${JSON.stringify(col)}`
				},
				{
					condition: !col.width || typeof col.width === 'string',
					message: `Column width must be a string if provided: ${JSON.stringify(col)}`
				},
				{
					condition: !col.format || typeof col.format === 'function',
					message: `Column format must be a function if provided: ${JSON.stringify(col)}`
				},
				{
					condition: !col.style || typeof col.style === 'object',
					message: `Column style must be an object if provided: ${JSON.stringify(col)}`
				}
			];

			const failedCheck = basicChecks.find(check => !check.condition);
			return failedCheck ? { isValid: false, message: failedCheck.message } : { isValid: true };
		},
		// 데이터 로드 메서드 (AJAX)
		loadData: function(callback) {
			const self = this;

			// 이미 로딩 중이면 중복 요청 방지
			if (this.isLoading) {
				console.log('이미 데이터를 로딩 중입니다. 중복 요청을 방지합니다.');
				return;
			}

			// URL이 없으면 기존 데이터 사용
			if (!this.options.url) {
				if (callback && typeof callback === 'function') {
					callback();
				}
				return;
			}

			// 로딩 시작
			this.isLoading = true;

			// 검색 조건 얻기
			let searchParams = {};

			// 페이징 정보 추가
			searchParams = Object.assign({}, searchParams, this.options.params);

			// 사용자 정의 검색 함수가 있다면 실행
			if (this.options.searchFnc && typeof this.options.searchFnc === 'function') {
				const userParams = this.options.searchFnc() || {};
				searchParams = Object.assign({}, searchParams, userParams);
			}
			// utils.ajax 유틸리티 사용
			let opt = {
				url: this.options.url,
				type:'GET',
				param: searchParams,
				callback: function(response) {
					// 로딩 상태 해제
					self.isLoading = false;
					// 응답 데이터 처리
					if (response) {
						self.rowData = response.data || (Array.isArray(response) ? response : []);
						self.totalCount = response.total || self.rowData.length || 0;

						// 테이블 재구성
						self.refreshTable();

						if (callback && typeof callback === 'function') {
							callback(response);
						}
					}
				},
				error: function(xhr, status, error) {
					// 로딩 상태 해제
					self.isLoading = false;
					console.error('데이터 로드 중 오류 발생:', error);
					// 에러 발생 시 빈 테이블 표시
					self.rowData = [];
					self.totalCount = 0;
					self.refreshTable();

					if (callback && typeof callback === 'function') {
						callback({ error: error });
					}
				}
			};

			// HTTP 메서드 지정이 있으면 추가
			if (this.options.method) {
				opt.type = this.options.method;
			}

			// Ajax 요청 실행
			utils.ajax.request(opt);
		},
		// 테이블 새로고침 메서드
		refreshTable: function() {
			const $table = $('#' + this.options.tableId);

			// 테이블이 없으면 새로 생성
			if ($table.length === 0) {
				this.makeTable(this.options);
				return;
			}

			// tbody만 업데이트
			const $tbody = $("<tbody>");

			// 행 데이터 반복
			$(this.rowData).each((i, row) => {
				// tr 생성
				const $tr = $("<tr>");
				$tr.data('row', row);

				// td 생성
				$(this.options.colunms).each((j, col) => {
					const $td = $("<td>");

					if (col.style) {
						$td.css(col.style);
					}

					$td.html(getRowData(i, col, row));
					$tr.append($td);
				});

				$tbody.append($tr);
			});

			// 기존 tbody 교체
			$table.find('tbody').replaceWith($tbody);

			// 이벤트 재설정
			this.setTableEvent($table);

			// 페이징 업데이트
			this.makePaging();
		},
		// thead 생성 메서드
		makeThead: function($table) {
			// 1. thead 생성
			const $thead = $("<thead>");

			// 2. tr 생성
			const $tr = $("<tr>");

			// 3. th 생성
			$(this.options.colunms).each((i, col) => {
				const $th = $("<th>");
				$th.data('col', col);
				$th.html(col.title);

				if (col.width) {
					$th.css("width", col.width);
				}

				if (col.style) {
					$th.css(col.style);
				}

				$tr.append($th);
			});

			$thead.append($tr);
			$table.append($thead);
		},

		// tbody 생성 메서드
		makeTbody: function($table) {
			// 1. tbody 생성
			const $tbody = $("<tbody>");

			// 행 데이터 반복
			$(this.rowData).each((i, row) => {
				// 2. tr 생성
				const $tr = $("<tr>");
				$tr.data('row', row);

				// 3. td 생성
				$(this.options.colunms).each((j, col) => {
					const $td = $("<td>");

					if (col.style) {
						$td.css(col.style);
					}

					$td.html(getRowData(i, col, row));
					$tr.append($td);
				});

				$tbody.append($tr);
			});

			$table.append($tbody);
		},
		// paging  생성 메서드
		makePaging: function() {
			// 기존 페이징 요소가 있다면 제거
			$(this.options.tableArea).find('.dataTables_paginate').remove();

			// 페이징 처리에 필요한 변수들 계산
			const totalRecords = this.totalCount;
			const rowsPerPage = this.options.params.pageRow || 10;
			const currentPage = this.options.params.pageNo || 1;

			// 총 페이지 수 계산
			const totalPages = Math.ceil(totalRecords / rowsPerPage);

			// 페이지가 없거나 1페이지만 있으면 페이징을 표시하지 않음
			if (totalPages <= 1) {
				return;
			}

			// 페이징 블록 설정 (한 번에 보여줄 페이지 번호 개수)
			const pageBlockSize = 5;

			// 현재 페이지 블록의 시작 페이지와 끝 페이지 계산
			let startPage = Math.floor((currentPage - 1) / pageBlockSize) * pageBlockSize + 1;
			let endPage = startPage + pageBlockSize - 1;

			// 끝 페이지가 총 페이지 수보다 크면 총 페이지 수로 조정
			if (endPage > totalPages) {
				endPage = totalPages;
			}

			// 페이징 컨테이너 생성
			const $paginationContainer = $(`
				<div class="dataTables_paginate paging_bootstrap pagination" id="roleTablePage">
					<div class="pager_view" id="pageUl"></div>
				</div>
			`);

			const $pageUl = $paginationContainer.find('#pageUl');

			// 처음 페이지 버튼
			const $firstBtn = $(`
				<button type="button" class="pager_item">
					<i class="fa-solid fa-angles-left"></i>
				</button>
			`);

			// 비활성화 조건 검사
			if (currentPage === 1) {
				$firstBtn.prop('disabled', true).addClass('disabled');
			}

			// 이벤트 핸들러 등록
			$firstBtn.on('click', () => {
				if (currentPage !== 1) {
					this.goToPage(1);
				}
			});

			$pageUl.append($firstBtn);

			// 이전 페이지 블록 버튼
			const $prevBtn = $(`
				<button type="button" class="pager_item">
					<i class="fa-solid fa-angle-left"></i>
				</button>
			`);

			// 비활성화 조건 검사
			if (currentPage === 1) {
				$prevBtn.prop('disabled', true).addClass('disabled');
			}

			// 이벤트 핸들러 등록
			$prevBtn.on('click', () => {
				if (currentPage > 1) {
					this.goToPage(currentPage - 1);
				}
			});

			$pageUl.append($prevBtn);

			// 페이지 번호 버튼 생성
			for (let i = startPage; i <= endPage; i++) {
				const isSelected = i === currentPage;
				const btnClass = isSelected ? 'pager_item_selected' : 'pager_item';

				const $pageBtn = $(`
					<button type="button" class="${btnClass}" data-page="${i}">${i}</button>
				`);

				// 현재 페이지가 아닌 경우에만 클릭 이벤트 등록
				if (!isSelected) {
					$pageBtn.on('click', () => {
						this.goToPage(i);
					});
				}

				$pageUl.append($pageBtn);
			}

			// 다음 페이지 버튼
			const $nextBtn = $(`
				<button type="button" class="pager_item">
					<i class="fa-solid fa-angle-right"></i>
				</button>
			`);

			// 비활성화 조건 검사
			if (currentPage === totalPages) {
				$nextBtn.prop('disabled', true).addClass('disabled');
			}

			// 이벤트 핸들러 등록
			$nextBtn.on('click', () => {
				if (currentPage < totalPages) {
					this.goToPage(currentPage + 1);
				}
			});

			$pageUl.append($nextBtn);

			// 마지막 페이지 버튼
			const $lastBtn = $(`
				<button type="button" class="pager_item">
					<i class="fa-solid fa-angles-right"></i>
				</button>
			`);

			// 비활성화 조건 검사
			if (currentPage === totalPages) {
				$lastBtn.prop('disabled', true).addClass('disabled');
			}

			// 이벤트 핸들러 등록
			$lastBtn.on('click', () => {
				if (currentPage !== totalPages) {
					this.goToPage(totalPages);
				}
			});

			$pageUl.append($lastBtn);

			// 페이징 컨테이너를 테이블 영역에 추가
			$(this.options.tableArea).append($paginationContainer);
		},

		// 페이지 이동 메서드 (구현)
		goToPage: function(pageNo) {

			// 현재 페이지와 동일한 경우 불필요한 호출 방지
		    if (this.options.params.pageNo === pageNo) {
		        console.log('이미 ' + pageNo + ' 페이지에 있습니다. 불필요한 요청을 방지합니다.');
		        return;
		    }

			// 페이지 번호 업데이트
			this.options.params.pageNo = pageNo;

			// URL이 있으면 AJAX로 데이터 로드
			if (this.options.url) {
				this.loadData();
			} else {
				// URL이 없으면 페이징만 업데이트
				this.makePaging();
			}
		},
		// 테이블 이벤트 설정 메서드
		setTableEvent: function($table) {
			$table.off();

			// 옵션의 모든 이벤트 핸들러 순회
			Object.entries(this.options.on).forEach(([key, handler]) => {
				// 'on' 접두사 제거하고 이벤트 이름 추출
				const rawEventName = key.replace(/^on/, '');
				let eventName = rawEventName.toLowerCase();

				// 이벤트 타겟 구분
				if (key.includes('Cell')) {  // 셀 이벤트
					const cellEventName = eventName.replace('cell', '');
					$table.on(cellEventName, 'tbody>tr>td', handler);
				} else if (key.includes('Row')) {  // 행 이벤트
					const rowEventName = eventName.replace('row', '');
					$table.on(rowEventName, 'tbody>tr', handler);
				} else if (key.includes('Radio')) {  // Radio 이벤트
					const radioEventName = eventName.replace('radio', '');
					$table.on(radioEventName, 'tbody>tr>td input:radio', handler);
				} else if (key.includes('Input')) {  // Input 이벤트
					const inputEventName = eventName.replace('input', '');
					$table.on(inputEventName, 'tbody>tr>td input:text', handler);
				} else {  // 테이블 이벤트
					$table.on(eventName, handler);
				}
			});

			// thead 클릭 이벤트 (정렬 기능 위한 준비)
			$table.on('click', 'thead>tr', function(e) {
				console.log('click', 'THEAD clicked!!');
			});
		},
		// 메인 테이블 생성 메서드
		makeTable: function(options) {
			// 0. 옵션 검증
			if (!this.validateOptions(options)) {
				return false;
			}

			// URL이 있을 경우 AJAX로 데이터 로드
			if (this.options.url && (!this.options.data || this.options.data.length === 0)) {
				const self = this;
				// 페이지 정보가 명시적으로 설정되어 있지 않은 경우 기본값 설정
		        if (!this.options.params.pageNo) {
		            this.options.params.pageNo = 1;
		        }
				this.loadData(function() {
					self.createTableStructure();
				});
				return self.createTableStructure();
			}

			// URL이 없거나 초기 데이터가 있는 경우 바로 테이블 생성
			return this.createTableStructure();
		},
		// 테이블 구조 생성 메서드 (내부용)
		createTableStructure: function() {
			// 1. table 요소 생성
			let $table = $("<table class='tbl_list'>").attr('id', this.options.tableId);

			// 2. thead 생성
			this.makeThead($table);

			// 3. tbody 생성
			this.makeTbody($table);

			// 4. 테이블 요소를 DOM에 추가
			$(this.options.tableArea).html($table);

			// 5. 이벤트 핸들러 등록
			this.setTableEvent($table);

			// 6. 페이징 생성
			this.makePaging();

			// 7. 생성된 테이블 반환
			return $table;
		}
	};


	// 다른 UI 함수들...
})(window.biz);