/**
 * biz.lang.js - Language utility module for internationalization
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
    // 언어 모듈 네임스페이스 생성
    utils.lang = utils.lang || {};

    // 비공개 변수
    let _langData = {};          // 언어 데이터 저장소
    let _currentLocale = 'KO';   // 현재 언어 설정 (기본값: 한국어)
    let _initialized = false;    // 초기화 여부
    let _storageKey = 'BIZ_LANG_DATA'; // 로컬 스토리지 키
    let _version = 'BIZ_LANG_VERSION'; // 버전 키

    // 비공개 함수
    function _loadFromStorage() {
        const storedVersion = localStorage.getItem(_version);
        if (storedVersion) {
            const storedData = localStorage.getItem(_storageKey);
            if (storedData) {
                try {
                    _langData = JSON.parse(storedData);
                    _initialized = true;
                    return true;
                } catch (e) {
                    console.error('언어 데이터 파싱 오류:', e);
                }
            }
        }
        return false;
    }

    function _saveToStorage(version) {
        try {
            localStorage.setItem(_storageKey, JSON.stringify(_langData));
            localStorage.setItem(_version, version || new Date().getTime());
        } catch (e) {
            console.error('언어 데이터 저장 오류:', e);
        }
    }

    /**
     * 한 용어 항목에서 현재 로케일 텍스트를 고른다.
     * 해당 로케일 컬럼이 없거나 비어 있으면 영어 → 한국어 순으로 대체한다.
     * t_sys_lang 은 ko/en/zh/ja 4개만 가지므로, 그 밖의 로케일(예: 스페인어권)은 영어로 보인다.
     * @private
     */
    function _pick(item) {
        if (!item) return '';
        return item[_currentLocale.toLowerCase()] || item['en'] || item['ko'] || '';
    }

    // 공개 API

    /**
     * 언어 모듈 초기화
     * @param {Object} options - 초기화 옵션
     * @param {string} options.locale - 사용할 언어 코드 (기본값: 'KO')
     * @param {boolean} options.forceReload - 캐시 무시하고 강제 로드 여부
     * @param {Function} options.callback - 초기화 완료 후 실행할 콜백 함수
     */
    utils.lang.init = function(options = {}) {
        options = {
            locale: options.locale || _currentLocale,
            forceReload: options.forceReload || false,
            callback: options.callback || function() {}
        };

        _currentLocale = options.locale.toUpperCase();

        // 이미 초기화되었고 강제 로드가 아니면 캐시된 데이터 사용
        if (_initialized && !options.forceReload && _loadFromStorage()) {
            options.callback(true);
            return;
        }

        // 서버에서 언어 데이터 로드
        utils.ajax.request({
            url: utils.getUrl('/paragon/lang/findAll'),
            type: 'GET',
            callback: function(response) {
                if (response && response.data) {
					console.log('response', response);
                    _langData = {};
                    response.data.forEach(function(item) {
                        _langData[item.langCd] = item;
                    });

                    _initialized = true;
                    _saveToStorage();
                    options.callback(true);
                } else {
                    console.error('언어 데이터 로드 실패');
                    options.callback(false);
                }
            }
        });
    };

    /**
     * 현재 사용 중인 언어 코드 가져오기
     * @returns {string} 현재 언어 코드
     */
    utils.lang.getLocale = function() {
        return _currentLocale;
    };

    /**
     * 언어 코드 설정하기
     * @param {string} locale - 설정할 언어 코드
     */
    utils.lang.setLocale = function(locale) {
        if (locale) {
            _currentLocale = locale.toUpperCase();
        }
    };

    /**
     * 언어 코드에 해당하는 텍스트 가져오기
     * @param {string} langCd - 언어 코드
     * @param {string} label - 레이블 (선택 사항)
     * @returns {string} 번역된 텍스트
     */
    utils.lang.getLang = function(langCd, label) {
        // 모듈이 초기화되지 않았으면 초기화
        if (!_initialized) {
            _loadFromStorage();
        }

        if (!langCd) return '';

        // 다중 코드 처리 (코드가 '≫'나 ','로 연결된 경우)
        if (langCd.indexOf('≫') > -1 || langCd.indexOf(',') > -1) {
            const separator = langCd.indexOf('≫') > -1 ? '≫' : ',';
            const codes = langCd.split(separator);
            const results = [];

            codes.forEach(function(code) {
                if (code) {
                    let text = '';
                    if (_langData[code]) {
                        text = _pick(_langData[code]) || code;
                    } else {
                        text = code;
                    }
                    results.push(text);
                }
            });

            return results.join(separator);
        }

        // 단일 코드 처리
        if (_langData[langCd]) {
            let text = _pick(_langData[langCd]);
            // 레이블 처리
            if (label && text.indexOf('[LABEL]') > -1) {
                let labelText = label;
                if (_langData[label]) {
                    labelText = _pick(_langData[label]) || label;
                }
                text = text.replace('[LABEL]', labelText);

                // 한국어일 경우 종성에 따른 조사 처리
                if (_currentLocale === 'KO' && typeof label === 'string') {
                    text = _processKoreanParticles(text, label);
                }
            }

            return text || langCd;
        }

        return langCd;
    };

    /**
     * 번역이 있으면 번역을, 없으면 기본 텍스트를 돌려준다.
     * getLang 은 못 찾으면 코드 문자열을 그대로 돌려주기 때문에
     * `getLang(code) || '기본값'` 은 동작하지 않는다. JS 로 만드는 텍스트
     * (그리드 헤더, 버튼 라벨, 메시지)는 이 함수를 쓴다.
     *
     * @param {string} langCd - 다국어 코드
     * @param {string} defaultText - 용어가 등록돼 있지 않을 때 쓸 텍스트
     * @returns {string}
     */
    utils.lang.text = function(langCd, defaultText) {
        if (!langCd) return defaultText || '';
        var translated = utils.lang.getLang(langCd);
        return (translated && translated !== langCd) ? translated : (defaultText || '');
    };

    /**
     * 지정된 영역의 언어 코드를 번역된 텍스트로 변환
     * @param {string|jQuery} container - 변환할 영역(선택자 또는 jQuery 객체)
     */
    utils.lang.doConvert = function(container) {
        const $container = container ? biz.getElement(container) : $('body');
        const $elements = $container.find('[data-term]');

        $elements.each(function() {
            const $element = $(this);
            const term = $element.data('term');
            const tagName = $element.prop('tagName');

            if (!term) return;

            const translatedText = utils.lang.getLang(term);

            // 등록되지 않은 코드면 getLang 이 코드 문자열을 그대로 돌려준다.
            // 그때는 화면을 건드리지 않고 JSP 에 적혀 있는 원문(대개 한글)을 그대로 둔다.
            // 이래야 용어를 등록하기 전에도 data-term 을 미리 붙여 둘 수 있다.
            if (!translatedText || translatedText === term) return;

            // 요소 타입별 처리
            switch(tagName) {
                case 'IMG':
                    $element.attr('title', translatedText);
                    break;

                case 'INPUT':
                    const inputType = $element.attr('type');
                    if (inputType === 'button' || inputType === 'submit') {
                        $element.val(translatedText);
                    } else if (inputType === 'text' || inputType === 'search') {
                        if ($element.attr('placeholder')) {
                            $element.attr('placeholder', translatedText);
                        } else {
                            $element.val(translatedText);
                        }
                    }
                    break;

                case 'TEXTAREA':
                    if ($element.attr('placeholder')) {
                        $element.attr('placeholder', translatedText);
                    } else {
                        $element.val(translatedText);
                    }
                    break;

                case 'A':
                case 'BUTTON':
                    $element.html(translatedText);
                    break;

                case 'DIV':
                case 'SPAN':
                case 'P':
                case 'H1':
                case 'H2':
                case 'H3':
                case 'H4':
                case 'H5':
                case 'H6':
                case 'TH':
                case 'TD':
                case 'LABEL':
                    $element.html(translatedText);
                    if ($element.attr('title')) {
                        $element.attr('title', translatedText);
                    }
                    break;

                default:
                    // 기본 처리
                    $element.html(translatedText);
            }
        });
    };

    /**
     * 한국어 종성에 따른 조사 처리
     * @private
     * @param {string} text - 처리할 텍스트
     * @param {string} word - 종성 판단할 단어
     * @returns {string} 처리된 텍스트
     */
    function _processKoreanParticles(text, word) {
        if (!word || word.length === 0) return text;

        // 마지막 글자의 유니코드 가져오기
        const lastChar = word.charCodeAt(word.length - 1);

        // 한글 범위 확인 (AC00-D7A3)
        if (lastChar < 0xAC00 || lastChar > 0xD7A3) return text;

        // 종성 있는지 확인 ((lastChar - 0xAC00) % 28 > 0)
        const hasJongsung = (lastChar - 0xAC00) % 28 > 0;

        // 조사 변환
        text = text.replace(/을\(를\)/g, hasJongsung ? '을' : '를');
        text = text.replace(/이\(가\)/g, hasJongsung ? '이' : '가');
        text = text.replace(/은\(는\)/g, hasJongsung ? '은' : '는');

        return text;
    }

    // 페이지 로드 시 자동 초기화
    $(function() {
        // 스토리지에서 로드 시도
        if (!_loadFromStorage()) {
            // 실패하면 서버에서 로드
            utils.lang.init();
        }

        // 페이지 내 언어 코드 변환
        utils.lang.doConvert();
    });

})(window.biz = window.biz || {});