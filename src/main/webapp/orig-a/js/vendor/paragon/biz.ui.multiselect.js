/**
 * biz.ui.multiselect.js - 다중 선택 드롭박스
 * Copyright 2026 Vertexid
 *
 * ------------------------------------------------------------------
 * 전체 공통 요청사항 두 가지를 한 위젯으로 만족시킨다.
 *   · 「모든 다수 선택은 체크박스 도입 — 엑셀 피벗 벤치마킹」
 *   · 「드롭박스도 뜨면서 텍스트 타이핑해서 검색도 되도록」
 *
 * 생김새
 *   ┌───────────────────────────────────────────┐
 *   │ [고른 항목 ×] [고른 항목 ×]              ▼ │  선택 칩
 *   ├───────────────────────────────────────────┤
 *   │ 이름을 쳐서 찾기                           │  검색
 *   │ ☐ 전체 선택                      3개 선택  │
 *   │ ☑ 항목                            (스크롤) │  체크박스 목록
 *   └───────────────────────────────────────────┘
 *
 * 쓰는 법
 *   var ms = biz.ui.multiSelect('#itemGrp', {
 *       url: biz.getUrl('/ksis/com/…/getItemGroupList'),
 *       valueField: 'itemGrpCd',
 *       textField:  'itemGrpNm',
 *       single: false,                       // true 면 하나만 고른다
 *       onChange: function(list) { … }       // [{ value, text }]
 *   });
 *   ms.getValues();        // ['MGRP…', …]
 *   ms.setValues([{ value: 'MGRP…', text: '품목군명' }]);
 *   ms.setSingle(true);    // 단일/다중 전환. 다중→단일이면 첫 건만 남는다
 *   ms.reload();           // 목록 다시 읽기 (품목군을 새로 만든 뒤 등)
 *
 * 표시값은 DB 에서 온 문자열이라 전부 .text() 로 넣는다(개발 규칙 1-3).
 * 폐쇄망이라 외부 라이브러리를 쓰지 않는다. jQuery 만으로 만든다.
 * ------------------------------------------------------------------
 */
