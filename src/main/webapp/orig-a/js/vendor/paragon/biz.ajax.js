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
 // biz.ajax.js - AJAX 관련 유틸리티
 (function(utils) {
     // 비공개 변수/함수
     const _defaultSettings = {
         type: 'POST',
         dataType: 'json',
         contentType: 'application/json',
         cache: false,
         timeout: 30000,
         error: function(xhr, status, error) {
             console.error('Ajax 오류 발생:', error);
			 LoadingModal.hide(); // 로딩 모달 숨김
             utils.showAlert('요청 처리 중 오류가 발생했습니다.');
         }
     };

     // 공개 API
     utils.ajax = utils.ajax || {};

	 utils.ajax.request = function(options) {
	     if (!options.url) {
	         console.error('URL이 필요합니다.');
	         return;
	     }
	     
	     // showLoading이 false면 로딩 모달 표시 안함
	     const showLoading = options.showLoading !== false;
	     
	     if (showLoading) {
	         const loadingMessage = options.loadingMessage || '처리중';
	         LoadingModal.show(loadingMessage);
	     }
	     
	     const settings = {
	         ..._defaultSettings,
	         url: options.url,
	         success: function(data, textStatus, xhr) {
	             if (showLoading) LoadingModal.hide();
	             if (options.callback && typeof options.callback === 'function') {
	                 options.callback(data, textStatus, xhr);
	             }
	         },
	         error: function(xhr, status, error) {
	             if (showLoading) LoadingModal.hide();
	             console.error('Ajax 오류 발생:', error);
	             if (options.errorCallback && typeof options.errorCallback === 'function') {
	                 options.errorCallback(xhr, status, error);
	             } else {
	                 utils.showAlert('요청 처리 중 오류가 발생했습니다.');
	             }
	         },
	         complete: function(xhr, status) {
	             if (showLoading) LoadingModal.hide();
	             if (options.completeCallback && typeof options.completeCallback === 'function') {
	                 options.completeCallback(xhr, status);
	             }
	         }
	     };

		 // 사용자 정의 옵션
		 if (options.type) settings.type = options.type;
		 if (options.dataType) settings.dataType = options.dataType;
		 if (options.contentType) settings.contentType = options.contentType;

		 // GET 요청일 경우 파라미터 처리 방식 변경
		 if (options.type && options.type.toUpperCase() === 'GET') {
			 settings.data = options.param; // URL 쿼리 파라미터로 전송
		 } else {
			 // POST 등의 요청은 JSON으로 변환
			 settings.data = options.param ? JSON.stringify(options.param) : null;
		 }

		 // Ajax 요청 실행
		 $.ajax(settings);
	 };
 })(window.biz);