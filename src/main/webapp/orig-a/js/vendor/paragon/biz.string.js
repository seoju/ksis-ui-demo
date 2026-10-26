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
// biz.string.js - 문자열 관련 유틸리티
(function(utils) {
	// 비공개 함수: 다양한 형식의 날짜를 Date 객체로 변환
	function _parseDate(value) {
		if (!value) return null; // null, undefined, 빈 문자열 등은 null 반환

		let dateObj = null;

		try {
			// 문자열인 경우 처리
			if (typeof value === 'string') {
				// ISO 형식의 날짜 문자열 (MSSQL 등)
				if (value.includes('T') || value.includes('Z')) {
					dateObj = new Date(value);
				}
				// Oracle 형식 (예: '08-MAY-25')
				else if (/^\d{2}-[A-Z]{3}-\d{2}$/.test(value)) {
					const parts = value.split('-');
					const day = parseInt(parts[0], 10);
					const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
					const month = monthNames.indexOf(parts[1]);
					let year = parseInt(parts[2], 10);

					// 2자리 연도를 4자리로 변환
					if (year < 50) {
						year += 2000;
					} else {
						year += 1900;
					}

					dateObj = new Date(year, month, day);
				}
				// Oracle 형식 + 시간 (예: '08-MAY-25 14:30:00')
				else if (/^\d{2}-[A-Z]{3}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
					const datePart = value.substring(0, 9);
					const timePart = value.substring(10);

					const parts = datePart.split('-');
					const day = parseInt(parts[0], 10);
					const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
					const month = monthNames.indexOf(parts[1]);
					let year = parseInt(parts[2], 10);

					if (year < 50) year += 2000;
					else year += 1900;

					const timeParts = timePart.split(':');
					const hours = parseInt(timeParts[0], 10);
					const minutes = parseInt(timeParts[1], 10);
					const seconds = parseInt(timeParts[2], 10);

					dateObj = new Date(year, month, day, hours, minutes, seconds);
				}
				// MariaDB/MySQL 형식 (yyyy-MM-dd HH:mm:ss)
				else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
					dateObj = new Date(value.replace(' ', 'T'));
				}
				// 날짜만 있는 형식 (yyyy-MM-dd)
				else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
					dateObj = new Date(`${value}T00:00:00`);
				}
				// 날짜 형식으로 보이는 문자열은 Date 객체로 변환 시도
				else if (/\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(value)) {
					dateObj = new Date(value);
				}
			}
			// Date 객체인 경우
			else if (value instanceof Date) {
				dateObj = value;
			}
			// 숫자(timestamp)인 경우
			else if (typeof value === 'number') {
				dateObj = new Date(value);
			}

			// 날짜 객체가 유효한지 확인
			if (dateObj && isNaN(dateObj.getTime())) {
				return null;
			}

			return dateObj;
		} catch (error) {
			console.error('Date parsing error:', error);
			return null;
		}
	}

	// 공개 API
	utils.string = utils.string || {};

	utils.string = {
		/**
		 * HTML 특수문자를 이스케이프한다.
		 * 서버에서 받은 값을 HTML 문자열로 조립해 .html() 로 넣을 때 쓴다(개발 규칙 1-3).
		 * 값만 넣으면 되는 곳은 .text() / .val() 이 낫다.
		 */
		escapeHtml: function(value) {
			if (value === null || value === undefined) return '';
			return String(value)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
		},
		trim: function(str) {
			return str ? str.trim() : '';
		},
		isEmpty: function(str) {
			return !str || str.trim() === '';
		},
		truncate: function(str, maxLength, suffix = '...') {
			if (!str || str.length <= maxLength) return str;
			return str.substring(0, maxLength) + suffix;
		},
		/**
		   * 쿼리스트링 형태의 파라미터를 JSON 객체로 변환하는 함수
		   * @param {string} paramString - 변환할 쿼리스트링 (예: "cd=, modalId=downCodeWriteModal, modalSize=size_m, upCd=USE_Y")
		   * @param {string} [pairSeparator=','] - 파라미터 쌍 구분자 (기본값: ',')
		   * @param {string} [keyValueSeparator='='] - 키-값 구분자 (기본값: '=')
		   * @returns {object} - 변환된 JSON 객체
		   */
		queryStringToJson: function(paramString, pairSeparator, keyValueSeparator) {
			// 기본값 설정
			pairSeparator = pairSeparator || ',';
			keyValueSeparator = keyValueSeparator || '=';

			// 빈 객체 생성
			var result = {};

			// 파라미터가 비어있거나 유효하지 않은 경우 빈 객체 반환
			if (!paramString || typeof paramString !== 'string') {
				return result;
			}

			// 중괄호 제거 (있는 경우)
			paramString = paramString.replace(/^\{|\}$/g, '');

			// 쿼리스트링 파싱
			var pairs = paramString.split(pairSeparator);

			pairs.forEach(function(pair) {
				// 공백 제거
				pair = pair.trim();

				// 빈 문자열이 아닌 경우만 처리
				if (pair) {
					var keyValue = pair.split(keyValueSeparator);
					var key = keyValue[0].trim();
					var value = keyValue.length > 1 ? keyValue[1].trim() : '';

					// 키가 있는 경우만 결과 객체에 추가
					if (key) {
						result[key] = value;
					}
				}
			});

			return result;
		},
		// YYYY-MM-DD 형식으로 리턴
		formatDate: function(value) {
			const dateObj = _parseDate(value);
			if (!dateObj) return value;

			const year = dateObj.getFullYear();
			const month = String(dateObj.getMonth() + 1).padStart(2, '0');
			const day = String(dateObj.getDate()).padStart(2, '0');

			return `${year}-${month}-${day}`;
		},
		// YYYY-MM-DD HH:MM 형식으로 리턴
		formatDatetime: function(value) {
			const dateObj = _parseDate(value);
			if (!dateObj) return value;

			const year = dateObj.getFullYear();
			const month = String(dateObj.getMonth() + 1).padStart(2, '0');
			const day = String(dateObj.getDate()).padStart(2, '0');
			const hours = String(dateObj.getHours()).padStart(2, '0');
			const minutes = String(dateObj.getMinutes()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
		// YYYY-MM-DD HH:MM:ss 형식으로 리턴
		formatFullDatetime: function(value) {
			const dateObj = _parseDate(value);
			if (!dateObj) return value;

			const year = dateObj.getFullYear();
			const month = String(dateObj.getMonth() + 1).padStart(2, '0');
			const day = String(dateObj.getDate()).padStart(2, '0');
			const hours = String(dateObj.getHours()).padStart(2, '0');
			const minutes = String(dateObj.getMinutes()).padStart(2, '0');
			const seconds = String(dateObj.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		formatLocalDateTime: function(value) {
			const dateObj = _parseDate(value);
			if (!dateObj) return value;

			const year = dateObj.getFullYear();
			const month = String(dateObj.getMonth() + 1).padStart(2, '0');
			const day = String(dateObj.getDate()).padStart(2, '0');
			const hours = String(dateObj.getHours()).padStart(2, '0');
			const minutes = String(dateObj.getMinutes()).padStart(2, '0');
			const seconds = String(dateObj.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
		},
		/**
		 * 숫자에 콤마를 붙여서 통화 형식으로 포맷팅하는 함수
		 * @param {number|string} value - 포맷팅할 숫자
		 * @param {number} [decimalPlaces] - 소수점 자릿수 (생략시 소수점 표시 안함)
		 * @returns {string} - 콤마가 붙은 통화 형식 문자열
		 */
		formatCurrency: function(value, decimalPlaces) {
			// null, undefined, 빈 문자열 체크
			if (value === null || value === undefined || value === '') {
				return '';
			}

			// 숫자로 변환
			var num = parseFloat(value);

			// 유효하지 않은 숫자인 경우 원본 값 반환
			if (isNaN(num)) {
				return value;
			}

			// 소수점 자릿수가 지정된 경우
			if (decimalPlaces !== undefined && decimalPlaces !== null) {
				// 음수는 0으로 처리
				decimalPlaces = Math.max(0, parseInt(decimalPlaces, 10) || 0);
				num = num.toFixed(decimalPlaces);
			} else {
				// 소수점 자릿수가 지정되지 않은 경우 정수로 변환
				num = Math.round(num).toString();
			}

			// 콤마 추가
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}

})(window.biz);