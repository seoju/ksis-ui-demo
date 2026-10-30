// =====================================================================
//  KSIS 공통 : 여러 개 고르는 드롭다운   [비교표 50번]
//
//  <select class="k-multi" name="itemGrp" multiple style="width:260px">
//     <option value="G01">ECU(가솔린)</option> …
//  </select>
//  - 닫힌 상자는 40번 드롭다운(ksis-select.js)과 같은 모양 · 높이. 고른 것은 상자 안 한 줄 칩(주색 연한 바탕),
//    한 줄에 안 들어가는 만큼은 "+N" 으로 줄인다(마우스를 올리면 고른 것 전부가 보임). 칩의 × 는 그것만 뺀다.
//    첫 칩도 다 안 보이는 좁은 칸(검색줄 118px)은 칩 모양 없이 글자 + "+N"(예 : ECU(가솔… +2).
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
//      어디서나   Enter 확인 · Esc 취소 · Tab 은 찾기 칸 → 목록 → [취소] → [확인] 을 돈다
//  ksis.multi.enhance(root) · ksis.multi.values(select) · ksis.multi.setValues(select, [값…]) · ksis.multi.setSingle(select, on)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var openInst = null;
	var seq = 0;
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
				c.appendChild(el("span", "k-ms-chip-text", o.text));
				var x = el("span", "k-ms-x", "×");
				x.setAttribute("aria-hidden", "true");
				x.dataset.value = o.value;
				c.appendChild(x);
				chips.appendChild(c);
			});
			fit();
		}
		// 한 줄에 안 들어가는 칩은 뒤에서부터 감추고 "+감춘 개수".
		// 첫 칩조차 다 안 보이면(검색줄 118px 등 좁은 칸) 칩 모양을 빼고 글자만(is-compact) — 글자가 더 많이 보인다. 그래도 길면 말줄임(…)
		function fit() {
			var c = chips.children;
			box.classList.remove("is-compact");
			if (single || !c.length || chips.clientWidth === 0) return;
			var hiddenN = 0;
			for (var i = 0; i < c.length; i++) c[i].hidden = false;
			more.hidden = true;
			if (chips.scrollWidth <= chips.clientWidth) return;
			more.hidden = false;
			for (var k = c.length - 1; k > 0; k--) {
				c[k].hidden = true;
				more.textContent = "+" + (++hiddenN);
				if (chips.scrollWidth <= chips.clientWidth) break;
			}
			if (hiddenN === 0) more.hidden = true;
			var t = c[0].firstChild;
			if (t.scrollWidth > t.clientWidth) box.classList.add("is-compact");
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
		function ok() { close(true); box.focus(); }
		function cancel() { close(false); box.focus(); }

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
			if (wrap.classList.contains("open")) ok(); else open();
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
			var stops = single ? [search, list] : [search, list, btnCancel, btnOk];
			var i = stops.indexOf(document.activeElement);
			e.preventDefault();
			stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
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
