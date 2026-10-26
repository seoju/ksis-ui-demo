<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 좌측 메뉴 색 검토 : 좌측 세로 메뉴(대메뉴 · 소메뉴) 색을 기존 · 지금 요구사항 · 후보로 나란히(2안 가지 전용).
     후보 칸은 지금 요구사항 화면에 --k-menu-* 변수만 바꿔 입힌다(오른쪽에서 후보를 고르거나 색을 직접 바꿈). --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>좌측 메뉴 색 검토 · KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body>
<header class="ds-top">
	<a class="ds-brand" href="<c:url value='/'/>">KSIS UI 통일 시연</a>
	<nav class="ds-areas" aria-label="영역">
		<a href="<c:url value='/summary'/>">비교표 요약<small>0번</small></a>
		<c:forEach var="a" items="${areas}">
			<a href="<c:url value='/compare/${a.key}'/>">${a.title}<small>${a.range}</small></a>
		</c:forEach>
		<a href="<c:url value='/tabs'/>">탭 검토<small>14번</small></a>
		<a href="<c:url value='/sidebar'/>" class="on">좌측 메뉴 색<small>11번</small></a>
	</nav>
	<div class="ds-ctrl">
		<label>보기
			<select id="sbMode">
				<option value="both">A · B 2줄</option>
				<option value="a">A만(세로 길게)</option>
				<option value="b">B만(세로 길게)</option>
			</select>
		</label>
		<label>화면 폭
			<select id="sbWidth">
				<option value="1920">1920px 화면</option>
				<option value="1600" selected>1600px 화면</option>
				<option value="1366">1366px 노트북</option>
			</select>
		</label>
	</div>
</header>

<c:set var="uOa"><c:url value='/view/orig-a/layout'/></c:set>
<c:set var="uOb"><c:url value='/view/orig-b/layout'/></c:set>
<c:set var="uRa"><c:url value='/view/req-a/layout'/></c:set>
<c:set var="uRb"><c:url value='/view/req-b/layout'/></c:set>

<div class="ds-sbrev mode-both" id="sbMain">
	<main class="sb-panes">
		<section class="tr-pane is-orig sb-a" data-kind="orig-a"><div class="tr-head"><b>기존</b> KSIS-A 원래<span>지금 KSIS-A 코드</span><a href="${uOa}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${uOa}" title="기존 KSIS-A"></iframe></div></section>
		<section class="tr-pane is-a sb-a" data-kind="req"><div class="tr-head"><b>지금</b> KSIS-A 요구사항<span>11번 : 왼쪽 위 연한 주색 → 흰색 그라데이션</span><a href="${uRa}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${uRa}" title="지금 KSIS-A 요구사항"></iframe></div></section>
		<section class="tr-pane is-a sb-a is-try" data-kind="req" data-theme="a"><div class="tr-head"><b>후보</b> KSIS-A<span id="sbNameA">오른쪽에서 고른 색</span></div><div class="tr-body"><iframe src="${uRa}" title="후보 KSIS-A"></iframe></div></section>

		<section class="tr-pane is-orig sb-b" data-kind="orig-b"><div class="tr-head"><b>기존</b> KSIS-B 원래<span>지금 KSIS-B 코드</span><a href="${uOb}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${uOb}" title="기존 KSIS-B"></iframe></div></section>
		<section class="tr-pane is-b sb-b" data-kind="req"><div class="tr-head"><b>지금</b> KSIS-B 요구사항<span>11번 : 왼쪽 위 연한 주색 → 흰색 그라데이션</span><a href="${uRb}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${uRb}" title="지금 KSIS-B 요구사항"></iframe></div></section>
		<section class="tr-pane is-b sb-b is-try" data-kind="req" data-theme="b"><div class="tr-head"><b>후보</b> KSIS-B<span id="sbNameB">오른쪽에서 고른 색</span></div><div class="tr-body"><iframe src="${uRb}" title="후보 KSIS-B"></iframe></div></section>
	</main>

	<aside class="sb-ctrl">
		<h3>후보 고르기</h3>
		<div class="sb-presets" id="sbPresets"></div>
		<h3>색 직접 바꾸기 <small>후보 칸에 바로 입혀짐</small></h3>
		<table class="sb-colors">
			<thead><tr><th></th><th>A</th><th>B</th></tr></thead>
			<tbody id="sbColors"></tbody>
		</table>
		<p class="sb-hint">메뉴 위에 마우스를 올리면 "마우스 올림" 색이 보입니다. 칸마다 첫 대메뉴를 펼치고 두 번째 소메뉴를 선택해 두었습니다.</p>
		<h3>지금 고른 값 <small>이 글을 복사해 알려 주시면 요구사항에 넣습니다</small></h3>
		<textarea id="sbOut" readonly rows="9" wrap="off"></textarea>
	</aside>
