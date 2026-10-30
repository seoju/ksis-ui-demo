// =====================================================================
//  KSIS 공통 : 여러 개 고르는 드롭다운   [비교표 50번]
//
//  <select class="k-multi" name="itemGrp" multiple style="width:260px">
//     <option value="G01">ECU(가솔린)</option> …
//  </select>
//  - 닫힌 상자는 40번 드롭다운(ksis-select.js)과 같은 모양 · 높이. 고른 것은 상자 안 한 줄 칩(주색 연한 바탕) + ×(그것만 뺌).
//    칸이 모자라면 짧은 이름은 그대로 두고 긴 이름부터 줄여(…) 한 칸에 다 넣는다. 칩마다 앞 2글자까지는 보이게 하고,
//    그래도 안 들어가면(너무 많이 고름) 뒤에서부터 감추고 "+감춘 개수". 마우스를 올리면 고른 것 전부가 보인다.
//  - 펼친 상자 : 찾기 칸(돋보기, 회색 안내 글 없음) · 전체 선택 · 체크 목록 · "N개 선택" [취소] [확인].
//    줄 높이 = 닫힌 상자 높이, 마우스 올린 줄(키보드로 옮긴 줄) = 주색 + 흰 글자(40번과 같음).
//  - 엑셀 자동 필터 목록처럼 [확인](Enter)을 눌러야 반영되고 [취소](Esc)는 펼치기 전으로 되돌린다.
//    바깥을 누르면 [확인]과 같다(KSIS-A 원래 부품처럼 고른 것이 남는다).
//  - data-single 이면 하나만 고른다(동그라미, 고르면 바로 닫힘). ksis.multi.setSingle(select, true|false) 로 바꾼다.
//    여러 개 → 하나로 바꾸면 첫 건만 남는다(KSIS-A 출장보고 안건 : 업무 분류가 수주면 품목군 1개, 가격 · 개발이면 여러 개).
//  - 원래 <select multiple> 은 숨겨 둔 채 고른 값을 그대로 가진다(폼 전송 · 기존 change 처리 그대로). 반영되면 change 이벤트.
//  - 키보드(엑셀 자동 필터 목록 벤치마킹) :
//      닫힌 상자  Alt+↓ · ↓ · Enter · Space 펼침(커서는 찾기 칸)
//      찾기 칸    글자 = 찾기, ↓ = 목록 첫 줄(전체 선택)로
//      목록       ↑↓ 한 줄, Home · End 처음 · 끝, PageUp · PageDown 한 화면, Space 체크 켜기/끄기(전체 선택 줄 = 보이는 것 모두),
//                 첫 줄에서 ↑ = 찾기 칸, 글자를 치면 찾기 칸으로 가서 이어 씀
//      어디서나   Enter · Tab = 확인하고 다음 칸으로(Shift+Tab 은 앞 칸), Esc = 취소(닫힌 상자로)
//  - [확인]을 눌러도 다음 칸으로 간다. [취소] · Esc 는 닫힌 상자로 돌아온다.
//  ksis.multi.enhance(root) · ksis.multi.values(select) · ksis.multi.setValues(select, [값…]) · ksis.multi.setSingle(select, on)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var openInst = null;
	var seq = 0;
	var ruler = document.createElement("canvas").getContext("2d");
	function textW(text, font) { ruler.font = font; return ruler.measureText(text).width; }
	var TABBABLE = "a[href], button, input, select, textarea, [tabindex]";
	var FIND_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">'
		+ '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';

	function el(tag, cls, text) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (text != null) e.textContent = text;
		return e;
	}

	function build(select) {
		if (select.dataset.kMulti) return;
		select.dataset.kMulti = "1";
		select.multiple = true;
		var uid = "kms" + (++seq);

		var wrap = el("div", "k-select-wrap k-ms");
		if (select.style.width) { wrap.style.width = select.style.width; select.style.width = ""; }
		select.parentNode.insertBefore(wrap, select);
		wrap.appendChild(select);

		var box = el("div", "k-select-box k-ms-box");
		box.tabIndex = 0;
		box.setAttribute("role", "combobox");
		box.setAttribute("aria-haspopup", "listbox");
		box.setAttribute("aria-expanded", "false");
		var chips = el("span", "k-ms-chips");
		var more = el("span", "k-ms-more");
		box.appendChild(chips);
		box.appendChild(more);
		wrap.appendChild(box);

		var panel = el("div", "k-ms-panel");
		panel.hidden = true;
		var find = el("label", "k-ms-find");
		find.innerHTML = FIND_ICON;
		var search = el("input", "k-ms-search");
		search.type = "text";
		search.autocomplete = "off";
		search.setAttribute("aria-label", "찾기");
		find.appendChild(search);
		var list = el("ul", "k-ms-list");
		list.id = uid + "-list";
		list.tabIndex = 0;
		list.setAttribute("role", "listbox");
		var foot = el("div", "k-ms-foot");
		var cnt = el("span", "k-ms-cnt");
		var btnCancel = el("button", "k-btn k-btn-ghost", "취소");
		var btnOk = el("button", "k-btn k-btn-primary", "확인");
		btnCancel.type = btnOk.type = "button";
		foot.appendChild(cnt);
		foot.appendChild(btnCancel);
		foot.appendChild(btnOk);
		panel.appendChild(find);
		panel.appendChild(list);
		panel.appendChild(foot);
		wrap.appendChild(panel);
		box.setAttribute("aria-controls", list.id);

		var single = select.hasAttribute("data-single");
		var edit = null;   // 펼친 동안 고친 값 { 값: true } — [확인] 전까지 select 에 넣지 않는다
		var rows = [];     // 지금 보이는 줄 [{ li, value }] (value === null 이면 전체 선택 줄)
		var active = -1;   // 키보드로 옮긴 줄

		function options() { return Array.prototype.slice.call(select.options); }
		function picked() { return options().filter(function (o) { return o.selected; }); }

		// ---------- 닫힌 상자 ----------
		function paint() {
			var sel = picked();
			wrap.classList.toggle("is-single", single);
			box.title = sel.map(function (o) { return o.text; }).join(", ");
			chips.innerHTML = "";
			more.hidden = true;
			if (single) { chips.textContent = sel.length ? sel[0].text : ""; return; }
			sel.forEach(function (o) {
				var c = el("span", "k-ms-chip");
				var t = el("span", "k-ms-chip-text", o.text);
				t.dataset.full = o.text;
				c.appendChild(t);
				var x = el("span", "k-ms-x", "×");
				x.setAttribute("aria-hidden", "true");
				x.dataset.value = o.value;
				c.appendChild(x);
				chips.appendChild(c);
			});
			fit();
		}
		// 칩 줄이기 : 칸 안 글자 자리를 칩들에 나눠 준다. 짧은 이름은 그대로, 긴 이름만 같은 길이까지 깎는다(…).
		// 칩마다 앞 2글자 자리는 남기고, 그것도 모자라면 뒤에서부터 감추고 "+감춘 개수"
		function fit() {
			var c = Array.prototype.slice.call(chips.children);
			if (single || !c.length || box.clientWidth === 0) return;
			var bs = getComputedStyle(box), cs = getComputedStyle(chips);
			var ts = getComputedStyle(c[0].firstChild), xs = getComputedStyle(c[0].lastChild), ks = getComputedStyle(c[0]);
			var px = function (v) { return parseFloat(v) || 0; };
			var inner = box.clientWidth - px(bs.paddingLeft) - px(bs.paddingRight);
			var boxGap = px(bs.columnGap), gap = px(cs.columnGap);
			var chrome = px(ks.paddingLeft) + px(ks.paddingRight) + px(ks.borderLeftWidth) + px(ks.borderRightWidth) + px(xs.width) + px(xs.marginLeft) + px(xs.marginRight);
			var font = ts.fontStyle + " " + ts.fontWeight + " " + ts.fontSize + " " + ts.fontFamily;
			var moreFont = getComputedStyle(more).fontWeight + " " + getComputedStyle(more).fontSize + " " + ts.fontFamily;
			var texts = c.map(function (x) { return x.firstChild.dataset.full; });
			var nat = texts.map(function (t) { return textW(t, font); });
			var min = texts.map(function (t, i) { return Math.min(nat[i], textW(Array.from(t).slice(0, 2).join(""), font)); });
			// 몇 개까지 넣을 수 있나(앞 2글자 기준)
			var room = function (k) { return inner - (k < c.length ? textW("+" + (c.length - k), moreFont) + boxGap : 0); };
			var k = c.length;
			for (; k > 1; k--) {
				var need = (k - 1) * gap;
				for (var i = 0; i < k; i++) need += chrome + min[i];
				if (need <= room(k)) break;
			}
			var space = room(k) - (k - 1) * gap - k * chrome;   // 글자에 쓸 수 있는 자리
			// 같은 길이 cap 을 찾는다 : 각 칩 글자 = max(앞 2글자, min(원래 길이, cap)), 합이 space 안
			var lo = 0, hi = Math.max.apply(null, nat.slice(0, k));
			var sum = function (cap) { var t = 0; for (var i = 0; i < k; i++) t += Math.max(min[i], Math.min(nat[i], cap)); return t; };
			if (sum(hi) > space) { for (var n = 0; n < 20; n++) { var mid = (lo + hi) / 2; if (sum(mid) > space) hi = mid; else lo = mid; } } else lo = hi;
			// 상한대로 깎은 글자 → 실제 글자 폭. 깎다가 남은 자리는 다시 나눠 준다(빈칸 없이) :
			// 먼저 조금만 더 주면 이름이 다 보이는 칩부터(덜 드는 순), 남으면 앞 칩부터 더 길게
			var shown = [], used = [], left = space;
			for (var j = 0; j < k; j++) {
				var w = Math.max(min[j], Math.min(nat[j], lo));
				shown[j] = nat[j] <= w + 0.01 ? texts[j] : cut(texts[j], w, font);
				used[j] = Math.ceil(textW(shown[j], font));
				left -= used[j];
			}
			var order = [];
			for (j = 0; j < k; j++) if (shown[j] !== texts[j]) order.push(j);
			order.sort(function (a, b) { return (nat[a] - used[a]) - (nat[b] - used[b]); });
			order.forEach(function (i) {
				var full = Math.ceil(nat[i]);
				if (full - used[i] <= left) { left -= full - used[i]; used[i] = full; shown[i] = texts[i]; }
			});
			for (j = 0; j < k && left > 0; j++) {
				if (shown[j] === texts[j]) continue;
				var room2 = used[j] + left;
				var t2 = Math.ceil(nat[j]) <= room2 ? texts[j] : cut(texts[j], room2, font);
				var w2 = Math.ceil(textW(t2, font));
				if (w2 > used[j]) { left -= w2 - used[j]; used[j] = w2; shown[j] = t2; }
			}
			c.forEach(function (chip, i) {
				var t = chip.firstChild;
				chip.hidden = i >= k;
				if (i >= k) return;
				t.style.width = used[i] + "px";
				t.textContent = shown[i];
			});
			more.hidden = k === c.length;
			more.textContent = k < c.length ? "+" + (c.length - k) : "";
		}
		// w 안에 들어가는 가장 긴 앞부분 + "…". 앞 2글자 + "…" 도 안 들어가면 앞 2글자만
		function cut(text, w, font) {
			var ch = Array.from(text);
			for (var n = ch.length - 1; n >= 2; n--) {
				var s = ch.slice(0, n).join("") + "…";
				if (textW(s, font) <= w) return s;
			}
			return ch.slice(0, 2).join("");
		}

		// ---------- 펼친 상자 ----------
		function shown() {
			var kw = search.value.trim().toUpperCase();
			return options().filter(function (o) { return !kw || o.text.toUpperCase().indexOf(kw) >= 0; });
		}
		function addRow(value, text) {
			var idx = rows.length;
			var li = el("li", value === null ? "k-ms-all" : "");
			li.id = uid + "-" + idx;
			li.setAttribute("role", "option");
			li.appendChild(el("span", single ? "k-ms-radio" : "k-ms-chk"));
			li.appendChild(el("span", "k-ms-text", text));
			li.addEventListener("mouseenter", function () { setActive(idx, false); });
			li.addEventListener("mousedown", function (e) {
				e.preventDefault();
				list.focus();
				setActive(idx, false);
				toggle(idx);
			});
			list.appendChild(li);
			rows.push({ li: li, value: value });
		}
		function renderList() {
			list.innerHTML = "";
			rows = [];
			var s = shown();
			if (!single && s.length) addRow(null, "전체 선택");
			s.forEach(function (o) { addRow(o.value, o.text); });
			if (!s.length) list.appendChild(el("li", "k-ms-empty", "찾는 항목이 없습니다"));
			sync();
			setActive(Math.min(active, rows.length - 1), false);
		}
		// 체크 모양 · 전체 선택(일부만 고르면 네모) · 개수
		function sync() {
			var vis = rows.filter(function (r) { return r.value !== null; });
			var on = vis.filter(function (r) { return edit[r.value]; }).length;
			rows.forEach(function (r) {
				var checked = r.value === null ? (on > 0 && on === vis.length) : !!edit[r.value];
				r.li.classList.toggle("checked", checked);
				r.li.classList.toggle("partial", r.value === null && on > 0 && on < vis.length);
				r.li.setAttribute("aria-selected", checked ? "true" : "false");
			});
			cnt.textContent = options().filter(function (o) { return edit[o.value]; }).length + "개 선택";
		}
		function setActive(i, scroll) {
			active = rows.length ? Math.max(-1, Math.min(rows.length - 1, i)) : -1;
			rows.forEach(function (r, k) { r.li.classList.toggle("hover", k === active); });
			if (active < 0) { list.removeAttribute("aria-activedescendant"); return; }
			list.setAttribute("aria-activedescendant", rows[active].li.id);
			if (scroll !== false) rows[active].li.scrollIntoView({ block: "nearest" });
		}
		function selectedRow() {
			for (var i = 0; i < rows.length; i++) if (rows[i].value !== null && edit[rows[i].value]) return i;
			return 0;
		}
		function toggle(idx) {
			var r = rows[idx];
			if (!r) return;
			if (single) { edit = {}; edit[r.value] = true; close(true); box.focus(); return; }
			if (r.value === null) {
				var vis = rows.filter(function (x) { return x.value !== null; });
				var all = vis.every(function (x) { return edit[x.value]; });
				vis.forEach(function (x) { edit[x.value] = !all; });
			} else {
				edit[r.value] = !edit[r.value];
			}
			sync();
		}

		function open() {
			if (openInst && openInst !== inst) openInst.close(true);
			edit = {};
			picked().forEach(function (o) { edit[o.value] = true; });
			search.value = "";
			panel.style.setProperty("--k-opt-h", box.offsetHeight + "px"); // 줄 높이 = 닫힌 상자 높이(40번)
			foot.hidden = single;
			active = -1;
			renderList();
			panel.hidden = false;
			wrap.classList.add("open");
			box.setAttribute("aria-expanded", "true");
			openInst = inst;
			search.focus({ preventScroll: true });
		}
		function close(apply) {
			if (openInst !== inst) return;
			var changed = false;
			if (apply) {
				options().forEach(function (o) {
					var on = !!edit[o.value];
					if (o.selected !== on) { o.selected = on; changed = true; }
				});
			}
			panel.hidden = true;
			wrap.classList.remove("open");
			box.setAttribute("aria-expanded", "false");
			openInst = null;
			edit = null;
			paint();
			if (changed) select.dispatchEvent(new Event("change", { bubbles: true }));
		}
		// 화면에서 이 상자 다음(dir = 1) · 앞(dir = -1) 칸으로 커서를 옮긴다
		function moveFocus(dir) {
			var all = Array.prototype.filter.call(document.querySelectorAll(TABBABLE), function (x) {
				return x.tabIndex >= 0 && !x.disabled && x.getClientRects().length > 0 && !panel.contains(x);
			});
			var next = all[all.indexOf(box) + dir];
			(next || box).focus();
		}
		function ok() { close(true); moveFocus(1); }       // [확인] · Enter : 반영하고 다음 칸으로
		function cancel() { close(false); box.focus(); }   // [취소] · Esc : 되돌리고 닫힌 상자로

		// ---------- 마우스 ----------
		box.addEventListener("click", function (e) {
			var x = e.target.closest(".k-ms-x");
			if (x) {   // 칩의 × : 펼치지 않고 그것만 뺀다
				close(true);
				options().forEach(function (o) { if (o.value === x.dataset.value) o.selected = false; });
				paint();
				select.dispatchEvent(new Event("change", { bubbles: true }));
				box.focus();
				return;
			}
			if (wrap.classList.contains("open")) { close(true); box.focus(); } else open();
		});
		// 펼친 상자 안 빈 곳을 눌러도 커서가 찾기 칸 · 목록에서 빠지지 않게(빠지면 키보드가 멈춤)
		panel.addEventListener("mousedown", function (e) {
			if (e.target !== list && !e.target.closest("input, button")) e.preventDefault();
		});
		btnCancel.addEventListener("click", cancel);
		btnOk.addEventListener("click", ok);
		search.addEventListener("input", function () { active = -1; renderList(); });

		// ---------- 키보드 ----------
		box.addEventListener("keydown", function (e) {
			if (wrap.classList.contains("open")) return;
			if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
		});
		search.addEventListener("keydown", function (e) {
			if (e.isComposing || e.keyCode === 229) return; // 한글을 조합하는 중이면 IME 에 맡김
			if (e.key === "ArrowDown") {
				e.preventDefault();
				list.focus();
				setActive(single ? selectedRow() : 0);
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (!single) ok();
				else if (active >= 0) toggle(active);
				else if (search.value.trim() && rows.length) toggle(0);
				else cancel();
			}
		});
		list.addEventListener("focus", function () { if (active < 0 && rows.length) setActive(single ? selectedRow() : 0); });
		list.addEventListener("keydown", function (e) {
			var k = e.key;
			if (k === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
			else if (k === "ArrowUp") {
				e.preventDefault();
				if (active <= 0) { setActive(-1); search.focus(); } else setActive(active - 1);
			}
			else if (k === "Home") { e.preventDefault(); setActive(0); }
			else if (k === "End") { e.preventDefault(); setActive(rows.length - 1); }
			else if (k === "PageDown" || k === "PageUp") {
				e.preventDefault();
				var h = rows.length ? rows[0].li.offsetHeight : 30;
				var page = Math.max(1, Math.floor(list.clientHeight / h) - 1);
				setActive(Math.max(0, active + (k === "PageDown" ? page : -page)));
			}
			else if (k === " ") { e.preventDefault(); if (active >= 0) toggle(active); }
			else if (k === "Enter") { e.preventDefault(); if (!single) ok(); else if (active >= 0) toggle(active); }
			else if (k.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) search.focus(); // 친 글자는 찾기 칸에 들어감
		});
		panel.addEventListener("keydown", function (e) {
			if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cancel(); return; }
			if (e.key !== "Tab") return;
			e.preventDefault();          // Tab = 확인하고 다음 칸, Shift+Tab = 확인하고 앞 칸
			close(true);
			moveFocus(e.shiftKey ? -1 : 1);
		});

		var inst = {
			wrap: wrap,
			close: close,
			paint: paint,
			setSingle: function (on) {
				close(true);
				single = !!on;
				var sel = picked(), changed = false;
				if (single && sel.length > 1) { sel.slice(1).forEach(function (o) { o.selected = false; }); changed = true; }
				paint();
				if (changed) select.dispatchEvent(new Event("change", { bubbles: true }));
			}
		};
		select._kMulti = inst;
		select.addEventListener("change", function () { if (!edit) paint(); });
		if (window.ResizeObserver) new ResizeObserver(fit).observe(wrap);
		paint();
	}

	document.addEventListener("mousedown", function (e) {
		if (openInst && !openInst.wrap.contains(e.target)) openInst.close(true); // 바깥을 누르면 [확인]과 같음
	});

	ksis.multi = {
		enhance: function (root) {
			Array.prototype.forEach.call((root || document).querySelectorAll("select.k-multi"), build);
		},
		values: function (select) {
			return Array.prototype.filter.call(select.options, function (o) { return o.selected; }).map(function (o) { return o.value; });
		},
		setValues: function (select, values) {
			var set = {};
			(values || []).forEach(function (v) { set[v] = true; });
			Array.prototype.forEach.call(select.options, function (o) { o.selected = !!set[o.value]; });
			if (select._kMulti) select._kMulti.paint();
		},
		setSingle: function (select, on) {
			if (select._kMulti) select._kMulti.setSingle(on);
			else if (on) select.setAttribute("data-single", ""); else select.removeAttribute("data-single");
		}
	};
})(window, document);
