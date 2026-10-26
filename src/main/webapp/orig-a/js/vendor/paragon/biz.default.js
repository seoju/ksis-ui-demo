/**
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
// 로딩 모달 관리자
window.LoadingModal = {
	// 로딩 오버레이 생성 함수
	createOverlay: function() {
		const overlayHtml = `
              <div id="ajax-loading-overlay" style="
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.6);
                  z-index: 9999;
                  display: none;
                  justify-content: center;
                  align-items: center;
              ">
                  <div class="loading-container" style="
                      background: white;
                      padding: 30px;
                      border-radius: 10px;
                      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                      text-align: center;
                      min-width: 200px;
                  ">
                      <div class="loading-spinner" style="
                          font-size: 3rem;
                          color: #007bff;
                          animation: spin 1s linear infinite;
                          margin-bottom: 15px;
                      ">
                          <i class="fas fa-spinner"></i>
                      </div>
                      <div class="loading-text" style="
                          font-size: 16px;
                          color: #333;
                          font-weight: 500;
                          animation: pulse 1.5s ease-in-out infinite;
                      ">
                          처리중<span class="loading-dots"></span>
                      </div>
                  </div>
              </div>
          `;

		// 기존 오버레이가 있으면 제거
		$('#ajax-loading-overlay').remove();

		// body에 새 오버레이 추가
		$('body').append(overlayHtml);

		// CSS 애니메이션이 없을 경우를 대비한 인라인 스타일 추가
		if (!$('head').find('style[data-loading-modal]').length) {
			const styleTag = `
                  <style data-loading-modal>
                      @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                      }
                      @keyframes pulse {
                          0% { opacity: 1; }
                          50% { opacity: 0.5; }
                          100% { opacity: 1; }
                      }
                      .loading-dots::after {
                          content: '';
                          animation: dots 1.5s steps(5, end) infinite;
                      }
                      @keyframes dots {
                          0%, 20% { content: ''; }
                          40% { content: '.'; }
                          60% { content: '..'; }
                          80%, 100% { content: '...'; }
                      }
                  </style>
              `;
			$('head').append(styleTag);
		}
	},

	// 오버레이 존재 확인 및 생성
	ensureOverlay: function() {
		if ($('#ajax-loading-overlay').length === 0) {
			this.createOverlay();
		}
	},

	show: function(message) {
		this.ensureOverlay();

		if (message) {
			$('#ajax-loading-overlay .loading-text').html(message + '<span class="loading-dots"></span>');
		}
		$('#ajax-loading-overlay').css('display', 'flex');
	},

	hide: function() {
		$('#ajax-loading-overlay').hide();
	},

	// 오버레이 완전 제거
	destroy: function() {
		$('#ajax-loading-overlay').remove();
		$('style[data-loading-modal]').remove();
	}
};
// biz.default.js - 기본 네임스페이스 생성
window.biz = window.biz || {};

//-- 공통으로 사용될 함수들 모음
/*
getUrl
...
...
*/
(function(utils) {

	// 모달 zIndex 관리를 위한 카운터
	var modalZIndex = 2000;

	//각종 기본정보
	utils.info = (function() {
	    var contextPath = ""; // private 변수로 관리
		const editorType = "";
	    return {
	        get CONTEXT_PATH() {
	            return contextPath;
	        },
	        // contextPath를 업데이트하는 내부 메서드
	        _updateContextPath: function(newPath) {
	            contextPath = newPath;
	        },
			get EDITOR_TYPE(){
				return editorType;
			}
	    }
	})();

	/**
	 * 모바일 디바이스 여부를 판단하는 함수
	 * @returns {boolean} 모바일 디바이스면 true, 아니면 false
	 */
	utils.isMobile = function() {
		// User Agent 기반 검사
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		// 모바일 디바이스 패턴
		var mobilePattern = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

		// 터치 지원 여부와 화면 크기 확인
		var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
		var isSmallScreen = window.innerWidth <= 768;

		// User Agent 검사 또는 (터치 지원 + 작은 화면)
		return mobilePattern.test(userAgent) || (isTouchDevice && isSmallScreen);
	};

	// Context Path 설정 함수 추가
	utils.setContextPath = function(newContextPath) {
	    // 유효성 검사
	    if (typeof newContextPath !== 'string') {
	        console.warn('setContextPath: contextPath는 문자열이어야 합니다.');
	        return false;
	    }

	    // contextPath 업데이트
	    utils.info._updateContextPath(newContextPath);

	    // 디버그 로그
	    console.log('Context Path 업데이트됨:', newContextPath);
	    return true;
	};

	// 공개 API
	utils.getUrl = function(url) {
		return utils.info.CONTEXT_PATH + url;
	}

	// 기본 아이콘.
	// 예전에는 알림에 노란 경고 삼각형을 썼는데, "저장되었습니다" 같은 안내에도 경고로 보였다.
	// 알림은 파란 정보, 확인은 물음표로 구분한다.
	var DEFAULT_ALERT_ICON = '<i class="fa-solid fa-circle-info"></i>';
	var DEFAULT_CONFIRM_ICON = '<i class="fa-regular fa-circle-question"></i>';

	/** 알림·확인 대화상자 스타일. 처음 한 번만 넣는다. */
	function _ensureDialogStyle() {
		if (document.getElementById('biz-dialog-style')) return;

		var css = [
			'.modal.biz-dialog .popup_layer { border-radius: 10px; overflow: hidden;',
			'  box-shadow: 0 12px 32px rgba(0,0,0,.18); }',
			/* 머리글은 닫기 버튼만 남긴다. 메시지는 본문 가운데에 크게 보여준다. */
			'.modal.biz-dialog .pop_header { background: #fff; border-bottom: none;',
			'  padding: 10px 12px 0; min-height: 0; justify-content: flex-end; }',
			'.modal.biz-dialog .pop_header_ttl { display: none; }',
			'.modal.biz-dialog .pop_header .btn-close { color: #9aa0a6; filter: none; opacity: .8; }',
			'.modal.biz-dialog .pop_header .btn-close:hover { opacity: 1; }',
			'.modal.biz-dialog .pop_body { padding: 4px 28px 22px; text-align: center; }',
			'.modal.biz-dialog .dlg-icon { font-size: 40px; line-height: 1; margin-bottom: 14px; }',
			'.modal.biz-dialog .dlg-icon .fa-circle-info { color: #0082c7; }',
			'.modal.biz-dialog .dlg-icon .fa-circle-question { color: #f0a020; }',
			'.modal.biz-dialog .dlg-msg { font-size: 14px; line-height: 1.6; color: #333;',
			'  word-break: keep-all; white-space: pre-line; }',
			'.modal.biz-dialog .pop_footer { background: #fff; border-top: 1px solid #eceff3; padding: 14px 20px; }',
			'.modal.biz-dialog .pop_footer .btn_box { justify-content: center; }',
			'.modal.biz-dialog .pop_footer .right { display: flex; gap: 8px; justify-content: center; }',
			'.modal.biz-dialog .pop_footer .page-btn { min-width: 110px; justify-content: center; padding: 9px 0; }'
		].join('');

		var style = document.createElement('style');
		style.id = 'biz-dialog-style';
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}

	/**
	 * 알림 · 확인창에 넣을 글자를 HTML 로 안전하게 만든다 (2026-10-15 보안점검 H-5).
	 * 서버 오류 메시지 등을 이스케이프 없이 넘기는 화면이 많아, 메시지에 섞인 사용자 입력이 스크립트로 실행될 수 있었다.
	 * - 날 것의 < > & 는 바꾼다. &amp; · &lt; · &#39; 처럼 이미 만들어진 문자 엔티티는 그대로 둔다
	 *   (escapeHtml 로 미리 이스케이프해서 넘기는 화면이 이중 이스케이프로 깨지지 않게).
	 * - 화면들이 일부러 쓰는 줄바꿈 · 강조 태그(<br> · <b> · <strong>)만 다시 살린다. 속성이 붙은 태그는 살리지 않는다.
	 */
	function _safeDialogText(value) {
		if (value === null || value === undefined) return '';
		return String(value)
			.replace(/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/&lt;br\s*\/?&gt;/gi, '<br>')
			.replace(/&lt;(\/?)(b|strong)&gt;/gi, '<$1$2>');
	}

	/**
   * 알림 대화상자를 표시하는 함수
   * @param {string} message - 표시할 메시지
   * @param {function} callback - 확인 버튼 클릭 후 실행될 콜백 함수 (선택 사항)
   * @param {string} title - 대화상자 제목 (기본값: '알림')
   * @param {object} options - 추가 옵션 (icon, confirmText 등)
   */
	utils.showAlert = function(message, callback, title, options) {

		// 모바일인 경우 기본 alert 사용
		if (utils.isMobile()) {
			// HTML 태그 제거하여 순수 텍스트만 표시
			var plainMessage = message.replace(/<[^>]*>/g, '');
			alert(plainMessage);

			// 콜백이 있으면 실행
			if (typeof callback === 'function') {
				setTimeout(function() {
					callback();
				}, 100);
			}
			return null;
		}

		// 기본값 설정
		title = title || '알림';
		options = options || {};

		var icon = options.icon || DEFAULT_ALERT_ICON;   // 아이콘은 코드가 넘기는 HTML 이라 그대로 둔다
		var confirmText = _safeDialogText(options.confirmText || '확인');
		message = _safeDialogText(message);
		title = _safeDialogText(title);

		// 모달 ID 생성 (고유한 ID)
		var modalId = 'biz-alert-modal-' + Date.now();

		// 모달 HTML 생성
		_ensureDialogStyle();

		var modalHtml =
			'<div class="modal size_xs show biz-dialog" id="' + modalId + '" style="z-index:' + (++modalZIndex) + '">' +
			'  <div class="popup_layer">' +
			'    <div class="pop_header">' +
			'      <div class="pop_header_ttl">' + title + '</div>' +
			'      <button type="button" class="btn-close">close</button>' +
			'    </div>' +
			'    <div class="pop_body">' +
			'      <div class="dlg-icon">' + icon + '</div>' +
			'      <div class="dlg-msg">' + message + '</div>' +
			'    </div>' +
			'    <div class="pop_footer">' +
			'      <div class="btn_box">' +
			'        <div class="right">' +
			'          <button type="button" class="page-btn btn-primary btn_alert_confirm">' + confirmText + '</button>' +
			'        </div>' +
			'      </div>' +
			'    </div>' +
			'  </div>' +
			'</div>';

		// 알림을 띄운 버튼에 포커스가 남아 있으면, 알림이 떠 있는 동안 엔터·스페이스가 그 버튼을 다시 눌러
		// 알림이 겹겹이 뜬다(뒷배경이 점점 어두워진다). 띄우기 전에 포커스를 뺀다. (showConfirm 과 같다)
		if (document.activeElement && document.activeElement !== document.body
				&& typeof document.activeElement.blur === 'function') {
			document.activeElement.blur();
		}

		// 모달을 body에 추가
		$('body').append(modalHtml);
		var $modal = $('#' + modalId);
		var $popupLayer = $modal.find(".popup_layer");
		$popupLayer.draggable({
			handle: '.pop_header',     // 헤더 영역만 드래그 핸들로 사용
			containment: 'window',     // 윈도우 영역 내에서만 이동 가능
			cursor: 'move',
			start: function(event, ui) {
				// 현재 요소의 위치 계산
				const offset = $popupLayer.offset();

				// transform 제거
				$popupLayer.css({
					'transform': 'none',
					'top': offset.top + 'px',
					'left': offset.left + 'px'
				});

				// jQuery UI의 위치 재설정
				ui.position.top = offset.top;
				ui.position.left = offset.left;
			}
		});
		// 확인 버튼 클릭 이벤트
		$modal.find('.btn_alert_confirm').on('click', function() {
			console.log('확인버튼')
			closeModal($modal);

			// 콜백 실행
			if (typeof callback === 'function') {
				setTimeout(function() {
					callback();
				}, 300); // 모달 닫힘 애니메이션이 끝난 후 콜백 실행
			}
		});

		// 닫기 버튼 클릭 이벤트
		$modal.find('.btn-close').on('click', function() {
			console.log('닫기버튼')
			closeModal($modal);

			// 확인 버튼과 동일한 동작
			if (typeof callback === 'function') {
				setTimeout(function() {
					callback();
				}, 300);
			}
		});

		// 모달 표시 (이미 show 클래스가 있으므로 추가 작업 불필요)
		// ESC 키 눌렀을 때 닫기 이벤트 추가
		$(document).on('keydown.' + modalId, function(e) {
			if (e.keyCode === 27) { // ESC 키
				$modal.find('.btn-close').trigger('click');
			}
		});

		return $modal;
	};

	/**
	 * 년월일시분초밀리초 형식의 고유 ID를 생성합니다.
	 * 형식: YYYYMMDDHHmmssSSS (예: 20250418160523456)
	 *
	 * @return {string} 생성된 타임스탬프 기반 고유 ID 문자열
	 */
	utils.generateTimestampId = function(){
	    const now = new Date();

	    const year = now.getFullYear().toString();
	    const month = (now.getMonth() + 1).toString().padStart(2, '0');
	    const day = now.getDate().toString().padStart(2, '0');
	    const hours = now.getHours().toString().padStart(2, '0');
	    const minutes = now.getMinutes().toString().padStart(2, '0');
	    const seconds = now.getSeconds().toString().padStart(2, '0');
	    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

	    return year + month + day + hours + minutes + seconds + milliseconds;
	}
	/**
	 * 년월일시분초밀리초 형식에 추가 접두사를 붙인 고유 ID를 생성합니다.
	 * 형식: PREFIX-YYYYMMDDHHmmssSSS (예: USER-20250418160523456)
	 *
	 * @param {string} prefix - ID 앞에 붙일 접두사
	 * @return {string} 접두사가 포함된 타임스탬프 기반 고유 ID 문자열
	 */
	utils.generateTimestampIdWithPrefix = function(prefix){
	    return prefix + utils.generateTimestampId();
	}

	/**
	 * element 매개변수를 jQuery 객체로 변환하는 함수
	 * @param {string|jQuery|HTMLElement} element - 변환할 컨테이너(선택자, ID, jQuery 객체 또는 DOM 요소)
	 * @returns {jQuery|null} - 변환된 jQuery 객체 또는 오류 시 null
	 */
	utils.getElement = function(element) {
		// 컨테이너가 없는 경우
		if (!element) {
			console.error('getElement: element가 제공되지 않았습니다.');
			return null;
		}

		var $element;

		// 문자열(선택자 또는 ID)인 경우
		if (typeof element === 'string') {
			// '#' 접두사 확인 후 추가
			var elementId = element.startsWith('#') ? element : '#' + element;
			$element = $(elementId);

			if ($element.length === 0) {
				console.error('getElement: 컨테이너를 찾을 수 없습니다. ID: ' + element);
				return null;
			}
		}
		// jQuery 객체인 경우
		else if (element instanceof jQuery) {
			$element = element;

			// jQuery 객체가 비어있는지 확인
			if ($element.length === 0) {
				console.error('getElement: 제공된 jQuery 객체에 요소가 없습니다.');
				return null;
			}
		}
		// HTML 요소인 경우
		else if (element instanceof HTMLElement) {
			$element = $(element);
		}
		// 그 외 잘못된 타입
		else {
			console.error('getElement: 잘못된 입력 타입입니다.', element);
			return null;
		}

		return $element;
	}

	/**
	* 확인 대화상자를 표시하는 함수
	* @param {string} message - 표시할 메시지
	* @param {function} confirmCallback - 확인 버튼 클릭 시 실행될 콜백 함수
	* @param {function} cancelCallback - 취소 버튼 클릭 시 실행될 콜백 함수 (선택 사항)
	* @param {string} title - 대화상자 제목 (기본값: '확인')
	* @param {object} options - 추가 옵션 (icon, confirmText, cancelText 등)
	*/
	utils.showConfirm = function(message, confirmCallback, cancelCallback, title, options) {

		// 모바일인 경우 기본 confirm 사용
		if (utils.isMobile()) {
			// HTML 태그 제거하여 순수 텍스트만 표시
			var plainMessage = message.replace(/<[^>]*>/g, '');
			var result = confirm(plainMessage);

			// 결과에 따라 콜백 실행
			if (result) {
				if (typeof confirmCallback === 'function') {
					setTimeout(function() {
						confirmCallback();
					}, 100);
				}
			} else {
				if (typeof cancelCallback === 'function') {
					setTimeout(function() {
						cancelCallback();
					}, 100);
				}
			}
			return null;
		}


		// 기본값 설정
		title = title || '확인';
		options = options || {};

		var icon = options.icon || DEFAULT_CONFIRM_ICON;   // 아이콘은 코드가 넘기는 HTML 이라 그대로 둔다
		var confirmText = _safeDialogText(options.confirmText || '확인');
		var cancelText = _safeDialogText(options.cancelText || '취소');
		message = _safeDialogText(message);
		title = _safeDialogText(title);

		// 모달 ID 생성 (고유한 ID)
		var modalId = 'biz-confirm-modal-' + Date.now();

		// 모달 HTML 생성
		_ensureDialogStyle();

		var modalHtml =
			'<div class="modal size_xs show biz-dialog" id="' + modalId + '" style="z-index:' + (++modalZIndex) + '">' +
			'  <div class="popup_layer">' +
			'    <div class="pop_header">' +
			'      <div class="pop_header_ttl">' + title + '</div>' +
			'      <button type="button" class="btn-close">close</button>' +
			'    </div>' +
			'    <div class="pop_body">' +
			'      <div class="dlg-icon">' + icon + '</div>' +
			'      <div class="dlg-msg">' + message + '</div>' +
			'    </div>' +
			'    <div class="pop_footer">' +
			'      <div class="btn_box">' +
			'        <div class="right">' +
			'          <button type="button" class="page-btn btn-ghost btn_confirm_cancel">' + cancelText + '</button>' +
			'          <button type="button" class="page-btn btn-primary btn_confirm_ok">' + confirmText + '</button>' +
			'        </div>' +
			'      </div>' +
			'    </div>' +
			'  </div>' +
			'</div>';

		// 확인창을 띄운 버튼에 포커스가 남아 있으면, 확인창이 떠 있는 동안 엔터·스페이스가 그 버튼을 다시 눌러
		// 확인창이 겹겹이 뜬다(뒷배경이 점점 어두워진다). 띄우기 전에 포커스를 뺀다.
		if (document.activeElement && document.activeElement !== document.body
				&& typeof document.activeElement.blur === 'function') {
			document.activeElement.blur();
		}

		// 모달을 body에 추가
		$('body').append(modalHtml);
		var $modal = $('#' + modalId);

		// 확인 버튼 클릭 이벤트
		$modal.find('.btn_confirm_ok').on('click', function() {
			closeModal($modal);

			// 확인 콜백 실행
			if (typeof confirmCallback === 'function') {
				setTimeout(function() {
					confirmCallback();
				}, 300); // 모달 닫힘 애니메이션이 끝난 후 콜백 실행
			}
		});

		// 취소 버튼 클릭 이벤트
		$modal.find('.btn_confirm_cancel').on('click', function() {
			closeModal($modal);

			// 취소 콜백 실행
			if (typeof cancelCallback === 'function') {
				setTimeout(function() {
					cancelCallback();
				}, 300); // 모달 닫힘 애니메이션이 끝난 후 콜백 실행
			}
		});

		// 닫기 버튼 클릭 이벤트 (취소와 동일 동작)
		$modal.find('.btn-close').on('click', function() {
			closeModal($modal);

			// 취소 콜백 실행
			if (typeof cancelCallback === 'function') {
				setTimeout(function() {
					cancelCallback();
				}, 300);
			}
		});

		// ESC 키 눌렀을 때 닫기 이벤트 추가
		$(document).on('keydown.' + modalId, function(e) {
			if (e.keyCode === 27) { // ESC 키
				$modal.find('.btn-close').trigger('click');
			}
		});

		return $modal;
	};


	utils.form = utils.form || {};
	/**
	 * 웹데이터 값 업데이트
	 */
	utils.form.setEditorUpdate = function() {
		let keys;
		switch(utils.info.EDITOR_TYPE){

			default:
				keys = Object.keys(CKEDITOR.instances);
				keys.forEach(function (key, idx) {
                    CKEDITOR.instances[key].updateElement();
                });
				break;
		}
	}
	//form 테그의 내용을 json 오브젝트로 리턴
	utils.form.formToJson = function(form) {
		var $form;
		// form이 문자열(ID)인지, jQuery 객체인지, DOM 요소인지 확인
		if (typeof form === 'string') {
			// 문자열인 경우 '#' 접두사 확인 후 추가
			var formId = form.startsWith('#') ? form : '#' + form;
			$form = $(formId);

			if ($form.length === 0) {
				console.error('formToJson: 폼을 찾을 수 없습니다. ID: ' + form);
				return {};
			}
		} else if (form instanceof jQuery) {
			// 이미 jQuery 객체인 경우
			$form = form;
		} else if (form instanceof HTMLElement) {
			// DOM 요소인 경우 jQuery 객체로 변환
			$form = $(form);
		} else {
			console.error('formToJson: 잘못된 입력 타입입니다.', form);
			return {};
		}

		// 폼인지 확인
		if (!$form.is('form')) {
			console.warn('formToJson: 선택된 요소가 폼이 아닙니다.', $form);
		}

		utils.form.setEditorUpdate();	//-- 에디터 값 업데이트

		var formData = {};
		var fields = $form.serializeArray();

		$.each(fields, function(i, field) {
			// 이미 해당 필드가 존재하는 경우 (체크박스 등의 다중 선택 필드)
			if (formData[field.name] !== undefined) {
				// 아직 배열이 아니면 배열로 변환
				if (!Array.isArray(formData[field.name])) {
					formData[field.name] = [formData[field.name]];
				}
				formData[field.name].push(field.value || '');
			} else {
				formData[field.name] = field.value || '';
			}
		});

		return formData;
	}
	/**
	 * 객체 데이터를 폼 요소에 자동으로 바인딩하는 유틸리티 함수 (비동기 처리 지원)
	 * @param {Object} data - 바인딩할 데이터 객체
	 * @param {jQuery|Element|String} container - 데이터를 바인딩할 컨테이너(선택자, DOM 요소 또는 jQuery 객체)
	 * @param {Object} options - 추가 옵션 (선택적)
	 * @param {Function} options.valueFormatter - 값을 포맷팅하는 함수 (key, value) => newValue
	 * @param {Function} options.keyMapper - 키를 변환하는 함수 (key) => newKey
	 * @param {Boolean} options.debug - 디버그 모드 활성화 여부 (기본값: false)
	 * @param {Number} options.retryCount - 요소를 찾을 수 없을 때 재시도 횟수 (기본값: 5)
	 * @param {Number} options.retryInterval - 재시도 간격 (ms) (기본값: 100)
	 * @returns {Promise} - 바인딩 작업이 완료되면 해결되는 Promise
	 */
	utils.form.bindData = function(data, container, options) {
		// 옵션 기본값 설정
		options = options || {};
		options.retryCount = options.retryCount || 5;
		options.retryInterval = options.retryInterval || 100;
		options.debug = !!options.debug;

		// 컨테이너를 jQuery 객체로 변환
		var $container;
		if (typeof container === 'string') {
			$container = $(container);
		} else if (container instanceof jQuery) {
			$container = container;
		} else if (container instanceof Element) {
			$container = $(container);
		} else {
			console.error('bindData: 유효하지 않은 컨테이너입니다.');
			return Promise.reject(new Error('유효하지 않은 컨테이너'));
		}

		if (!data || typeof data !== 'object') {
			console.error('bindData: 유효하지 않은 데이터입니다.');
			return Promise.reject(new Error('유효하지 않은 데이터'));
		}

		// 이미 바인딩된 필드와 바인딩 대기중인 필드를 추적
		var boundFields = new Set();
		var pendingFields = new Set(Object.keys(data));
		var selectFieldsRetrying = new Set(); // select 요소 재시도 필드 추적

		// 첫 번째 바인딩 시도 - 이미 존재하는 요소에 바인딩
		pendingFields.forEach(function(key) {
			try {
				var mappedKey = options.keyMapper ? options.keyMapper(key) : key;
				var $elements = $container.find('#' + mappedKey);

				if ($elements.length > 0) {
					// 요소가 존재하면 바인딩 시도
					bindFieldToElements(key, data[key], $elements, options);
					boundFields.add(key);
					pendingFields.delete(key);
				}
			} catch (e) {
				// SELECT_OPTIONS_NOT_READY 예외 처리
				if (e.message === 'SELECT_OPTIONS_NOT_READY') {
					selectFieldsRetrying.add(key);
					if (options.debug) {
						console.log('bindData: select 옵션 준비 안됨, 재시도 예약:', key);
					}
				} else if (options.debug) {
					console.error('bindData 초기 처리 중 오류:', e, key, data[key]);
				}
			}
		});

		// 모든 필드가 바인딩 되었고 select 재시도도 없으면 바로 완료
		if (pendingFields.size === 0 && selectFieldsRetrying.size === 0) {
			$container.trigger('biz:bindDataComplete', [data]);
			return Promise.resolve(data);
		}

		// 아직 바인딩되지 않은 필드가 있으면 재시도 로직 실행
		return new Promise(function(resolve) {
			var retryAttempts = 0;

			function attemptRemainingBindings() {
				var newlyBoundFields = false;

				// 각 대기 중인 필드에 대해 바인딩 시도
				pendingFields.forEach(function(key) {
					try {
						var mappedKey = options.keyMapper ? options.keyMapper(key) : key;
						var $elements = $container.find('#' + mappedKey);

						if ($elements.length > 0) {
							// 요소가 존재하면 바인딩 시도
							bindFieldToElements(key, data[key], $elements, options);
							boundFields.add(key);
							pendingFields.delete(key);
							newlyBoundFields = true;
						}
					} catch (e) {
						// SELECT_OPTIONS_NOT_READY 예외 처리
						if (e.message === 'SELECT_OPTIONS_NOT_READY') {
							selectFieldsRetrying.add(key);
							if (options.debug) {
								console.log('bindData: select 옵션 준비 안됨, 계속 재시도:', key);
							}
						} else if (options.debug) {
							console.error('bindData 재시도 중 오류:', e, key, data[key]);
						}
					}
				});

				// select 재시도 필드 처리
				selectFieldsRetrying.forEach(function(key) {
					try {
						var mappedKey = options.keyMapper ? options.keyMapper(key) : key;
						var $elements = $container.find('#' + mappedKey);

						if ($elements.length > 0) {
							// select 옵션 다시 확인하여 바인딩 시도
							bindFieldToElements(key, data[key], $elements, options);
							boundFields.add(key);
							selectFieldsRetrying.delete(key);
							newlyBoundFields = true;

							if (options.debug) {
								console.log('bindData: select 옵션 준비됨, 바인딩 성공:', key);
							}
						}
					} catch (e) {
						// 계속 재시도 필요
						if (e.message !== 'SELECT_OPTIONS_NOT_READY' && options.debug) {
							console.error('bindData select 재시도 중 오류:', e, key, data[key]);
						}
					}
				});

				// 재시도 로직
				if ((pendingFields.size > 0 || selectFieldsRetrying.size > 0) &&
					retryAttempts < options.retryCount) {
					retryAttempts++;

					if (options.debug) {
						console.log('bindData: 재시도 #' + retryAttempts +
							', 남은 일반 필드: ' + Array.from(pendingFields).join(', ') +
							', 남은 select 필드: ' + Array.from(selectFieldsRetrying).join(', '));
					}

					setTimeout(attemptRemainingBindings, options.retryInterval);
				} else {
					// 재시도 횟수 초과 또는 모든 필드 바인딩 완료
					var allPendingFields = new Set([...pendingFields, ...selectFieldsRetrying]);

					if (allPendingFields.size > 0 && options.debug) {
						console.warn('bindData: 다음 필드들이 바인딩되지 않았습니다: ' +
							Array.from(allPendingFields).join(', '));
					}

					// 이벤트 트리거 및 Promise 해결
					$container.trigger('biz:bindDataComplete', [data, {
						boundFields: Array.from(boundFields),
						pendingFields: Array.from(allPendingFields)
					}]);

					resolve(data);
				}
			}

			// 첫 번째 재시도 시작
			setTimeout(attemptRemainingBindings, options.retryInterval);
		});
	};

	/**
	 * 단일 필드를 DOM 요소에 바인딩하는 내부 헬퍼 함수
	 */
	function bindFieldToElements(key, value, $elements, options) {
		// null이나 undefined 값은 빈 문자열로 처리
		if (value === null || value === undefined) {
			value = '';
		}

		// 값 포맷팅 처리
		var formattedValue = value;
		if (options.valueFormatter && typeof options.valueFormatter === 'function') {
			formattedValue = options.valueFormatter(key, value);
		}

		// 디버그 로그
		if (options.debug) {
			console.log('bindData: 바인딩', key, formattedValue);
		}

		// Select 옵션이 없는 경우 재시도가 필요한지 확인하는 플래그
		var needsRetryForSelect = false;

		// 각 요소 타입에 따라 값 설정
		$elements.each(function() {
			var $element = $(this);
			var tagName = this.tagName.toLowerCase();
			var type = $element.attr('type');

			// 타입별 처리
			if (tagName === 'input') {
				if (type === 'radio') {
					// 라디오 버튼 처리
					var $radios = $element.closest('form, div, container')
						.find('input[name="' + $element.attr('name') + '"]');
					// 값으로 셀렉터를 만들지 않고 직접 비교한다 (값에 따옴표 · 대괄호가 있으면 셀렉터가 깨진다)
					$radios.filter(function() { return this.value === String(formattedValue); }).prop('checked', true);
				} else if (type === 'checkbox') {
					// 체크박스 처리
					if (Array.isArray(formattedValue)) {
						$element.prop('checked', formattedValue.includes($element.val()));
					} else {
						var isChecked = formattedValue === true ||
							formattedValue === 'true' ||
							formattedValue === 'Y' ||
							formattedValue === '1' ||
							formattedValue === 1 ||
							formattedValue === $element.val();
						$element.prop('checked', isChecked);
					}
				} else if (type === 'date') {
					// date 타입 입력 필드 처리
					if (formattedValue) {
						try {
							// ISO 형식의 날짜 문자열인 경우 yyyy-MM-dd 형식으로 변환
							if (typeof formattedValue === 'string' &&
								(formattedValue.includes('T') || formattedValue.includes('Z'))) {
								const date = new Date(formattedValue);
								if (!isNaN(date.getTime())) {
									const year = date.getFullYear();
									const month = String(date.getMonth() + 1).padStart(2, '0');
									const day = String(date.getDate()).padStart(2, '0');
									formattedValue = `${year}-${month}-${day}`;
								}
							} else if (formattedValue instanceof Date) {
								// Date 객체인 경우
								const year = formattedValue.getFullYear();
								const month = String(formattedValue.getMonth() + 1).padStart(2, '0');
								const day = String(formattedValue.getDate()).padStart(2, '0');
								formattedValue = `${year}-${month}-${day}`;
							}

							// 변환된 날짜 문자열을 입력 필드에 설정
							$element.val(formattedValue);

							if (options.debug) {
								console.log('bindData: date 필드 바인딩', key, formattedValue);
							}
						} catch (e) {
							console.error('날짜 변환 중 오류:', e);
							$element.val(''); // 오류 시 빈 값으로 설정
						}
					} else {
						$element.val('');
					}
				} else {
					// 일반 텍스트 입력
					$element.val(formattedValue);
				}
			} else if (tagName === 'select') {
				// select 요소의 옵션 개수 확인
				var optionsCount = $element.find('option').length;

				// 옵션이 너무 적거나 없는 경우 (최소한 "선택" 옵션 하나와 실제 데이터 옵션이 있어야 함)
				if (optionsCount < 2) {
					if (options.debug) {
						console.log('bindData: select 요소의 옵션이 부족합니다. 재시도 필요:', key, optionsCount);
					}
					needsRetryForSelect = true;
					return; // 현재 each 루프 항목 건너뛰기
				}

				// 옵션이 충분한 경우 값 설정
				$element.val(formattedValue);

				// select2 등의 플러그인 지원
				if ($element.hasClass('select2-hidden-accessible')) {
					$element.trigger('change');
				}
			} else if (tagName === 'textarea') {
				// 텍스트 영역
				$element.val(formattedValue);
				// CKEditor 인스턴스가 있는지 확인
	            var elementId = $element.attr('id');
	            if (elementId && typeof CKEDITOR !== 'undefined' &&
	                CKEDITOR.instances && CKEDITOR.instances[elementId]) {

	                // CKEditor가 준비된 상태인지 확인
	                if (CKEDITOR.instances[elementId].status === 'ready') {
	                    CKEDITOR.instances[elementId].setData(formattedValue);
	                    if (options.debug) {
	                        console.log('bindData: CKEditor 즉시 데이터 설정', elementId, formattedValue);
	                    }
	                } else {
	                    // 준비되지 않았다면 준비 완료 후 설정
	                    CKEDITOR.instances[elementId].on('instanceReady', function() {
	                        this.setData(formattedValue);
	                        if (options.debug) {
	                            console.log('bindData: CKEditor 준비 후 데이터 설정', elementId, formattedValue);
	                        }
	                    });
	                }
	            }
			} else {
				// 기타 요소 (div, span 등) - 글자로 설정. DB 값을 .html() 로 넣으면 스크립트가 실행될 수 있다 (2026-10-15 보안점검 M-8)
				$element.text(formattedValue);
			}
		});

		// select 요소에 대한 재시도가 필요한 경우 예외 발생
		if (needsRetryForSelect) {
			throw new Error('SELECT_OPTIONS_NOT_READY');
		}
	}

	// 객체에서 모든 키를 소문자로 변환하는 유틸리티 함수
	utils.object = biz.object || {};
	utils.object.toLowerKeys = function(obj) {
		return Object.keys(obj).reduce((acc, key) => {
			acc[key.toLowerCase()] = obj[key];
			return acc;
		}, {});
	};

	// 특정 키 매핑을 위한 유틸리티 함수
	utils.object.mapKeys = function(obj, keyMap) {
		return Object.keys(obj).reduce((acc, key) => {
			const newKey = keyMap[key] || key;
			acc[newKey] = obj[key];
			return acc;
		}, {});
	};

	/**
	 * 모달 닫기 함수 (내부용)
	 * @param {jQuery} $modal - 닫을 모달 jQuery 객체
	 */
	function closeModal($modal) {
		// 모달 ID 가져오기
		var modalId = $modal.attr('id');

		// CSS 트랜지션을 위한 클래스 추가
		$modal.find('.popup_layer').addClass('fold-up-closing');

		// 키보드 이벤트 해제
		$(document).off('keydown.' + modalId);

		// 애니메이션 후 모달 제거
		setTimeout(function() {
			$modal.remove();
		}, 100);
	}
})(window.biz);