<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 탭 검토 : 화면 탭(비교표 14번) 1~3안 × 좌측 메뉴 색(11번) 1~5안 × A·B 조합을 한 화면에서(plan-b 가지 전용).
     칸마다 실제 메인 틀을 iframe 으로 실제 크기(기본 1600×900 화면)로 열어 위쪽만 보이게 하고,
     첫 대메뉴를 펼친 뒤 소메뉴를 눌러 탭을 몇 개 띄워 둔다(보는 탭은 두 번째).
     요구사항 칸 주소 : /view/req-{a|b}/layout?tabPlan=2|3&menuPlan=2~5 (탭 1안 · 메뉴 1안은 값 없음 = main 과 같은 기본 화면) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>탭 · 좌측 메뉴 검토 · KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body class="tr-page">
<header class="ds-top">
	<a class="ds-brand" href="<c:url value='/'/>">KSIS UI 통일 시연</a>
	<nav class="ds-areas" aria-label="영역">
		<a href="<c:url value='/summary'/>">비교표 요약<small>0번</small></a>
		<c:forEach var="a" items="${areas}">
			<a href="<c:url value='/compare/${a.key}'/>">${a.title}<small>${a.range}</small></a>
		</c:forEach>
		<a href="<c:url value='/tabs'/>" class="on">탭 검토<small>14 · 11번</small></a>
	</nav>
</header>

<%-- 조합 고르기 : 줄을 무엇으로 나눌지 + 고정할 안 --%>
<div class="tr-bar" id="trBar">
	<label>줄 나누기
		<select id="trAxis">
			<option value="tab">탭 안별(좌측 메뉴 안 고정)</option>
			<option value="menu">좌측 메뉴 안별(탭 안 고정)</option>
			<option value="all">전체 조합(탭 3 × 메뉴 5 = 15줄)</option>
		</select>
	</label>
	<label class="tr-fix-menu">좌측 메뉴
		<select id="trMenu"></select>
	</label>
	<label class="tr-fix-tab">탭
		<select id="trTab"></select>
	</label>
	<label class="tr-check"><input type="checkbox" id="trOrig"> 기존 화면 줄</label>
	<span class="tr-sep"></span>
	<label>칸
		<select id="trMode">
			<option value="two">A · B 2열</option>
			<option value="one">A · B 1열(넓게)</option>
			<option value="a">A만</option>
			<option value="b">B만</option>
		</select>
	</label>
	<label>칸 높이
		<select id="trHeight">
			<option value="fit">화면에 맞춤</option>
			<option value="220">220px</option>
			<option value="360">360px</option>
			<option value="520">520px</option>
		</select>
	</label>
	<label>화면 폭
		<select id="trWidth">
			<option value="1920">1920px 화면</option>
			<option value="1600">1600px 화면</option>
			<option value="1366">1366px 노트북</option>
			<option value="0">칸 폭 그대로</option>
		</select>
	</label>
	<label>열어 둘 탭
		<select id="trCount">
			<option value="2">2개</option>
			<option value="4">4개</option>
			<option value="6">6개</option>
			<option value="10">10개</option>
			<option value="12">12개(B 규칙 10개 넘김 시험)</option>
		</select>
	</label>
</div>

<main class="ds-tabrev mode-two" id="trMain"></main>

