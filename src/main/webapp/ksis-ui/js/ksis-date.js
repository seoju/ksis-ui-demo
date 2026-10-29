// =====================================================================
//  KSIS 공통 : 날짜 입력 + 달력   [비교표 41번]
//
//  <span class="k-date">
//    <input type="text" class="k-input" name="fromDate">
//    <button type="button" class="k-date-btn" tabindex="-1" title="달력">…</button>
//  </span>
//  - KSIS-B 달력 방식 그대로(글자 칸 + 달력 버튼, 버튼 아래 오른쪽 맞춤 작은 달력), 색만 테마 색.
//  - yyyyMMdd · yyyy-MM-dd · yyyy.MM.dd · yyyy/MM/dd 무엇을 넣어도 같은 날짜로 알아듣는다.
//  - 일이 그 달 마지막 날보다 크면 마지막 날로 바꾼다(2월 28 · 윤년 29, 4 · 6 · 9 · 11월 30, 나머지 31).
//    칸을 떠나면 yyyy-MM-dd 로 보이게 고치고, 서버로 보낼 값은 yyyyMMdd(input.dataset.value · ksis.date.value(input)).
//  - 달력 버튼은 tabindex="-1" : 날짜 2개가 나란히 있으면 Tab 이 둘째 날짜 → 다음 칸으로 간다(달력 버튼에 멈추지 않음).
//  - 달력 : ‹ 년 › · ‹ 월 › 이동, 오늘 테두리, 고른 날 채움, [지우기] [오늘], 바깥 클릭 · Esc 로 닫힘.
//  ksis.date.enhance(root)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var WEEK = ["일", "월", "화", "수", "목", "금", "토"];
	var openCal = null;

	function pad(n) { return (n < 10 ? "0" : "") + n; }

	/** 그 달의 마지막 날(28 · 29 · 30 · 31). 윤년은 Date 가 알아서 셈(4로 나누어떨어지면 윤년, 100은 아님, 400은 윤년) */
	function lastDay(y, mo) {
		var dt = new Date(2000, 0, 1);
		dt.setFullYear(y, mo, 0); // mo 월의 0일 = (mo-1)월의 마지막 날. setFullYear 라서 0~99년도 그대로
		return dt.getDate();
	}

	/** 글자 → Date (못 알아들으면 null).
	 *  [41번] 일이 그 달 마지막 날보다 크면 마지막 날로 바꿈 : 2025-02-30 → 2025-02-28, 2024-02-30 → 2024-02-29,
	 *  2026-04-31 → 2026-04-30, 2026-01-99 → 2026-01-31. 월이 1~12 가 아니거나 일이 0 이면 잘못된 날짜(빨간 테두리) */
	function parse(text) {
		var t = String(text || "").trim();
		var m = /^(\d{4})(\d{2})(\d{2})$/.exec(t) || /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/.exec(t);
		if (!m) return null;
		var y = +m[1], mo = +m[2], d = +m[3];
		if (mo < 1 || mo > 12 || d < 1) return null;
		d = Math.min(d, lastDay(y, mo));
		var dt = new Date(2000, 0, 1);
		dt.setFullYear(y, mo - 1, d);
		return dt;
	}
	function show(dt) { return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate()); }
	function compact(dt) { return dt.getFullYear() + pad(dt.getMonth() + 1) + pad(dt.getDate()); }

	function normalize(input) {
		var raw = input.value.trim();
		if (raw === "") { input.dataset.value = ""; input.classList.remove("invalid"); return; }
		var dt = parse(raw);
		if (dt) {
			input.value = show(dt);
			input.dataset.value = compact(dt);
			input.classList.remove("invalid");
		} else {
			input.dataset.value = "";
			input.classList.add("invalid");
		}
	}

	function closeCal() {
		if (!openCal) return;
		openCal.remove();
		document.removeEventListener("mousedown", outside, true);
		document.removeEventListener("keydown", onEsc, true);
		openCal = null;
	}
	function outside(e) {
		if (openCal && !openCal.contains(e.target) && !openCal._wrap.contains(e.target)) closeCal();
	}
	function onEsc(e) {
		if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeCal(); }
	}

	function openCalendar(wrap, input) {
		closeCal();
		var selected = parse(input.value);
		var today = new Date();
		var view = new Date((selected || today).getFullYear(), (selected || today).getMonth(), 1);

		var cal = document.createElement("div");
		cal.className = "k-calendar";
		cal._wrap = wrap;

		function render() {
			var y = view.getFullYear(), m = view.getMonth();
			var first = new Date(y, m, 1).getDay();
			var days = new Date(y, m + 1, 0).getDate();
			var html = '<div class="k-calendar-head">' +
				'<div class="k-calendar-nav"><button type="button" data-nav="-12">‹</button><span class="k-calendar-title">' + y + '년</span><button type="button" data-nav="12">›</button></div>' +
				'<div class="k-calendar-nav"><button type="button" data-nav="-1">‹</button><span class="k-calendar-title">' + (m + 1) + '월</span><button type="button" data-nav="1">›</button></div>' +
				'</div><table><thead><tr>';
			WEEK.forEach(function (w) { html += "<th>" + w + "</th>"; });
			html += "</tr></thead><tbody><tr>";
			var cell = 0;
			for (var i = 0; i < first; i++, cell++) html += '<td class="empty"></td>';
			for (var d = 1; d <= days; d++, cell++) {
				if (cell > 0 && cell % 7 === 0) html += "</tr><tr>";
				var cls = "day";
				if (selected && selected.getFullYear() === y && selected.getMonth() === m && selected.getDate() === d) cls += " selected";
				if (today.getFullYear() === y && today.getMonth() === m && today.getDate() === d) cls += " today";
				html += '<td class="' + cls + '" data-day="' + d + '">' + d + "</td>";
			}
			while (cell % 7 !== 0) { html += '<td class="empty"></td>'; cell++; }
			html += '</tr></tbody></table><div class="k-calendar-foot"><button type="button" data-act="clear">지우기</button><button type="button" data-act="today">오늘</button></div>';
			cal.innerHTML = html;
		}
		function pick(dt) {
			input.value = dt ? show(dt) : "";
			normalize(input);
			input.dispatchEvent(new Event("change", { bubbles: true }));
			closeCal();
			input.focus();
		}
		cal.addEventListener("mousedown", function (e) { e.preventDefault(); }); // 입력칸 포커스 유지
		cal.addEventListener("click", function (e) {
			var t = e.target;
			if (t.dataset.nav) { view = new Date(view.getFullYear(), view.getMonth() + parseInt(t.dataset.nav, 10), 1); render(); }
			else if (t.dataset.day) pick(new Date(view.getFullYear(), view.getMonth(), parseInt(t.dataset.day, 10)));
			else if (t.dataset.act === "clear") pick(null);
			else if (t.dataset.act === "today") pick(new Date());
		});
		render();
		wrap.appendChild(cal);
		// 버튼 아래 오른쪽 맞춤이 기본. 화면 왼쪽 밖으로 나가면(검색 영역 맨 앞 날짜 등) 왼쪽 맞춤으로
		if (cal.getBoundingClientRect().left < 4) { cal.style.right = "auto"; cal.style.left = "0"; }
		openCal = cal;
		document.addEventListener("mousedown", outside, true);
		document.addEventListener("keydown", onEsc, true);
	}

	function build(wrap) {
		if (wrap.dataset.kDate) return;
		wrap.dataset.kDate = "1";
		var input = wrap.querySelector("input");
		var btn = wrap.querySelector(".k-date-btn");
		if (!input) return;
		input.setAttribute("autocomplete", "off");
		input.addEventListener("blur", function () { normalize(input); });
		input.addEventListener("keydown", function (e) {
			if (e.key === "Enter") normalize(input);
			if (e.key === "Tab") closeCal();
		});
		if (btn) {
			btn.setAttribute("tabindex", "-1");
			btn.addEventListener("click", function () { openCal && openCal._wrap === wrap ? closeCal() : openCalendar(wrap, input); });
		}
		normalize(input);
	}

	ksis.date = {
		enhance: function (root) {
			Array.prototype.forEach.call((root || document).querySelectorAll(".k-date"), build);
		},
		/** 서버로 보낼 값(yyyyMMdd). 비었거나 틀리면 "" */
		value: function (input) { normalize(input); return input.dataset.value || ""; },
		parse: parse
	};

	/** 화면 · 팝업 안의 공통 부품을 한 번에 */
	ksis.enhance = function (root) {
		if (ksis.select) ksis.select.enhance(root);
		ksis.date.enhance(root);
	};
	document.addEventListener("DOMContentLoaded", function () { ksis.enhance(document); });
})(window, document);
