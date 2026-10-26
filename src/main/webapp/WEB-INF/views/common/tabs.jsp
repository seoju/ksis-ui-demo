<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 탭 검토 : 화면 탭(비교표 14번)의 여러 안을 A · B 로 한 화면에 나란히(2안 가지 전용).
     칸마다 실제 메인 틀을 iframe 으로 실제 크기(기본 1600×900 화면)로 열어 위쪽만 보이게 하고, 열린 뒤 좌측 메뉴를 눌러 탭을 몇 개 띄워 둔다(보는 탭은 두 번째). --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>탭 검토 · KSIS UI 통일 시연</title>
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
		<a href="<c:url value='/tabs'/>" class="on">탭 검토<small>14번</small></a>
	</nav>
	<div class="ds-ctrl">
		<label>보기
			<select id="trMode">
				<option value="two">A · B 2열</option>
				<option value="one">1열(넓게)</option>
			</select>
		</label>
		<label>화면 폭
			<select id="trWidth">
				<option value="1920">1920px 화면</option>
				<option value="1600" selected>1600px 화면</option>
				<option value="1366">1366px 노트북</option>
				<option value="0">칸 폭 그대로</option>
			</select>
		</label>
		<label>열어 둘 탭
			<select id="trCount">
				<option value="2">2개</option>
				<option value="4" selected>4개</option>
				<option value="6">6개</option>
				<option value="10">10개</option>
			</select>
		</label>
	</div>
</header>

<main class="ds-tabrev mode-two" id="trMain">
	<%-- 줄 = 안, 칸 = A · B. kind 는 탭을 띄우는 방법(원래 A / 원래 B / 요구사항 공통 틀) --%>
	<c:set var="u1a"><c:url value='/view/orig-a/layout'/></c:set>
	<c:set var="u1b"><c:url value='/view/orig-b/layout'/></c:set>
	<c:set var="u2a"><c:url value='/view/req-a/layout?tabPlan=1'/></c:set>
	<c:set var="u2b"><c:url value='/view/req-b/layout?tabPlan=1'/></c:set>
	<c:set var="u3a"><c:url value='/view/req-a/layout'/></c:set>
	<c:set var="u3b"><c:url value='/view/req-b/layout'/></c:set>

	<section class="tr-pane is-orig" data-kind="orig-a"><div class="tr-head"><b>기존</b> KSIS-A 원래 화면<span>지금 KSIS-A 코드 그대로(위쪽 흰 줄 안 탭)</span><a href="${u1a}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u1a}" title="기존 KSIS-A"></iframe></div></section>
	<section class="tr-pane is-orig" data-kind="orig-b"><div class="tr-head"><b>기존</b> KSIS-B 원래 화면<span>지금 KSIS-B 코드 그대로(가로바에 걸친 서류철 탭)</span><a href="${u1b}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u1b}" title="기존 KSIS-B"></iframe></div></section>

	<section class="tr-pane is-a" data-kind="req"><div class="tr-head"><b>1안</b> KSIS-A 요구사항<span>1차 검토본(main) : 기존 B 탭을 참고해 A · B 를 맞춤, 높이 20px</span><a href="${u2a}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u2a}" title="1안 KSIS-A"></iframe></div></section>
	<section class="tr-pane is-b" data-kind="req"><div class="tr-head"><b>1안</b> KSIS-B 요구사항<span>1안의 B 색(초록)</span><a href="${u2b}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u2b}" title="1안 KSIS-B"></iframe></div></section>

	<section class="tr-pane is-a" data-kind="req"><div class="tr-head"><b>2안</b> KSIS-A 요구사항<span>사내 다른 시스템의 책갈피 탭(탭 그림 · CSS 에서 따 옴), 높이 32px</span><a href="${u3a}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u3a}" title="2안 KSIS-A"></iframe></div></section>
	<section class="tr-pane is-b" data-kind="req"><div class="tr-head"><b>2안</b> KSIS-B 요구사항<span>2안의 B 색(초록)</span><a href="${u3b}" target="_blank" rel="noopener">새 창 ↗</a></div><div class="tr-body"><iframe src="${u3b}" title="2안 KSIS-B"></iframe></div></section>

	<section class="tr-pane is-a is-empty"><div class="tr-head"><b>3안</b> KSIS-A 요구사항<span>준비 중</span></div><div class="tr-body"><p>3안 설명을 받으면 이 칸에 넣습니다.</p></div></section>
	<section class="tr-pane is-b is-empty"><div class="tr-head"><b>3안</b> KSIS-B 요구사항<span>준비 중</span></div><div class="tr-body"><p>3안 설명을 받으면 이 칸에 넣습니다.</p></div></section>
</main>

<script>
(function () {
	"use strict";
	var main = document.getElementById("trMain");
	var modeSel = document.getElementById("trMode");
	var countSel = document.getElementById("trCount");
	var widthSel = document.getElementById("trWidth");
	try {
		modeSel.value = localStorage.getItem("trMode") || "two";
		countSel.value = localStorage.getItem("trCount") || "4";
		widthSel.value = localStorage.getItem("trWidth") || "1600";
	} catch (e) { }
	function setMode() { main.className = "ds-tabrev mode-" + modeSel.value; }
	setMode();
	// 화면 폭 : 칸 안 화면을 실제 크기 그대로 그 폭으로 열고, 칸보다 넓으면 왼쪽부터 보인다(가로로 밀어 오른쪽 확인)
	function setWidth() {
		var w = parseInt(widthSel.value, 10);
		Array.prototype.forEach.call(document.querySelectorAll(".tr-pane iframe"), function (f) { f.style.width = w ? w + "px" : "100%"; });
	}
	setWidth();
	widthSel.onchange = function () { setWidth(); try { localStorage.setItem("trWidth", widthSel.value); } catch (e) { } };
	modeSel.onchange = function () { setMode(); try { localStorage.setItem("trMode", modeSel.value); } catch (e) { } };
	countSel.onchange = function () {
		try { localStorage.setItem("trCount", countSel.value); } catch (e) { }
		Array.prototype.forEach.call(document.querySelectorAll(".tr-pane iframe"), function (f) { f.contentWindow.location.reload(); });
	};

	// 칸마다 : 좌측 소메뉴를 차례로 눌러 탭을 띄우고, 두 번째 탭을 보는 탭으로
	var HOW = {
		"orig-a": { menu: ".menu-sub .menu-item > .menu-link", tab: ".tab-item-nav" },
		"orig-b": { menu: ".sidebar-subitem", tab: ".tab-item" },
		"req": { menu: ".k-menu-item", tab: ".k-tab" }
	};
	function openTabs(frame, how) {
		var doc = frame.contentDocument;
		if (!doc) return;
		var items = Array.prototype.slice.call(doc.querySelectorAll(how.menu), 0, parseInt(countSel.value, 10));
		var i = 0;
		(function next() {
			if (i < items.length) { items[i++].click(); setTimeout(next, 60); return; }
			var tabs = doc.querySelectorAll(how.tab);
			if (tabs.length > 1) tabs[1].click();
		})();
	}
	Array.prototype.forEach.call(document.querySelectorAll(".tr-pane[data-kind]"), function (pane) {
		var frame = pane.querySelector("iframe");
		frame.addEventListener("load", function () { setTimeout(function () { openTabs(frame, HOW[pane.dataset.kind]); }, 300); });
	});
})();
</script>
</body>
</html>
