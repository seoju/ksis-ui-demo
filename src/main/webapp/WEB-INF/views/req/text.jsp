<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 글자 · 제목 · 간격 [비교표 45~49번] --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>47 · 48 · 49번</b> 업무 화면 한 장 : 제목 줄 35px(제목 19px · 800 · 한 색, 오른쪽 건수 상자 두 줄 → 버튼) · 부제 없음 · 세로 간격 12px · 가로 간격 6px</p>
		<div class="k-card" style="padding-left:0;min-height:0">
			<div class="k-toolbar">
				<h2 class="k-page-title">사용자 관리</h2>
				<div class="k-count-box"><span>총 15건</span><span class="k-count-sub">1~15 (페이지 1 / 1)</span></div>
				<div class="k-toolbar-actions">
					<button type="button" class="k-btn k-btn-primary">신규</button>
					<button type="button" class="k-btn k-btn-ghost">엑셀 다운</button>
				</div>
			</div>
			<div class="k-search">
				<label>이름</label><input type="text" class="k-input" style="width:160px">
				<label>부서</label><input type="text" class="k-input" style="width:160px">
				<button type="button" class="k-btn k-btn-primary">검색</button>
				<button type="button" class="k-btn k-btn-ghost">해제</button>
			</div>
			<p class="k-desc" style="margin:0 0 12px">① 화면 안 설명글 : 12px · 보통 굵기 · #767676. 퇴사자는 목록에 나오지 않습니다. (삭제 대상)</p>
			<table class="k-grid">
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
		<p class="demo-h"><b>46번 ④</b> 빈 목록 안내 : ①과 같은 양식(12px · 보통 · #767676)</p>
		<table class="k-grid">
			<thead><tr><th>사번</th><th>이름</th><th>부서</th><th>권한</th></tr></thead>
			<tbody><tr><td colspan="4" class="k-empty">조회된 데이터가 없습니다.</td></tr></tbody>
		</table>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>45 · 46번 ⑤</b> 글자 색 · 기본 크기(정하지 않은 글은 12px · #222222)</p>
		<div style="display:grid;grid-template-columns:120px auto;gap:6px 12px;align-items:baseline">
			<span class="demo-tip" style="margin:0">제목 #1B1D1F</span><span style="color:var(--k-text-title);font-weight:700">화면 · 절 제목</span>
			<span class="demo-tip" style="margin:0">본문 #222222</span><span>크기를 정하지 않은 글(기본 12px)</span>
			<span class="demo-tip" style="margin:0">보조 #767676</span><span style="color:var(--k-text-sub)">설명 · 건수 둘째 줄</span>
			<span class="demo-tip" style="margin:0">흐림 #A6A6A6</span><span style="color:var(--k-text-muted)">입력칸 안내 글</span>
		</div>
		<p class="demo-tip">② 입력칸 아래 ※ 안내 · ③ 안내 상자 · 안내줄은 두지 않는다(꼭 알려야 하는 문구는 44번 알림 창).</p>
	</div>
</div>
</body>
</html>
