<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 0번 비교표 및 요구사항 요약. 비교표 49행(requirements.json)을 영역별로 묶어 한 화면에 보여 준다 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>비교표 및 요구사항 요약 · KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body>
<header class="ds-top">
	<a class="ds-brand" href="<c:url value='/'/>">KSIS UI 통일 시연</a>
	<nav class="ds-areas" aria-label="영역">
		<a href="<c:url value='/summary'/>" class="on">비교표 요약<small>0번</small></a>
		<c:forEach var="a" items="${areas}">
			<a href="<c:url value='/compare/${a.key}'/>">${a.title}<small>${a.range}</small></a>
		</c:forEach>
	</nav>
	<div class="ds-ctrl">
		<label><input type="checkbox" id="dsBrief"> 요약만 보기</label>
	</div>
</header>

<main class="ds-summary" id="dsSummary">
	<h1>비교표 및 요구사항 요약 <small>${fn:length(reqs)}행</small></h1>
	<p class="lead">KSIS AB 비교표의 행을 화면 영역별로 묶었다. <b>요약</b> 칸은 요구사항 칸의 “요약:” 뒤 글이고, “요약:” 이 없는 행은 요구사항 첫 줄이다.
		영역 제목을 누르면 그 영역의 4칸 비교 화면으로 간다.</p>

	<div class="ds-req-wrap">
	<table class="ds-req ds-sum">
		<colgroup><col style="width:44px"><col style="width:140px"><col class="c-sum" style="width:22%"><col class="c-orig" style="width:17%"><col class="c-orig" style="width:17%"><col class="c-full"></colgroup>
		<thead><tr><th>No</th><th>항목</th><th>요약</th><th class="c-orig">KSIS-A 원래</th><th class="c-orig">KSIS-B 원래</th><th class="c-full">요구사항 전체 (B 메모는 초록 칸)</th></tr></thead>
		<c:forEach var="a" items="${areas}">
			<tbody>
			<tr class="grp"><td colspan="6"><a href="<c:url value='/compare/${a.key}'/>">${a.range} · ${a.title}</a><span>${a.summary}</span></td></tr>
			<c:forEach var="r" items="${reqs}">
				<c:if test="${r.area() == a.key}">
				<tr>
					<td class="no">${r.no()}</td>
					<td class="item"><span>${r.category()}</span>${r.item()}</td>
					<td class="sum">${fn:escapeXml(r.summary())}</td>
					<td class="orig c-orig">${fn:escapeXml(r.aOriginal())}</td>
					<td class="orig c-orig">${fn:escapeXml(r.bOriginal())}</td>
					<td class="req c-full"><div class="ra">${fn:escapeXml(r.aRequirement())}</div>
						<c:if test="${not empty r.bNote()}"><div class="rb"><b>@@KSISB</b> ${fn:escapeXml(r.bNote())}</div></c:if></td>
				</tr>
				</c:if>
			</c:forEach>
			</tbody>
		</c:forEach>
	</table>
	</div>
</main>
<script>
(function () {
	var box = document.getElementById('dsBrief');
	var main = document.getElementById('dsSummary');
	try { box.checked = localStorage.getItem('dsBrief') === '1'; } catch (e) { }
	function apply() {
		main.classList.toggle('is-brief', box.checked);
		try { localStorage.setItem('dsBrief', box.checked ? '1' : '0'); } catch (e) { }
	}
	box.addEventListener('change', apply);
	apply();
})();
</script>
</body>
</html>
