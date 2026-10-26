<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ② KSIS-B 원래 — 글자 · 제목 · 간격. 목록 화면(card > list-toolbar > page-title · toolbar-count-box) + .notice-text · .empty-row --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
<style>.um-hint { font-size: 12px; color: #8A8A8A; margin: 0 0 8px; } /* UserManagementPage.razor 안의 <style> */</style>
</head>
<body style="background:#fff">
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>47 · 48 · 49번</b> 제목 19px · 800 · 한 색 + 오른쪽 두 줄 건수 상자 · 부제 없음 · 제목 줄 → 검색창 8px · 사이 8 / 12px</p>
		<div class="card" style="padding-left:0">
			<div class="list-toolbar">
				<h2 class="page-title">사용자 관리</h2>
				<span class="vform-muted toolbar-count-box"><span class="toolbar-info">총 15건</span><span class="toolbar-count-sub">1~15 (페이지 1 / 1)</span></span>
				<div class="toolbar-actions"><button class="btn btn-primary btn-sm">신규</button><button class="btn btn-primary btn-sm">엑셀 다운로드</button></div>
			</div>
			<div class="data-options search-area">
				<div class="data-options-left">
					<label>이름</label><input class="text-input" style="width:160px">
					<label style="margin-left:12px;">부서</label><input class="text-input" style="width:160px">
					<button class="btn btn-primary btn-sm">검색</button>
				</div>
			</div>
			<p class="um-hint">설명글(.um-hint 12px #8A8A8A, 화면마다 다름). 퇴사자는 목록에 나오지 않습니다.</p>
			<table class="app-grid">
				<thead><tr><th>사번</th><th>이름</th><th>부서</th><th>권한</th></tr></thead>
				<tbody>
				<c:forEach var="r" items="${rows}" end="2">
					<tr><td>K12345${r.no}</td><td>${r.owner}</td><td>영업${r.no}팀</td><td>작성자</td></tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>46번</b> 빈 목록(.empty-row 14px 가운데) · 빨간 안내 문구(.notice-text 13px, 상자 없음)</p>
		<table class="app-grid">
			<thead><tr><th>사번</th><th>이름</th><th>부서</th><th>권한</th></tr></thead>
			<tbody><tr><td colspan="4" class="empty-row">조회된 데이터가 없습니다.</td></tr></tbody>
		</table>
		<p class="notice-text">권한이 없어 조회할 수 없습니다.</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>45번</b> 글자 색 : 제목 #1B1D1F · 본문 #222222 · 보조 #767676 · 흐림 #A6A6A6 · 정하지 않은 글은 브라우저 기본 16px</p>
		<div style="display:grid;grid-template-columns:120px auto;gap:6px 12px;align-items:baseline">
			<span class="demo-tip" style="margin:0">제목</span><span style="color:#1B1D1F;font-weight:700">화면 · 절 제목</span>
			<span class="demo-tip" style="margin:0">본문</span><span style="color:#222222">본문 글</span>
			<span class="demo-tip" style="margin:0">보조</span><span style="color:#767676">보조 글</span>
			<span class="demo-tip" style="margin:0">흐림</span><span style="color:#A6A6A6">흐린 글</span>
			<span class="demo-tip" style="margin:0">기본</span><span>크기를 정하지 않은 글</span>
		</div>
	</div>
</div>
</body>
</html>
