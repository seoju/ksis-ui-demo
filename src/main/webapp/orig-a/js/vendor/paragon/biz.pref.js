/**
 * biz.pref.js - 사용자별 화면 설정 저장소 + 「본인 기준 조회」 체크박스
 * Copyright 2026 Vertexid
 *
 * ------------------------------------------------------------------
 * biz.pref : 설정 저장소
 *
 *   브라우저(localStorage)에 담는다. 사용자가 각자 고정 PC 를 쓰는 환경이라
 *   이걸로 충분하다고 판단했다. 서버 요청이 없고 테이블도 필요 없다.
 *   키를 로그인 ID 로 나눠 한 PC 를 여럿이 써도 설정이 섞이지 않는다.
 *
 *   아래 중 하나라도 생기면 그때 사용자별 설정 테이블로 옮긴다.
 *     - 사용자가 여러 PC 를 옮겨 다닌다
 *     - VDI 처럼 세션이 초기화되는 환경에서 쓴다
 *     - 보안 정책상 브라우저 데이터를 주기적으로 지운다
 *     - 관리자가 기본값을 일괄 배포할 일이 생긴다
 *
 *   옮길 때는 _load / _save 두 함수만 서버 호출로 바꾼다. 화면 코드는 그대로다.
 *   그때의 방침:
 *     - 읽기는 로그인 직후 한 번에 전부 받아 캐시한다. 화면마다 묻지 않는다.
 *     - 쓰기는 디바운스해서 보낸다. 실패해도 조용히 넘어간다(설정은 부가 기능이라
 *       업무를 막으면 안 된다).
 *
 * biz.ui.selfFilter : 조회 화면 공통 「본인 기준 조회」 체크박스
 *
 *   · 체크하면 본인이 «작성자» 인 건만 조회한다. 해제하면 전체.
 *   · 설정은 화면별로 기억해 다음 접속에도 유지한다.
 *   · 작성자 개념이 없는 화면에는 두지 않는다.
 *
 *   서버는 TabulatorPagingParamFunction 이 selfOnly='Y' 일 때 loginId 를 채워 준다.
 *   각 매퍼는 아래 한 줄만 넣으면 된다.
 *
 *     <if test="loginId != null and !loginId.equals('')">
 *     AND M.reg_login_id = #{loginId}
 *     </if>
 * ------------------------------------------------------------------
 */
(function(utils) {

	utils.pref = utils.pref || {};

	var PREFIX = 'ksis.pref.';
	var SAVE_DELAY = 500;      // 연타해도 마지막 값 하나만 저장한다
	var MAX_LEN = 2000;        // 저장소 컬럼 길이에 맞춘 상한

	var _timers = {};

	/** 설정은 사용자별로 나눈다. 한 PC 를 여러 사람이 써도 섞이지 않는다. */
	function _owner() {
		return (window.KSIS_LOGIN_ID && String(window.KSIS_LOGIN_ID)) || 'anonymous';
	}

	function _fullKey(key) {
		return PREFIX + _owner() + '.' + key;
	}

	function _load(key) {
		try {
			return localStorage.getItem(_fullKey(key));
		} catch (e) {
			return null;   // 시크릿 모드 등에서 접근이 막힐 수 있다
		}
	}

	function _save(key, value) {
		try {
			if (value === null || value === undefined) {
				localStorage.removeItem(_fullKey(key));
			} else {
				localStorage.setItem(_fullKey(key), value);
			}
		} catch (e) {
			// 저장 실패가 화면을 막으면 안 된다. 조용히 넘어간다.
		}
	}

	/**
	 * 설정 읽기
	 * @param {string} key - 설정 키. 화면 설정은 모듈 ID 로 잡는 것을 권한다(URL 이 바뀌어도 유지된다)
	 * @param {*} defaultValue - 없을 때 돌려줄 값
	 */
	utils.pref.get = function(key, defaultValue) {
		var v = _load(key);
		return (v === null || v === undefined) ? defaultValue : v;
	};

	/** 설정 쓰기. 같은 키로 연달아 부르면 마지막 값만 저장된다. */
	utils.pref.set = function(key, value) {
		var v = (value === null || value === undefined) ? null : String(value);
		if (v !== null && v.length > MAX_LEN) {
			v = v.substring(0, MAX_LEN);   // 넘치면 잘라서 저장 자체가 실패하지 않게 한다
		}

		clearTimeout(_timers[key]);
		_timers[key] = setTimeout(function() { _save(key, v); }, SAVE_DELAY);
	};

	/** 설정 지우기 */
	utils.pref.remove = function(key) {
		clearTimeout(_timers[key]);
		_save(key, null);
	};

	/** 참/거짓 설정 편의 함수 */
	utils.pref.getBool = function(key, defaultValue) {
		var v = _load(key);
		if (v === null || v === undefined) return !!defaultValue;
		return v === '1' || v === 'Y' || v === 'true';
	};

	utils.pref.setBool = function(key, on) {
		utils.pref.set(key, on ? '1' : '0');
	};

})(window.biz = window.biz || {});