(function(utils) {

	utils.ui = utils.ui || {};

	var _seq = 0;

	function _ensureStyle() {
		if (document.getElementById('biz-multiselect-style')) return;

		var css = ''
			+ '.biz-ms{position:relative;font-size:13px;}'
			+ '.biz-ms-box{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-height:38px;'
			+ 'padding:5px 28px 5px 8px;border:1px solid #ccd1d9;border-radius:3px;background:#fff;cursor:pointer;}'
			+ '.biz-ms.is-open .biz-ms-box{border-color:#0082c7;}'
			+ '.biz-ms-box:after{content:"";position:absolute;right:11px;top:16px;width:7px;height:7px;'
			+ 'border-right:1.5px solid #a1a1aa;border-bottom:1.5px solid #a1a1aa;transform:rotate(45deg);pointer-events:none;}'
			+ '.biz-ms-ph{color:#a1a1aa;}'
			+ '.biz-ms-chip{display:inline-flex;align-items:center;gap:5px;background:#eef4ff;border:1px solid #cfd8ec;'
			+ 'border-radius:12px;padding:2px 6px 2px 9px;font-size:12px;color:#1c4fc7;max-width:100%;}'
			+ '.biz-ms-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
			+ '.biz-ms-chip button{border:0;background:none;color:#8aa0c8;cursor:pointer;font-size:13px;line-height:1;padding:0 1px;}'
			+ '.biz-ms-chip button:hover{color:#c0392b;}'
			+ '.biz-ms-panel{position:absolute;left:0;right:0;top:100%;z-index:1200;margin-top:3px;background:#fff;'
			+ 'border:1px solid #ccd1d9;border-radius:3px;box-shadow:0 4px 12px rgba(0,0,0,.12);display:none;}'
			+ '.biz-ms.is-open .biz-ms-panel{display:block;}'
			+ '.biz-ms-search{width:100%;border:0;border-bottom:1px solid #eceff3;padding:9px 10px;font-size:13px;'
			+ 'font-family:inherit;outline:none;}'
			+ '.biz-ms-cnt{margin-left:auto;font-size:12px;color:#888;font-weight:normal;}'
			+ '.biz-ms-list{max-height:210px;overflow-y:auto;}'
			+ '.biz-ms-item{display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;}'
			+ '.biz-ms-item:hover{background:#f5f8ff;}'
			+ '.biz-ms-item input{cursor:pointer;}'
			+ '.biz-ms-item.is-all{border-bottom:1px solid #eceff3;font-weight:600;}'
			+ '.biz-ms-empty{padding:14px 10px;color:#999;text-align:center;}';

		$('<style id="biz-multiselect-style">').text(css).appendTo('head');
	}

	/**
	 * @param {string|jQuery} selector 위젯을 넣을 자리
	 * @param {Object} options
	 */
	utils.ui.multiSelect = function(selector, options) {

		var settings = $.extend({
			url: '',
			params: {},
			valueField: 'cd',
			textField: 'nm',
			single: false,
			placeholder: '선택',
			searchPlaceholder: '이름을 쳐서 찾기',
			selectAllText: '전체 선택',
			countSuffix: '개 선택',
			emptyText: '항목이 없습니다.',
			onChange: null
		}, options || {});

		var $host = (typeof selector === 'string') ? $(selector) : selector;
		if (!$host.length) {
			console.error('biz.ui.multiSelect: 선택자에 맞는 요소를 찾을 수 없습니다.', selector);
			return null;
		}

		_ensureStyle();

		var id = 'bizMs' + (++_seq);
		var items = [];    // [{ value, text }] 서버에서 읽은 전체 목록
		var picked = [];   // [{ value, text }] 고른 것
		var loaded = false;

		// ---------- 화면 ----------
		var $root = $('<div class="biz-ms">').attr('id', id);
		var $box = $('<div class="biz-ms-box">');
		var $panel = $('<div class="biz-ms-panel">');
		var $search = $('<input type="text" class="biz-ms-search">').attr('placeholder', settings.searchPlaceholder);
		var $list = $('<div class="biz-ms-list">');

		$panel.append($search).append($list);
		$root.append($box).append($panel);
		$host.empty().append($root);

		// ---------- 그리기 ----------
		function renderBox() {
			$box.empty();

			if (picked.length === 0) {
				$box.append($('<span class="biz-ms-ph">').text(settings.placeholder));
				return;
			}

			picked.forEach(function(p) {
				$('<span class="biz-ms-chip">')
					.append($('<span>').text(p.text))
					.append($('<button type="button">').attr('data-v', p.value).text('×'))
					.appendTo($box);
			});
		}

		function renderList() {
			var kw = ($search.val() || '').trim().toUpperCase();
			var shown = items.filter(function(it) {
				return kw === '' || String(it.text).toUpperCase().indexOf(kw) >= 0;
			});

			$list.empty();

			if (shown.length === 0) {
				$list.append($('<div class="biz-ms-empty">').text(settings.emptyText));
			} else {
				// 「전체 선택」 줄은 다중일 때만 의미가 있다
				if (!settings.single) {
					var allOn = shown.every(function(it) { return isPicked(it.value); });
					$('<label class="biz-ms-item is-all">')
						.append($('<input type="checkbox" class="biz-ms-all">').prop('checked', allOn))
						.append($('<span>').text(settings.selectAllText))
						.append($('<span class="biz-ms-cnt">').text(picked.length + settings.countSuffix))
						.appendTo($list);
				}

				shown.forEach(function(it) {
					$('<label class="biz-ms-item">')
						.append($('<input type="' + (settings.single ? 'radio' : 'checkbox') + '" class="biz-ms-chk">')
							.attr('data-v', it.value)
							.prop('checked', isPicked(it.value)))
						.append($('<span>').text(it.text))
						.appendTo($list);
				});
			}

		}

		function render() {
			renderBox();
			renderList();
		}

		function isPicked(v) {
			return picked.some(function(p) { return p.value === v; });
		}

		function fire() {
			if (typeof settings.onChange === 'function') {
				settings.onChange(picked.slice());
			}
		}

		// ---------- 선택 ----------
		function pick(v) {
			var it = items.filter(function(x) { return x.value === v; })[0];
			if (!it) return;

			if (settings.single) {
				picked = [{ value: it.value, text: it.text }];
			} else if (!isPicked(v)) {
				picked.push({ value: it.value, text: it.text });
			}
			render();
			fire();
		}

		function unpick(v) {
			picked = picked.filter(function(p) { return p.value !== v; });
			render();
			fire();
		}

		// ---------- 목록 읽기 ----------
		function load(cb) {
			if (!settings.url) { loaded = true; if (cb) cb(); return; }

			biz.ajax.request({
				url: settings.url,
				type: 'GET',
				param: settings.params,
				callback: function(response) {
					var rows = (response && response.data) ? response.data
					         : (Array.isArray(response) ? response : []);

					items = rows.map(function(r) {
						return { value: r[settings.valueField], text: r[settings.textField] };
					}).filter(function(x) { return x.value; });

					loaded = true;
					render();
					if (cb) cb();
				},
				errorCallback: function() {
					items = [];
					loaded = true;
					render();
					if (cb) cb();
				}
			});
		}

		// ---------- 이벤트 ----------
		$box.on('click', function(e) {
			// 칩의 × 는 펼치지 않고 그 항목만 뺀다
			var $btn = $(e.target).closest('button');
			if ($btn.length) {
				e.stopPropagation();
				unpick($btn.attr('data-v'));
				return;
			}
			toggle();
		});

		$search.on('input', renderList);

		$list.on('change', '.biz-ms-chk', function() {
			var v = $(this).attr('data-v');
			if ($(this).is(':checked')) pick(v);
			else unpick(v);
		});

		$list.on('change', '.biz-ms-all', function() {
			var on = $(this).is(':checked');
			var kw = ($search.val() || '').trim().toUpperCase();
			var shown = items.filter(function(it) {
				return kw === '' || String(it.text).toUpperCase().indexOf(kw) >= 0;
			});

			shown.forEach(function(it) {
				if (on && !isPicked(it.value)) picked.push({ value: it.value, text: it.text });
				if (!on) picked = picked.filter(function(p) { return p.value !== it.value; });
			});
			render();
			fire();
		});

		// 바깥을 누르면 닫는다. 위젯마다 네임스페이스를 달아 서로 간섭하지 않게 한다.
		// 안쪽 클릭은 여기서 걸러 낸다. 전파를 막는 방식은 부모 화면의 버튼 처리와 얽혀 빠뜨리기 쉽다.
		$(document).on('click.' + id, function(e) {
			if ($(e.target).closest('#' + id).length) return;
			close();
		});

		function open() {
			if (!loaded) load();
			$root.addClass('is-open');
			$search.val('');
			renderList();
			setTimeout(function() { $search.focus(); }, 0);
		}
		function close() { $root.removeClass('is-open'); }
		function toggle() { $root.hasClass('is-open') ? close() : open(); }

		// ---------- 공개 ----------
		var api = {
			getValues: function() {
				return picked.map(function(p) { return p.value; });
			},
			getItems: function() {
				return picked.slice();
			},
			/** @param {Array} list [{value,text}] 또는 ['코드', …] */
			setValues: function(list) {
				picked = (list || []).map(function(v) {
					if (v && typeof v === 'object') return { value: v.value, text: v.text || v.value };
					var it = items.filter(function(x) { return x.value === v; })[0];
					return { value: v, text: it ? it.text : v };
				}).filter(function(p) { return p.value; });

				if (settings.single && picked.length > 1) picked = picked.slice(0, 1);
				render();
			},
			/** 단일/다중 전환. 다중 → 단일이면 첫 건만 남는다. */
			setSingle: function(on) {
				settings.single = !!on;
				if (settings.single && picked.length > 1) {
					picked = picked.slice(0, 1);
					fire();
				}
				render();
			},
			isSingle: function() { return !!settings.single; },
			reload: function(cb) { loaded = false; load(cb); },
			clear: function() { picked = []; render(); fire(); },
			destroy: function() {
				$(document).off('click.' + id);
				$host.empty();
			}
		};

		render();
		load();

		return api;
	};

})(biz);
