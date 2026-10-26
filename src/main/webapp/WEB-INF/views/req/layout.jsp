<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 전체 틀 [비교표 1~18번]. KSIS-A 의 main.jsp + leftMenu.jsp 자리에 들어갈 마크업 --%>
<!DOCTYPE html>
<html lang="ko" data-theme="${theme}">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
<script src="<c:url value='/ksis-ui/js/ksis-layout.js'/>"></script>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="k-shell">

	<%-- [1번] 전체 폭 상단 가로바 : ≡ · 시스템명 | 가운데 사번 + 문구 | 오른쪽 없음
	     A : 사번 · 접속권한 · 직급(문구 2개). B : 조직도 정보 없이 사번으로 권한만 정하므로 직급을 몰라 문구 1개 --%>
	<header class="k-header">
		<div class="k-header-left">
			<button type="button" class="k-hamburger" title="메뉴 열기/닫기"><span></span><span></span><span></span></button>
			<div class="k-logo" title="처음 화면으로 이동">
				<span class="k-logo-name">${sysName}</span>
				<span class="k-logo-full">${sysFull}</span>
			</div>
		</div>
		<div class="k-user-badge">K123456 ${theme == 'b' ? '일반 담당자' : '영업인원 - WG장'}</div>
	</header>

	<div class="k-body">
		<%-- [3·8·11번] 좌측 메뉴 : 2단계, 아이콘 없음, ＋/－ 와 ㄴ. [12·13번] 메뉴 검색 · 즐겨찾기 없음 --%>
		<nav class="k-sidebar" aria-label="메뉴">
			<div class="k-menu">
				<c:forEach var="g" items="${menus}">
					<div class="k-menu-group">
						<button type="button" class="k-menu-group-header" data-group="${g.key()}" aria-expanded="false">
							<span class="k-menu-toggle">＋</span><span>${g.title()}</span>
						</button>
						<div class="k-submenu">
							<c:forEach var="m" items="${g.items()}">
								<a class="k-menu-item" data-path="${m.path()}" data-title="${m.title()}">${m.title()}</a>
							</c:forEach>
						</div>
					</div>
				</c:forEach>
			</div>
		</nav>

		<div class="k-workspace">
			<%-- [14번] 화면 탭 줄(2안 : 가로바 아래 40px 줄, 책갈피 탭. 탭이 없으면 줄도 없음) --%>
			<div class="k-tabbar" role="tablist"></div>
			<%-- [6번] 본문 : 흰 영역이 꽉 채움 --%>
			<main class="k-content">
				<div class="k-main-home">메인 화면 · 좌측 메뉴에서 소메뉴를 눌러 탭을 열어 보세요(최대 10개)</div>
			</main>
		</div>
	</div>
</div>

<%-- 탭 하나에 그려 넣을 업무 화면 예시(제목 줄 · 검색 영역 · 표) --%>
<template id="screenTpl">
	<div class="k-card">
		<div class="k-toolbar">
			<h2 class="k-page-title" data-slot="title"></h2>
			<div class="k-count-box"><span>총 ${fn:length(rows)}건</span><span class="k-count-sub">1~${fn:length(rows)} (페이지 1 / 1)</span></div>
			<div class="k-toolbar-actions">
				<button type="button" class="k-btn k-btn-primary">작성</button>
				<button type="button" class="k-btn k-btn-ghost">엑셀 다운</button>
			</div>
		</div>
		<div class="k-search">
			<label>고객사</label>
			<select class="k-select" data-placeholder="전체" style="width:150px">
				<option>현대자동차</option><option>기아</option><option>현대모비스</option>
			</select>
			<label>품번</label>
			<input type="text" class="k-input" style="width:200px">
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
		<div class="k-grid-wrap">
			<table class="k-grid app-grid">
				<colgroup><col style="width:60px"><col style="width:16%"><col style="width:16%"><col><col style="width:12%"><col style="width:14%"><col style="width:12%"></colgroup>
				<thead><tr><th>No</th><th>K품번</th><th>고객품번</th><th>고객사</th><th>차종</th><th>수량</th><th>등록일</th></tr></thead>
				<tbody>
				<c:forEach var="r" items="${rows}">
					<tr><td>${r.no}</td><td>${r.kPart}</td><td>${r.custPart}</td><td class="left">${r.customer}</td><td>${r.carType}</td><td class="num">${r.qty}</td><td>${r.date}</td></tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
ksis.layout.init({
	// 소메뉴를 눌러 탭 화면을 새로 만들 때(KSIS-A 는 여기서 화면 JSP 를 불러와 넣는다)
	open: function (path, title, view) {
		view.appendChild(document.getElementById('screenTpl').content.cloneNode(true));
		view.querySelector('[data-slot="title"]').textContent = title;
	}
});
</script>
</body>
</html>