(function(utils) {

	utils.ui = utils.ui || {};
	utils.ui.selfFilter = utils.ui.selfFilter || {};

	/**
	 * 조회 화면에 「본인 기준 조회」 체크박스를 단다.
	 *
	 * @param {object} options
	 *   @param {string} options.key       설정 키. 모듈 ID 를 권한다 (예: 'MDL_COM001')
	 *   @param {string} options.form      selfOnly 값을 실어 보낼 검색 폼 선택자
	 *   @param {string} [options.actions] 체크박스를 넣을 영역. 기본은 '.filter-actions-v2'
	 *   @param {function} [options.onChange] 체크 상태가 바뀐 뒤 호출(대개 목록 재조회)
	 *   @returns {boolean} 현재 체크 여부
	 */
	utils.ui.selfFilter.init = function(options) {
		options = options || {};

		var $form = $(options.form);
		if (!$form.length) return false;

		var $actions = $(options.actions || $form.siblings('.filter-actions-v2'));
		if (!$actions.length) $actions = $form.parent().find('.filter-actions-v2');

		var prefKey = 'selfOnly.' + (options.key || (location.pathname || 'screen'));

		// 폼에 실어 보낼 값. 서버는 이 값이 'Y' 일 때만 본인 기준으로 거른다.
		var $hidden = $form.find('input[name="selfOnly"]');
		if (!$hidden.length) {
			$hidden = $('<input type="hidden" name="selfOnly">').appendTo($form);
		}

		// 체크박스가 이미 있으면 다시 만들지 않는다(화면 재진입 대비)
		var $label = $actions.find('.self-only');
		if (!$label.length) {
			$label = $('<label class="self-only"></label>')
				.append($('<input type="checkbox">'))
				.append($('<span>').text(biz.lang.text('L.본인기준조회', '본인 기준 조회')));
			$actions.prepend($label);
		}

		var $chk = $label.find('input[type="checkbox"]');

		function apply(on, notify) {
			$hidden.val(on ? 'Y' : '');
			$label.toggleClass('on', on);
			biz.pref.setBool(prefKey, on);
			if (notify && typeof options.onChange === 'function') options.onChange(on);
		}

		var saved = biz.pref.getBool(prefKey, false);
		$chk.prop('checked', saved);
		apply(saved, false);

		$chk.off('change.selfFilter').on('change.selfFilter', function() {
			apply($(this).is(':checked'), true);
		});

		return saved;
	};

	/** 초기화 버튼 등에서 체크를 풀 때 쓴다. */
	utils.ui.selfFilter.clear = function(options) {
		options = options || {};
		var $form = $(options.form);
		$form.find('input[name="selfOnly"]').val('');
		$('.self-only').removeClass('on').find('input[type="checkbox"]').prop('checked', false);
		biz.pref.setBool('selfOnly.' + (options.key || (location.pathname || 'screen')), false);
	};

})(window.biz = window.biz || {});
