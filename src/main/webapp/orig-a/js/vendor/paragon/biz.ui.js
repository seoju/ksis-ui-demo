/**
 - Author: Kang, se won
 -
 - Copyright 2023 Vertexid
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
// biz.ui.js - UI 컴포넌트 관련 유틸리티
(function(utils) {
	utils.ui = utils.ui || {};

	/**
	 * 공통코드 · 선택 목록을 HTML 로 만들 때 값과 글자를 이스케이프한다 (2026-10-15 보안점검 M-8).
	 * 코드명 · 값은 관리자가 넣은 DB 값이라, 이스케이프하지 않으면 관리자 계정 하나로 전 사용자 화면에 스크립트가 퍼진다.
	 */
	function _esc(value) {
		return String(value === null || value === undefined ? '' : value)
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}


	utils.ui.datepicker = function(selector, options) {
		const defaultOptions = {
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			showMonthAfterYear: true
		};

		$(selector).datepicker({
			...defaultOptions,
			...options
		});
	};

	/**
	 * 웹 에디터 생성
	 */
	utils.ui.makeWebEditor = function(options) {
		const settings = {
            container: ""
            , containerId: ""
            , editorType: utils.info.EDITOR_TYPE
            , emptyText: ""
            , editorEtc: ""
            , width: "100%"
            , height: "230px"
            , language: 'ko'
            , toolbar: []
        };

		if (options.width) settings.width = options.width;
		if (options.height) settings.height = options.height;
		if (options.language) settings.language = options.height;
		if (options.toolbar) settings.toolbar = options.toolbar;

		switch(utils.info.EDITOR_TYPE){
			case 'OTHER':
				break;
			default:
				// 기존 인스턴스 제거
			    if (CKEDITOR.instances[options.containerId]) {
			        CKEDITOR.instances[options.containerId].destroy();
			    }
				let ckOption = {
					width: settings.width,
                    height: settings.height,
                    language:settings.language
//					toolbar:settings.toolbar
				}
				CKEDITOR.replace(options.containerId, ckOption);
				break;
		}

	};


	utils.ui.makeRadio = function(containerId, items, name, selectedValue) {
		const container = $('#' + containerId);
		container.empty();

		items.forEach(function(item) {
			const checked = (item.value === selectedValue) ? 'checked' : '';
			const radio = `
                 <label class="radio-inline">
                     <input type="radio" name="${_esc(name)}" value="${_esc(item.value)}" ${checked}> ${_esc(item.text)}
                 </label>
             `;
			container.append(radio);
		});
	};

	/**
	 * 코드 조회 후 라디오 버튼 생성 함수
	 * @param {string} containerId - 라디오 버튼을 추가할 컨테이너 요소의 ID
	 * @param {object} options - 옵션 객체
	 * @param {string} options.upCd - 상위 코드 (필수)
	 * @param {string} options.name - 라디오 input의 name 속성 (필수)
	 * @param {string} [options.selectedValue] - 선택된 값 (선택사항)
	 * @param {function} [options.onChange] - 변경 이벤트 핸들러 (선택사항)
	 * @param {string} [options.langCd] - 언어 코드 (선택사항, 기본값: 'ko')
	 * @param {boolean} [options.useInline] - 인라인 스타일 사용 여부 (선택사항, 기본값: true)
	 * @param {string} [options.valueField] - 값으로 사용할 필드명 (선택사항, 기본값: 'cd')
	 * @param {string} [options.textField] - 텍스트로 사용할 필드명 (선택사항, 기본값: 'cdNm')
	 * @param {function} [options.callback] - 라디오 버튼 생성 후 실행할 콜백 함수 (선택사항)
	 */
	biz.ui.makeRadioForCode = function(containerId, options) {
		// 기본 옵션 설정
		const defaults = {
			upCd: '',
			name: '',
			selectedValue: '',
			onChange: null,
			langCd: 'ko',
			useInline: true,
			valueField: 'cd',
			textField: 'langCd'
		};

		// 옵션 병합
		const settings = Object.assign({}, defaults, options);

		// 필수 파라미터 검증
		if (!containerId) {
			console.error('biz.ui.makeRadioForCode: containerId는 필수입니다.');
			return;
		}

		if (!settings.upCd) {
			console.error('biz.ui.makeRadioForCode: upCd는 필수입니다.');
			return;
		}

		if (!settings.name) {
			console.error('biz.ui.makeRadioForCode: name은 필수입니다.');
			return;
		}

		// 컨테이너 요소 가져오기
		var $container;
		if (typeof containerId === 'string') {
			// 문자열인 경우 '#' 접두사 확인 후 추가
			var containerId = containerId.startsWith('#') ? containerId : '#' + containerId;
			$container = $(containerId);

			if ($container.length === 0) {
				console.error('makeRadio: 셀렉터를 찾을 수 없습니다. ID: ' + form);
				return {};
			}
		} else if (containerId instanceof jQuery) {
			// 이미 jQuery 객체인 경우
			$container = containerId;
		} else if (containerId instanceof HTMLElement) {
			// DOM 요소인 경우 jQuery 객체로 변환
			$container = $(containerId);
		} else {
			console.error('makeRadio: 잘못된 입력 타입입니다.', $container);
			return {};
		}

		// 확인
		if (!$container.is('div')) {
			console.warn('makeRadio: 선택된 요소가 Div가 아닙니다.', $container);
		}

		// 로딩 표시
		$container.html('<div class="loading">로딩 중...</div>');

		// API 호출하여 코드 데이터 가져오기
		const ajaxOptions = {
			url: biz.getUrl('/paragon/common/getCodeListPaging'),
			type: 'GET',
			param: {
				upCd: settings.upCd,
				useYn: 'Y'  // 사용 가능한 코드만 가져오기
			},
			callback: function(response) {
				if (!response || !response.data || !Array.isArray(response.data)) {
					$container.html('<div class="error">코드 데이터를 불러올 수 없습니다.</div>');
					return;
				}

				// 컨테이너 비우기
				$container.empty();

				// 라디오 버튼 생성
				const items = response.data;
				const radioClass = settings.useInline ? 'fm_radio' : 'fm_radio_block';

				items.forEach(function(item) {
					const value = item[settings.valueField];
					const text = item[settings.textField];
					const checked = (value === settings.selectedValue) ? 'checked' : '';

					const radioHtml = `
	                    <label class="${radioClass}">
	                        ${_esc(text)}<input type="radio" id="${_esc(settings.name)}" name="${_esc(settings.name)}" value="${_esc(value)}" ${checked}>
	                        <span class="checkmark"></span>
	                    </label>
	                `;

					$container.append(radioHtml);
				});

				// 변경 이벤트 핸들러 등록
				if (settings.onChange && typeof settings.onChange === 'function') {
					$container.find('input[type="radio"]').on('change', settings.onChange);
				}

				// 콜백 함수 실행
				if (settings.callback && typeof settings.callback === 'function') {
					settings.callback(items);
				}
			},
			errorCallback: function(xhr, status, error) {
				console.error('코드 데이터 로드 중 오류 발생:', error);
				$container.html('<div class="error">코드 데이터를 불러오는 중 오류가 발생했습니다.</div>');
			}
		};

		biz.ajax.request(ajaxOptions);
	};

	/**
	 * 코드 조회 후 체크박스 생성 함수
	 * @param {string} containerId - 체크박스를 추가할 컨테이너 요소의 ID
	 * @param {object} options - 옵션 객체
	 * @param {string} options.upCd - 상위 코드 (필수)
	 * @param {string} options.name - 체크박스 input의 name 속성 (필수)
	 * @param {array} [options.selectedValues] - 선택된 값들의 배열 (선택사항)
	 * @param {function} [options.onChange] - 변경 이벤트 핸들러 (선택사항)
	 * @param {string} [options.langCd] - 언어 코드 (선택사항, 기본값: 'ko')
	 * @param {boolean} [options.useInline] - 인라인 스타일 사용 여부 (선택사항, 기본값: true)
	 * @param {string} [options.valueField] - 값으로 사용할 필드명 (선택사항, 기본값: 'cd')
	 * @param {string} [options.textField] - 텍스트로 사용할 필드명 (선택사항, 기본값: 'cdNm')
	 * @param {function} [options.callback] - 체크박스 생성 후 실행할 콜백 함수 (선택사항)
	 */
	biz.ui.makeCheckboxForCode = function(containerId, options) {
		// 기본 옵션 설정
		const defaults = {
			upCd: '',
			name: '',
			selectedValues: [],
			onChange: null,
			langCd: 'ko',
			useInline: true,
			valueField: 'cd',
			textField: 'langCd'
		};

		// 옵션 병합
		const settings = Object.assign({}, defaults, options);

		// 필수 파라미터 검증
		if (!containerId) {
			console.error('biz.ui.makeCheckboxForCode: containerId는 필수입니다.');
			return;
		}

		if (!settings.upCd) {
			console.error('biz.ui.makeCheckboxForCode: upCd는 필수입니다.');
			return;
		}

		if (!settings.name) {
			console.error('biz.ui.makeCheckboxForCode: name은 필수입니다.');
			return;
		}

		// selectedValues가 배열이 아니면 빈 배열로 초기화
		if (!Array.isArray(settings.selectedValues)) {
			settings.selectedValues = [];
		}

		// 컨테이너 요소 가져오기
		var $container;
		if (typeof containerId === 'string') {
			// 문자열인 경우 '#' 접두사 확인 후 추가
			var containerId = containerId.startsWith('#') ? containerId : '#' + containerId;
			$container = $(containerId);

			if ($container.length === 0) {
				console.error('makeCheckbox: 셀렉터를 찾을 수 없습니다. ID: ' + form);
				return {};
			}
		} else if (containerId instanceof jQuery) {
			// 이미 jQuery 객체인 경우
			$container = containerId;
		} else if (containerId instanceof HTMLElement) {
			// DOM 요소인 경우 jQuery 객체로 변환
			$container = $(containerId);
		} else {
			console.error('makeCheckbox: 잘못된 입력 타입입니다.', $container);
			return {};
		}

		// 확인
		if (!$container.is('div')) {
			console.warn('makeCheckbox: 선택된 요소가 Div가 아닙니다.', $container);
		}



		// 로딩 표시
		$container.html('<div class="loading">로딩 중...</div>');

		// API 호출하여 코드 데이터 가져오기
		const ajaxOptions = {
			url: biz.getUrl('/paragon/common/getCodeListPaging'),
			type: 'GET',
			param: {
				upCd: settings.upCd,
				useYn: 'Y'  // 사용 가능한 코드만 가져오기
			},
			callback: function(response) {
				if (!response || !response.data || !Array.isArray(response.data)) {
					$container.html('<div class="error">코드 데이터를 불러올 수 없습니다.</div>');
					return;
				}

				// 컨테이너 비우기
				$container.empty();

				// 체크박스 생성
				const items = response.data;
				const checkboxClass = settings.useInline ? 'fm_checkbox' : 'fm_checkbox_block';

				items.forEach(function(item) {
					const value = item[settings.valueField];
					const text = item[settings.textField];
					const checked = settings.selectedValues.includes(value) ? 'checked' : '';

					const checkboxHtml = `
	                    <label class="${checkboxClass}">
	                        ${_esc(text)}<input type="checkbox" id="${_esc(settings.name)}" name="${_esc(settings.name)}" value="${_esc(value)}" ${checked}>
	                        <span class="checkmark"></span>
	                    </label>
	                `;

					$container.append(checkboxHtml);
				});

				// 변경 이벤트 핸들러 등록
				if (settings.onChange && typeof settings.onChange === 'function') {
					$container.find('input[type="checkbox"]').on('change', settings.onChange);
				}

				// 콜백 함수 실행
				if (settings.callback && typeof settings.callback === 'function') {
					settings.callback(items);
				}
			},
			errorCallback: function(xhr, status, error) {
				console.error('코드 데이터 로드 중 오류 발생:', error);
				$container.html('<div class="error">코드 데이터를 불러오는 중 오류가 발생했습니다.</div>');
			}
		};

		biz.ajax.request(ajaxOptions);
	};

	/**
	 * 코드 조회 후 셀렉트 박스 생성 함수
	 * @param {string} selectId - 셀렉트 요소의 ID
	 * @param {object} options - 옵션 객체
	 * @param {string} options.upCd - 상위 코드 (필수)
	 * @param {string} [options.selectedValue] - 선택된 값 (선택사항)
	 * @param {function} [options.onChange] - 변경 이벤트 핸들러 (선택사항)
	 * @param {string} [options.langCd] - 언어 코드 (선택사항, 기본값: 'ko')
	 * @param {string} [options.valueField] - 값으로 사용할 필드명 (선택사항, 기본값: 'cd')
	 * @param {string} [options.textField] - 텍스트로 사용할 필드명 (선택사항, 기본값: 'cdNm')
	 * @param {boolean} [options.useEmptyOption] - 빈 옵션 사용 여부 (선택사항, 기본값: true)
	 * @param {string} [options.emptyOptionText] - 빈 옵션 텍스트 (선택사항, 기본값: '선택하세요')
	 * @param {string} [options.emptyOptionValue] - 빈 옵션 값 (선택사항, 기본값: '')
	 * @param {function} [options.callback] - 셀렉트 박스 생성 후 실행할 콜백 함수 (선택사항)
	 * @param {string} [options.cssClass] - 셀렉트 박스에 추가할 CSS 클래스 (선택사항)
	 */
	biz.ui.makeSelectForCode = function(selectId, options) {
		// 기본 옵션 설정
		const defaults = {
			upCd: '',
			selectedValue: '',
			onChange: null,
			langCd: 'ko',
			valueField: 'cd',
			textField: 'langCd',
			useEmptyOption: true,
			emptyOptionText: '선택하세요',
			emptyOptionValue: '',
			cssClass: 'form-control'
		};

		// 옵션 병합
		const settings = Object.assign({}, defaults, options);

		// 필수 파라미터 검증
		if (!selectId) {
			console.error('biz.ui.makeSelectForCode: selectId는 필수입니다.');
			return;
		}


		if (!settings.upCd) {
			console.error('biz.ui.makeSelectForCode: upCd는 필수입니다.');
			return;
		}

		// 셀렉트 요소 가져오기
		var $select;
		if (typeof selectId === 'string') {
			// 문자열인 경우 '#' 접두사 확인 후 추가
			var selectId = selectId.startsWith('#') ? selectId : '#' + selectId;
			$select = $(selectId);

			if ($select.length === 0) {
				console.error('makeSelect: 셀렉터를 찾을 수 없습니다. ID: ' + form);
				return {};
			}
		} else if (selectId instanceof jQuery) {
			// 이미 jQuery 객체인 경우
			$select = selectId;
		} else if (selectId instanceof HTMLElement) {
			// DOM 요소인 경우 jQuery 객체로 변환
			$select = $(selectId);
		} else {
			console.error('makeSelect: 잘못된 입력 타입입니다.', form);
			return {};
		}

		// 폼인지 확인
		if (!$select.is('select')) {
			console.warn('makeSelect: 선택된 요소가 Select가 아닙니다.', $form);
		}

		// CSS 클래스 추가
		if (settings.cssClass) {
			$select.addClass(settings.cssClass);
		}

		// 로딩 옵션 추가
		$select.empty().append('<option value="">로딩 중...</option>');
		$select.prop('disabled', true);

		// API 호출하여 코드 데이터 가져오기
		const ajaxOptions = {
			url: biz.getUrl('/paragon/common/getCodeListPaging'),
			type: 'GET',
			param: {
				upCd: settings.upCd,
				useYn: 'Y'  // 사용 가능한 코드만 가져오기
			},
			callback: function(response) {
				// 셀렉트 박스 초기화
				$select.empty();
				$select.prop('disabled', false);

				if (!response || !response.data || !Array.isArray(response.data)) {
					$select.append('<option value="">데이터 없음</option>');
					return;
				}

				// 빈 옵션 추가
				if (settings.useEmptyOption) {
					$select.append(`<option value="${_esc(settings.emptyOptionValue)}">${_esc(settings.emptyOptionText)}</option>`);
				}

				// 옵션 추가
				const items = response.data;

				items.forEach(function(item) {
					const value = item[settings.valueField];
					const text = item[settings.textField];
					const selected = (value === settings.selectedValue) ? 'selected' : '';

					$select.append(`<option value="${_esc(value)}" ${selected}>${_esc(text)}</option>`);
				});

				// 변경 이벤트 핸들러 등록
				if (settings.onChange && typeof settings.onChange === 'function') {
					$select.off('change').on('change', settings.onChange);
				}

				// 콜백 함수 실행
				if (settings.callback && typeof settings.callback === 'function') {
					settings.callback(items);
				}
			},
			errorCallback: function(xhr, status, error) {
				console.error('코드 데이터 로드 중 오류 발생:', error);
				$select.empty().append('<option value="">오류 발생</option>');
				$select.prop('disabled', false);
			}
		};

		biz.ajax.request(ajaxOptions);
	};

	// 다른 UI 함수들...
})(window.biz);