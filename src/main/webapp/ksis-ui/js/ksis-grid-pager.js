// =====================================================================
//  KSIS 공통 그리드 : 페이지 넘기기 · 붙여넣기 연결   [비교표 32번 · 30번]
//
//  1) ksisGrid.pager(table, options) — 표 아래 번호 페이지(처음 · 이전 · 번호 · 다음 · 마지막) + 한 페이지 행 수.
//     KSIS-A 의 Tabulator 페이지(biz.ui.grid paginationSizeSelector)와 같은 모양 · 같은 동작이다(32번 "A 상태 유지").
//     지금 쪽의 행만 <tbody> 에 남긴다 → ksis-grid-select.js 의 방향키 · Ctrl+방향키가 보이는 행 안에서만 움직인다.
//       options.pagerEl   : 페이지 줄을 그릴 요소(없으면 표 바로 뒤에 만든다)
//       options.sizes     : 한 페이지 행 수 목록 (기본 [20, 50, 100])
//       options.size      : 처음 행 수 (기본 sizes[0])
//       options.countBox  : 제목 줄 건수 상자(.k-count-box). 두 줄을 채운다 — "총 N건" / "1~20 (페이지 1 / 7)"
//       options.onPage    : 쪽이 바뀐 뒤 부를 함수(선택)
//     ※ 비교표 32번 메모 : 나중에 "20개 ↔ 200개 모드 전환 버튼"으로 바뀔 수 있다(추후 확정).
//
//  2) ksisGrid.pasteTarget(table) — ksis-grid-paste.js(KSIS-B gridPaste.js)가 부르는 dotNetRef 대신 넘기는 객체.
//     B 는 붙여넣은 값을 .NET 으로 보냈고, JSP 화면은 표 안의 입력칸(input.grid-cell-input)에 바로 넣는다.
// =====================================================================
(function (window) {
	"use strict";

	var ksisGrid = window.ksisGrid = window.ksisGrid || {};

	function el(tag, cls, text) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (text != null) e.textContent = text;
		return e;
	}

	ksisGrid.pager = function (table, options) {
		options = options || {};
		var tbody = table.tBodies[0];
		var allRows = Array.prototype.slice.call(tbody.rows);
		var sizes = options.sizes || [20, 50, 100];
		var size = options.size || sizes[0];
		var page = 1;

		var pagerEl = options.pagerEl;
		if (!pagerEl) {
			pagerEl = el("div", "k-pager");
			(table.closest(".k-grid-wrap") || table).insertAdjacentElement("afterend", pagerEl);
		}
		pagerEl.classList.add("k-pager");

		function pageCount() { return Math.max(1, Math.ceil(allRows.length / size)); }

		function render() {
			var pages = pageCount();
			if (page > pages) page = pages;
			var from = (page - 1) * size;
			var to = Math.min(allRows.length, from + size);

			// 지금 쪽 행만 tbody 에 둔다
			while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
			for (var i = from; i < to; i++) tbody.appendChild(allRows[i]);

			pagerEl.innerHTML = "";

			var sizeBox = el("label", "k-pager-size");
			sizeBox.appendChild(document.createTextNode("페이지 크기 "));
			var sel = el("select");
			sizes.forEach(function (n) {
				var o = el("option", null, String(n));
				o.value = n;
				if (n === size) o.selected = true;
				sel.appendChild(o);
			});
			sel.addEventListener("change", function () { size = parseInt(sel.value, 10); page = 1; render(); });
			sizeBox.appendChild(sel);

			var nav = el("div", "k-pager-pages");
			function btn(label, target, disabled, active) {
				var b = el("button", active ? "active" : "", label);
				b.type = "button";
				b.disabled = !!disabled;
				b.addEventListener("click", function () { page = target; render(); });
				nav.appendChild(b);
			}
			btn("처음", 1, page === 1);
			btn("이전", page - 1, page === 1);
			// 번호는 지금 쪽 앞뒤로 최대 5개
			var start = Math.max(1, Math.min(page - 2, pages - 4));
			var end = Math.min(pages, start + 4);
			for (var p = start; p <= end; p++) btn(String(p), p, false, p === page);
			btn("다음", page + 1, page === pages);
			btn("마지막", pages, page === pages);

			var counter = el("span", "k-pager-count",
				(allRows.length === 0 ? "0" : (from + 1) + "-" + to) + " / " + allRows.length.toLocaleString() + "행");

			pagerEl.appendChild(sizeBox);
			pagerEl.appendChild(nav);
			pagerEl.appendChild(counter);

			if (options.countBox) {
				options.countBox.innerHTML = "";
				options.countBox.appendChild(el("span", null, "총 " + allRows.length.toLocaleString() + "건"));
				options.countBox.appendChild(el("span", "k-count-sub",
					(allRows.length === 0 ? "0" : (from + 1) + "~" + to) + " (페이지 " + page + " / " + pages + ")"));
			}
			if (typeof options.onPage === "function") options.onPage(page, size);
		}

		render();
		return {
			go: function (p) { page = p; render(); },
			refresh: function () { allRows = Array.prototype.slice.call(tbody.rows); render(); }
		};
	};

	ksisGrid.pasteTarget = function (table) {
		function input(row, col) {
			return table.querySelector('input.grid-cell-input[data-row="' + row + '"][data-col="' + col + '"]');
		}
		var pasted = 0;
		return {
			invokeMethodAsync: function (name, a, b, c, d) {
				if (name === "OnPasteData") {
					// (시작 행, 시작 열, 탭 · 줄바꿈으로 나뉜 글자, 마지막 덩어리인지)
					var startRow = a, startCol = b, text = c, isLast = d;
					text.split("\n").forEach(function (line, r) {
						line.split("\t").forEach(function (value, ci) {
							var inp = input(startRow + r, startCol + ci);
							if (!inp) return;
							inp.value = value.trim();
							inp.dispatchEvent(new Event("input", { bubbles: true }));
						});
						pasted++;
					});
					if (isLast) {
						if (window.ksis && ksis.toast) ksis.toast(pasted + "행 붙여넣음");
						pasted = 0;
					}
				} else if (name === "OnTabKeyPressed") {
					// (행, 열, Shift) → 옆 칸, 줄 끝이면 다음 줄 첫 칸
					var row = a, col = b, back = c;
					var all = Array.prototype.slice.call(table.querySelectorAll("input.grid-cell-input"));
					var cur = input(row, col);
					var idx = all.indexOf(cur);
					var next = all[idx + (back ? -1 : 1)];
					if (next) { next.focus(); next.select(); }
				}
				return Promise.resolve();
			}
		};
	};
})(window);
