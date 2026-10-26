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
//--
/**
 * biz.auth.checkPwdDte(function(param){
 * 	console.log(param);
 * })
 */
(function(utils) {
	utils.auth = utils.auth || {};

	utils.auth.checkPwdDte = function(callFnc) {
		biz.ajax.request({
			url: biz.getUrl('/paragon/common/getUptPwdDate')
			, type: 'GET'
			, callback: function(json) {
				const pwdDate = new Date(json.pwdUptDte);
				const currentDate = new Date();
				const sixMonthsLater = new Date(pwdDate);
				sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 3);

				const isExpired = currentDate > sixMonthsLater;
				const daysRemaining = Math.ceil((sixMonthsLater - currentDate) / (1000 * 60 * 60 * 24));

				console.log(isExpired);
				console.log('daysRemaining', (isExpired ? 0 : daysRemaining));
				console.log('expiryDate', (sixMonthsLater.toISOString().split('T')[0]));

				if(typeof callFnc === 'function'){
					callFnc({
						isExpired: isExpired,
						daysRemaining: isExpired ? 0 : daysRemaining,
						expiryDate: sixMonthsLater.toISOString().split('T')[0]
					})
				}
			}
		})
	}


})(window.biz = window.biz || {});