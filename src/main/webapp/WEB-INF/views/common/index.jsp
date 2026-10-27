<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body class="ds-index">
<div class="ds-index-wrap">
	<h1>KSIS UI 통일 시연</h1>
	<p class="lead">KSIS A·B 비교표(49행)의 결론을 화면 영역별로 보여 준다. 영역마다 4칸을 나란히 놓는다.</p>
	<ol class="ds-variants">
		<c:forEach var="v" items="${variants}">
			<li class="${v.theme == null ? 'is-orig' : 'is-req'}"><b>${v.label}</b><span>${v.source}</span></li>
		</c:forEach>
	</ol>
	<p class="note">③과 ④는 같은 JSP · 같은 <code>ksis-common.css</code> · 같은 JS 를 쓰고, 색 테마 파일(<code>ksis-theme-a.css</code> / <code>ksis-theme-b.css</code>) 한 줄만 다르다.
		색 말고 다른 것은 시스템 이름 글자(KSIS-A · Advanced / KSIS-B · Bridge + 빌드버전), 가로바 사번 옆 문구(A 2개 / B 1개), 업무 팝업의 전체 화면 버튼(B만)뿐이다.</p>

	<div class="ds-cards">
		<a class="ds-card is-summary" href="<c:url value='/summary'/>">
			<span class="range">0번</span>
			<b>비교표 및 요구사항 요약</b>
			<span>비교표 49행 전체를 영역별로 묶고, 행마다 요약 · 원래 모습 · 요구사항을 한 표로</span>
		</a>
		<c:forEach var="a" items="${areas}">
			<a class="ds-card" href="<c:url value='/compare/${a.key}'/>">
				<span class="range">${a.range}</span>
				<b>${a.title}</b>
				<span>${a.summary}</span>
			</a>
		</c:forEach>
		<a class="ds-card is-design" href="<c:url value='/design'/>">
			<b>디자인 검토</b>
		</a>

	</div>

	<h2>KSIS-A 에 옮길 파일</h2>
	<table class="ds-files">
		<tr><th>CSS</th><td><code>ksis-ui/css/ksis-theme-a.css</code> → <code>ksis-ui/css/ksis-common.css</code> 순서로 includeCSS.jsp 에 추가</td></tr>
		<tr><th>JS</th><td><code>ksis-dialog.js</code> · <code>ksis-modal.js</code> · <code>ksis-select.js</code> · <code>ksis-date.js</code> · <code>ksis-file.js</code>(파일 업로드) · <code>ksis-layout.js</code>(메인 틀) ·
			그리드 화면에 <code>ksis-grid-select.js</code> · <code>ksis-grid-paste.js</code> · <code>ksis-grid-resize.js</code> · <code>ksis-grid-pager.js</code></td></tr>
		<tr><th>화면 예시</th><td><code>WEB-INF/views/req/*.jsp</code> — 영역별 요구사항 화면의 마크업. 클래스 이름은 모두 <code>k-</code> 로 시작해 기존 화면과 겹치지 않는다</td></tr>
		<tr><th>원래 화면</th><td><code>WEB-INF/views/orig-a</code> · <code>orig-b</code> 와 <code>/orig-a</code> · <code>/orig-b</code> 폴더는 비교용 복사본이다. 옮기지 않는다</td></tr>
	</table>
</div>
</body>
</html>
