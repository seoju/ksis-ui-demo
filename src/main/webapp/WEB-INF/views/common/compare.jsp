<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 4칸 비교 화면. 각 칸은 /view/{칸}/{영역} 을 iframe 으로 부른다(칸마다 CSS 가 섞이지 않게) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${area.title} · KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body>
<header class="ds-top">
	<a class="ds-brand" href="<c:url value='/'/>">KSIS UI 통일 시연</a>
	<nav class="ds-areas" aria-label="영역">
		<a href="<c:url value='/summary'/>">비교표 요약<small>0번</small></a>
		<c:forEach var="a" items="${areas}">
			<a href="<c:url value='/compare/${a.key}'/>" class="${a == area ? 'on' : ''}">${a.title}<small>${a.range}</small></a>
		</c:forEach>
		<a href="<c:url value='/tabs'/>">탭 검토<small>14번</small></a>
		<a href="<c:url value='/sidebar'/>">좌측 메뉴 색<small>11번</small></a>
	</nav>
	<div class="ds-ctrl">
		<label>보기
			<select id="dsMode">
				<option value="grid">2×2</option>
				<option value="row">가로 4칸</option>
				<option value="one">한 칸씩 크게</option>
			</select>
		</label>
		<label>화면 폭
			<select id="dsWidth">
				<option value="1920">1920px 화면</option>
				<option value="1600">1600px 화면</option>
				<option value="1366">1366px 노트북</option>
				<option value="0">칸 크기 그대로</option>
			</select>
		</label>
	</div>
</header>

<main class="ds-main" id="dsMain" data-area="${area.key}" data-default-width="${area.key == 'layout' || area.key == 'popup' ? 1600 : 0}">
	<div class="ds-tabs" id="dsTabs" hidden>
		<c:forEach var="v" items="${variants}" varStatus="s">
			<button type="button" data-pane="${s.index}" class="${s.first ? 'on' : ''}">${v.label}</button>
		</c:forEach>
	</div>
	<div class="ds-panes mode-grid" id="dsPanes">
		<c:forEach var="v" items="${variants}" varStatus="s">
			<section class="ds-pane ${v.theme == null ? 'is-orig' : 'is-req'} ${s.first ? 'on' : ''}" data-variant="${v.key}">
				<div class="ds-pane-head">
					<b>${v.label}</b>
					<span class="ds-src">${v.source}</span>
					<span class="ds-title" title="브라우저 창 제목">창 제목 : <em>—</em></span>
					<a class="ds-open" href="<c:url value='/view/${v.key}/${area.key}'/>" target="_blank" rel="noopener">새 창 ↗</a>
				</div>
				<div class="ds-pane-body">
					<iframe src="<c:url value='/view/${v.key}/${area.key}'/>" title="${v.label}" loading="eager"></iframe>
				</div>
			</section>
		</c:forEach>
	</div>

	<section class="ds-reqs">
		<h2>이 화면에 담은 비교표 결론 <small>${area.range} · ${area.summary}</small></h2>
		<div class="ds-req-wrap">
		<table class="ds-req">
			<colgroup><col style="width:44px"><col style="width:150px"><col style="width:20%"><col style="width:20%"><col></colgroup>
			<thead><tr><th>No</th><th>항목</th><th>KSIS-A 원래</th><th>KSIS-B 원래</th><th>요구사항 (③ A · ④ B 공통, B 메모는 아래 초록 칸)</th></tr></thead>
			<tbody>
			<c:forEach var="r" items="${reqs}">
				<tr>
					<td class="no">${r.no()}</td>
					<td class="item"><span>${r.category()}</span>${r.item()}</td>
					<td class="orig">${fn:escapeXml(r.aOriginal())}</td>
					<td class="orig">${fn:escapeXml(r.bOriginal())}</td>
					<td class="req"><div class="ra">${fn:escapeXml(r.aRequirement())}</div>
						<c:if test="${not empty r.bNote()}"><div class="rb"><b>@@KSISB</b> ${fn:escapeXml(r.bNote())}</div></c:if></td>
				</tr>
			</c:forEach>
			</tbody>
		</table>
		</div>
	</section>
</main>
<script src="<c:url value='/demo/demo-shell.js'/>"></script>
</body>
</html>
