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
 // biz.validate.js - 유효성 검사 관련 유틸리티
 (function(utils) {
     utils.validate = utils.validate || {};

     utils.validate.isEmail = function(email) {
         const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
         return regex.test(email);
     };

     utils.validate.isNumeric = function(value) {
         return !isNaN(parseFloat(value)) && isFinite(value);
     };

     utils.validate.required = function(value) {
         if (typeof value === 'string') {
             return value.trim() !== '';
         }
         return value !== null && value !== undefined;
     };
 })(window.biz);