</div>

<script>
(function () {
	"use strict";
	// 바꿀 수 있는 색(ksis-common.css 의 --k-menu-* 변수)
	var FIELDS = [
		["--k-menu-grad-start", "바탕 위(왼쪽 위)"],
		["--k-menu-grad-end", "바탕 아래(오른쪽 아래)"],
		["--k-menu-text", "글자"],
		["--k-menu-hover-bg", "마우스 올림 바탕"],
		["--k-menu-hover-text", "마우스 올림 글자"],
		["--k-menu-active-bg", "펼친 대메뉴 · 선택 소메뉴 바탕"],
		["--k-menu-active-text", "펼친 대메뉴 · 선택 소메뉴 글자"]
	];
	// 후보 : [이름, A 값 7개, B 값 7개] (값 순서는 FIELDS 와 같음)
	var PRESETS = [
		["지금 요구사항(연한 주색 → 흰색)",
			["#F5F9FE", "#FFFFFF", "#4C4C4C", "#EBF3FF", "#1B1D1F", "#EDF4FF", "#3488FF"],
			["#F0FCF5", "#FFFFFF", "#4C4C4C", "#E6F9EE", "#1B1D1F", "#E7F9EE", "#03C75A"]],
		["흰색 한 색",
			["#FFFFFF", "#FFFFFF", "#4C4C4C", "#EBF3FF", "#1B1D1F", "#EDF4FF", "#3488FF"],
			["#FFFFFF", "#FFFFFF", "#4C4C4C", "#E6F9EE", "#1B1D1F", "#E7F9EE", "#03C75A"]],
		["연회색 한 색",
			["#F7F8FA", "#F7F8FA", "#4C4C4C", "#EBF0F7", "#1B1D1F", "#E3EDFF", "#3488FF"],
			["#F7F8FA", "#F7F8FA", "#4C4C4C", "#E9F3ED", "#1B1D1F", "#DDF5E7", "#03C75A"]],
		["연한 주색 한 색",
			["#F5F9FE", "#F5F9FE", "#4C4C4C", "#E6F0FF", "#1B1D1F", "#DCEAFF", "#3488FF"],
			["#F0FCF5", "#F0FCF5", "#4C4C4C", "#E0F6E9", "#1B1D1F", "#D5F3E1", "#03C75A"]],
		["조금 진한 주색 → 흰색",
			["#E3EEFF", "#FFFFFF", "#3F4650", "#D6E6FF", "#1B1D1F", "#CFE1FF", "#1B6FE6"],
			["#DDF6E7", "#FFFFFF", "#3F4650", "#CDEFDB", "#1B1D1F", "#C8EED7", "#02A84C"]],
		["진한 메뉴(가로바 색 이어서)",
			["#082878", "#0E3A9E", "#DCE5F7", "#1C47A8", "#FFFFFF", "#3488FF", "#FFFFFF"],
			["#006B35", "#008A45", "#DDF2E5", "#0B8547", "#FFFFFF", "#03C75A", "#FFFFFF"]]
	];
	var KEY = "sbColors";
	var state = loadState() || { name: PRESETS[0][0], a: PRESETS[0][1].slice(), b: PRESETS[0][2].slice() };
	function loadState() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
	function saveState() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

	// 후보 버튼
	var presetBox = document.getElementById("sbPresets");
	PRESETS.forEach(function (p) {
		var b = document.createElement("button");
		b.type = "button";
		b.innerHTML = '<i style="background:linear-gradient(135deg,' + p[1][0] + ',' + p[1][1] + ')"></i><i style="background:linear-gradient(135deg,' + p[2][0] + ',' + p[2][1] + ')"></i><span></span>';
		b.querySelector("span").textContent = p[0];
		b.onclick = function () { state = { name: p[0], a: p[1].slice(), b: p[2].slice() }; apply(); };
		presetBox.appendChild(b);
	});

	// 색 입력칸
	var tbody = document.getElementById("sbColors");
	FIELDS.forEach(function (f, i) {
		var tr = document.createElement("tr");
		tr.innerHTML = "<th></th><td><input type=color data-t=a data-i=" + i + "></td><td><input type=color data-t=b data-i=" + i + "></td>";
		tr.firstChild.textContent = f[1];
		tbody.appendChild(tr);
	});
	tbody.addEventListener("input", function (e) {
		var el = e.target;
		state[el.dataset.t][+el.dataset.i] = el.value.toUpperCase();
		state.name = "직접 바꾼 색";
		apply();
	});

	function paintFrame(frame, vals) {
		var doc = frame.contentDocument;
		if (!doc || !doc.documentElement) return;
		FIELDS.forEach(function (f, i) { doc.documentElement.style.setProperty(f[0], vals[i]); });
	}
	function apply() {
		Array.prototype.forEach.call(tbody.querySelectorAll("input"), function (el) { el.value = state[el.dataset.t][+el.dataset.i]; });
		Array.prototype.forEach.call(document.querySelectorAll(".is-try"), function (pane) {
			paintFrame(pane.querySelector("iframe"), state[pane.dataset.theme]);
		});
		document.getElementById("sbNameA").textContent = state.name;
		document.getElementById("sbNameB").textContent = state.name;
		Array.prototype.forEach.call(presetBox.children, function (b, i) { b.classList.toggle("on", PRESETS[i][0] === state.name); });
		document.getElementById("sbOut").value = "후보 : " + state.name + "\n" + FIELDS.map(function (f, i) {
			return f[1] + " : A " + state.a[i] + " / B " + state.b[i];
		}).join("\n");
		saveState();
	}

	// 보기 · 화면 폭
	var main = document.getElementById("sbMain");
	var modeSel = document.getElementById("sbMode"), widthSel = document.getElementById("sbWidth");
	try { modeSel.value = localStorage.getItem("sbMode") || "both"; widthSel.value = localStorage.getItem("sbWidth") || "1600"; } catch (e) { }
	function setMode() { main.className = "ds-sbrev mode-" + modeSel.value; }
	function setWidth() { Array.prototype.forEach.call(document.querySelectorAll(".sb-panes iframe"), function (f) { f.style.width = widthSel.value + "px"; }); }
	setMode(); setWidth();
	modeSel.onchange = function () { setMode(); try { localStorage.setItem("sbMode", modeSel.value); } catch (e) { } };
	widthSel.onchange = function () { setWidth(); try { localStorage.setItem("sbWidth", widthSel.value); } catch (e) { } };

	// 칸마다 : 첫 대메뉴를 펼치고(이미 펼쳐 있으면 그대로) 두 번째 소메뉴를 선택
	var HOW = {
		"orig-a": { group: ".menu-inner > .menu-item", isOpen: function (g) { return g.classList.contains("open"); }, toggle: function (g) { return g.querySelector(".menu-toggle"); }, item: ".menu-sub .menu-item > .menu-link" },
		"orig-b": { group: ".sidebar-group-header", isOpen: function (g) { return g.classList.contains("expanded"); }, toggle: function (g) { return g; }, item: ".sidebar-subitem" },
		"req": { group: ".k-menu-group-header", isOpen: function (g) { return g.classList.contains("expanded"); }, toggle: function (g) { return g; }, item: ".k-menu-item" }
	};
	Array.prototype.forEach.call(document.querySelectorAll(".sb-panes .tr-pane"), function (pane) {
		var frame = pane.querySelector("iframe"), how = HOW[pane.dataset.kind];
		frame.addEventListener("load", function () {
			if (pane.classList.contains("is-try")) paintFrame(frame, state[pane.dataset.theme]);
			setTimeout(function () {
				var doc = frame.contentDocument;
				var g = doc.querySelector(how.group);
				if (g && !how.isOpen(g)) how.toggle(g).click();
				var items = doc.querySelectorAll(how.item);
				if (items[1]) items[1].click();
			}, 300);
		});
	});
	apply();
})();
</script>
</body>
</html>