<script>
(function () {
	"use strict";
	var BASE = "${pageContext.request.contextPath}";
	// 화면 탭 안(비교표 14번)
	var TABS = [
		{ no: 1, name: "탭 1안", desc: "1차 검토본(main, 지금 기본) : 가로바에 걸친 B 서류철 탭, 높이 20px" },
		{ no: 2, name: "탭 2안", desc: "참고 시스템 책갈피 탭(그림 · CSS 에서 따 옴), 가로바 아래 40px 탭 줄" },
		{ no: 3, name: "탭 3안", desc: "2안 탭을 진한 가로바 위로 겹쳐 올림, 아래 흰 띠만 남음(1920×1080 에서 8px)" }
	];
	// 좌측 메뉴 색 안(비교표 11번)
	var MENUS = [
		{ no: 1, name: "메뉴 1안", desc: "지금 요구사항 : 왼쪽 위 연한 주색 → 흰색 그라데이션, 선택은 연한 주색 바탕" },
		{ no: 2, name: "메뉴 2안", desc: "진한 메뉴 : 가로바 색을 이어 ㄱ자 진한 틀, 선택은 주색 채움 + 흰 글자" },
		{ no: 3, name: "메뉴 3안", desc: "흰 바탕 + 오른쪽 경계선, 선택 소메뉴는 왼쪽 주색 막대 + 주색 글자" },
		{ no: 4, name: "메뉴 4안", desc: "연회색 바탕, 선택 소메뉴는 흰 카드(옅은 그림자) + 주색 글자" },
		{ no: 5, name: "메뉴 5안", desc: "가로바 색을 옅게 깐 바탕, 선택 소메뉴는 가로바 색 채움 + 흰 글자" }
	];

	var $ = function (id) { return document.getElementById(id); };
	var main = $("trMain");
	var sel = { axis: $("trAxis"), menu: $("trMenu"), tab: $("trTab"), orig: $("trOrig"), mode: $("trMode"), height: $("trHeight"), width: $("trWidth"), count: $("trCount") };
	MENUS.forEach(function (m) { sel.menu.add(new Option(m.name + " · " + m.desc.split(" : ")[0].split(",")[0], m.no)); });
	TABS.forEach(function (t) { sel.tab.add(new Option(t.name, t.no)); });

	// 고른 값 기억(이 브라우저에만)
	var DEF = { axis: "tab", menu: "1", tab: "3", orig: "1", mode: "two", height: "fit", width: "1600", count: "4" };
	Object.keys(DEF).forEach(function (k) {
		var v = DEF[k];
		try { v = localStorage.getItem("tr." + k) || v; } catch (e) { }
		if (k === "orig") sel.orig.checked = v === "1"; else sel[k].value = v;
	});
	function save(k, v) { try { localStorage.setItem("tr." + k, v); } catch (e) { } }

	function reqUrl(theme, tab, menu) {
		var q = [];
		if (tab !== 1) q.push("tabPlan=" + tab);
		if (menu !== 1) q.push("menuPlan=" + menu);
		return BASE + "/view/req-" + theme + "/layout" + (q.length ? "?" + q.join("&") : "");
	}
	// 줄 목록 : { label, desc, a, b, kind }
	function rows() {
		var list = [];
		if (sel.orig.checked) list.push({ tag: "기존", label: "기존 화면", desc: "지금 KSIS-A · KSIS-B 코드 그대로(탭 · 메뉴 모두 원래 모양)", orig: true });
		var axis = sel.axis.value, tFix = +sel.tab.value, mFix = +sel.menu.value;
		if (axis === "tab") TABS.forEach(function (t) { list.push({ tab: t, menu: MENUS[mFix - 1] }); });
		else if (axis === "menu") MENUS.forEach(function (m) { list.push({ tab: TABS[tFix - 1], menu: m }); });
		else TABS.forEach(function (t) { MENUS.forEach(function (m) { list.push({ tab: t, menu: m }); }); });
		return list;
	}

	function build() {
		document.body.classList.toggle("axis-tab", sel.axis.value === "tab");
		document.body.classList.toggle("axis-menu", sel.axis.value === "menu");
		var list = rows();
		main.innerHTML = "";
		main.style.setProperty("--tr-rows", list.length);
		list.forEach(function (r) {
			["a", "b"].forEach(function (theme) {
				var sec = document.createElement("section");
				var url, head;
				if (r.orig) {
					url = BASE + "/view/orig-" + theme + "/layout";
					sec.dataset.kind = "orig-" + theme;
					head = '<b class="t-orig">기존</b><em>KSIS-' + theme.toUpperCase() + ' 원래</em><span>' + r.desc + "</span>";
				} else {
					url = reqUrl(theme, r.tab.no, r.menu.no);
					sec.dataset.kind = "req";
					head = '<b>' + r.tab.name + '</b><b class="t-menu">' + r.menu.name + '</b><em>KSIS-' + theme.toUpperCase() + '</em>' +
						'<span title="' + r.tab.desc + " / " + r.menu.desc + '">' + (sel.axis.value === "menu" ? r.menu.desc : sel.axis.value === "tab" ? r.tab.desc : r.tab.desc + " / " + r.menu.desc) + "</span>";
				}
				sec.className = "tr-pane " + (r.orig ? "is-orig" : "is-" + theme) + " tr-" + theme;
				sec.innerHTML = '<div class="tr-head">' + head + '<a href="' + url + '" target="_blank" rel="noopener">새 창 ↗</a></div>' +
					'<div class="tr-body"><iframe loading="lazy" src="' + url + '"></iframe></div>';
				main.appendChild(sec);
				var frame = sec.querySelector("iframe");
				var w = +sel.width.value;
				frame.style.width = w ? w + "px" : "100%";
				frame.addEventListener("load", function () { setTimeout(function () { prepare(frame, HOW[sec.dataset.kind]); }, 300); });
			});
		});
		layout();
	}
	function layout() {
		main.className = "ds-tabrev mode-" + sel.mode.value + (sel.height.value === "fit" ? " h-fit" : "");
		main.style.setProperty("--tr-h", sel.height.value === "fit" ? "" : sel.height.value + "px");
	}

	// 칸마다 : 첫 대메뉴를 펼치고(이미 펼쳐 있으면 그대로) 소메뉴를 차례로 눌러 탭을 띄운 뒤 두 번째 탭을 보는 탭으로
	var HOW = {
		"orig-a": { group: ".menu-inner > .menu-item", open: function (g) { return g.classList.contains("open"); }, toggle: function (g) { return g.querySelector(".menu-toggle"); }, menu: ".menu-sub .menu-item > .menu-link", tab: ".tab-item-nav" },
		"orig-b": { group: ".sidebar-group-header", open: function (g) { return g.classList.contains("expanded"); }, toggle: function (g) { return g; }, menu: ".sidebar-subitem", tab: ".tab-item" },
		"req": { group: ".k-menu-group-header", open: function (g) { return g.classList.contains("expanded"); }, toggle: function (g) { return g; }, menu: ".k-menu-item", tab: ".k-tab" }
	};
	function prepare(frame, how) {
		var doc = frame.contentDocument;
		if (!doc) return;
		var g = doc.querySelector(how.group);
		if (g && !how.open(g)) how.toggle(g).click();
		var items = Array.prototype.slice.call(doc.querySelectorAll(how.menu), 0, parseInt(sel.count.value, 10));
		var i = 0;
		(function next() {
			if (i < items.length) { items[i++].click(); setTimeout(next, 60); return; }
			var tabs = doc.querySelectorAll(how.tab);
			if (tabs.length > 1) tabs[1].click();
		})();
	}

	["axis", "menu", "tab", "count", "width"].forEach(function (k) {
		sel[k].onchange = function () { save(k, sel[k].value); build(); };
	});
	sel.orig.onchange = function () { save("orig", sel.orig.checked ? "1" : "0"); build(); };
	sel.mode.onchange = function () { save("mode", sel.mode.value); layout(); };
	sel.height.onchange = function () { save("height", sel.height.value); layout(); };
	build();
})();
</script>
</body>
</html>
