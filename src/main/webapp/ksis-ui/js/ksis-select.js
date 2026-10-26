// =====================================================================
//  KSIS 공통 : 드롭다운(1개 고르는 상자)   [비교표 40번]
//
//  <select class="k-select" name="..." data-placeholder="고객사 선택" style="width:160px">
//     <option value="HMC">현대자동차</option> …
//  </select>
//  - 닫힌 상자는 KSIS-B 와 같은 모양, 펼친 목록은 직접 그린 부품(모서리 둥글게 · 그림자, A .custom-autocomplete 참조).
//  - 마우스 올린 줄(방향키로 옮긴 줄) = 확인 버튼 색 + 흰 글자.
//  - 선택지 한 줄 높이 = 닫힌 상자 높이. 목록 위아래 여백 없이 테두리에 딱 붙임.
//  - "(…골라주세요)" 같은 더미 선택지는 두지 않는다. 안내는 data-placeholder → 닫힌 상자 안 흐린 글씨.
//  - 원래 <select> 는 숨겨 둔 채 값을 그대로 가진다(폼 전송 · 기존 change 처리 그대로). 고르면 select 에 change 이벤트.
//  - 키보드 : ↓ / Enter / Space 펼침, ↑↓ 이동, Enter 고름, Esc · Tab 닫음.
//  ksis.select.enhance(root) — root 안의 select.k-select 를 모두 바꾼다(여러 번 불러도 됨).
//
//  모드 버튼 [42번] (같은 "고르는 부품"이라 이 파일에 둔다)
//  <div class="k-seg" data-name="region">
//     <button type="button" class="k-seg-btn selected" data-value="KR">국내</button>
//     <button type="button" class="k-seg-btn" data-value="OV">해외</button>
//  </div>
//  - 한 번 클릭으로 바뀐다. 이미 고른 쪽을 다시 누르면 아무 일도 없다.
//  - 바뀌면 .k-seg 에 change 이벤트(e.detail.value). 지금 값 : ksis.seg.value(segEl)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var openWrap = null;

	function closeOpen() {
		if (!openWrap) return;
		openWrap.classList.remove("open");
		var list = openWrap.querySelector(".k-select-list");
		if (list) list.hidden = true;
		openWrap = null;
	}

	function build(select) {
		if (select.dataset.kSelect) return;
		select.dataset.kSelect = "1";

		var wrap = document.createElement("div");
		wrap.className = "k-select-wrap";
		if (select.style.width) { wrap.style.width = select.style.width; select.style.width = ""; }
		select.parentNode.insertBefore(wrap, select);
		wrap.appendChild(select);

		var box = document.createElement("button");
		box.type = "button";
		box.className = "k-select-box";
		box.setAttribute("aria-haspopup", "listbox");
		wrap.appendChild(box);

		var list = document.createElement("ul");
		list.className = "k-select-list";
		list.setAttribute("role", "listbox");
		list.hidden = true;
		wrap.appendChild(list);

		// 안내 글이 있고 미리 고른 값이 없으면 아무것도 안 고른 상태로 시작
		if (select.dataset.placeholder && !select.querySelector("option[selected]")) select.selectedIndex = -1;

		var hoverIdx = -1;
		function items() { return Array.prototype.slice.call(list.children); }
		function setHover(i) {
			var li = items();
			if (li.length === 0) return;
			hoverIdx = Math.max(0, Math.min(li.length - 1, i));
			li.forEach(function (x, k) { x.classList.toggle("hover", k === hoverIdx); });
			li[hoverIdx].scrollIntoView({ block: "nearest" });
		}
		function paint() {
			var opt = select.options[select.selectedIndex];
			box.textContent = opt ? opt.text : (select.dataset.placeholder || "");
			box.classList.toggle("is-placeholder", !opt);
		}
		function fill() {
			list.innerHTML = "";
			Array.prototype.forEach.call(select.options, function (o, i) {
				if (o.hidden) return;
				var li = document.createElement("li");
				li.setAttribute("role", "option");
				li.textContent = o.text;
				li.dataset.index = i;
				if (i === select.selectedIndex) li.classList.add("selected");
				li.addEventListener("mouseenter", function () { setHover(items().indexOf(li)); });
				li.addEventListener("mousedown", function (e) { e.preventDefault(); choose(i); });
				list.appendChild(li);
			});
		}
		function open() {
			closeOpen();
			fill();
			list.style.setProperty("--k-opt-h", box.offsetHeight + "px"); // 선택지 한 줄 높이 = 닫힌 상자 높이
			list.hidden = false;
			wrap.classList.add("open");
			openWrap = wrap;
			var sel = items().findIndex(function (x) { return x.classList.contains("selected"); });
			setHover(sel < 0 ? 0 : sel);
		}
		function choose(i) {
			var changed = select.selectedIndex !== i;
			select.selectedIndex = i;
			paint();
			closeOpen();
			box.focus();
			if (changed) select.dispatchEvent(new Event("change", { bubbles: true }));
		}

		box.addEventListener("click", function () { wrap.classList.contains("open") ? closeOpen() : open(); });
		box.addEventListener("keydown", function (e) {
			var isOpen = wrap.classList.contains("open");
			if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); return; }
			if (!isOpen) return;
			if (e.key === "ArrowDown") { e.preventDefault(); setHover(hoverIdx + 1); }
			else if (e.key === "ArrowUp") { e.preventDefault(); setHover(hoverIdx - 1); }
			else if (e.key === "Enter") { e.preventDefault(); var li = items()[hoverIdx]; if (li) choose(parseInt(li.dataset.index, 10)); }
			else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeOpen(); }
			else if (e.key === "Tab") closeOpen();
		});
		select.addEventListener("change", paint);
		paint();
	}

	document.addEventListener("mousedown", function (e) {
		if (openWrap && !openWrap.contains(e.target)) closeOpen();
	});

	document.addEventListener("click", function (e) {
		var btn = e.target.closest && e.target.closest(".k-seg-btn");
		if (!btn || btn.disabled || btn.classList.contains("selected")) return;
		var seg = btn.closest(".k-seg");
		if (!seg) return;
		Array.prototype.forEach.call(seg.querySelectorAll(".k-seg-btn"), function (b) { b.classList.toggle("selected", b === btn); });
		seg.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: btn.dataset.value } }));
	});
	ksis.seg = {
		value: function (seg) { var b = seg.querySelector(".k-seg-btn.selected"); return b ? b.dataset.value : null; }
	};

	ksis.select = {
		enhance: function (root) {
			Array.prototype.forEach.call((root || document).querySelectorAll("select.k-select"), build);
		}
	};
})(window, document);
