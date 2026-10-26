<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%--
  ① KSIS-A 원래 — 전체 틀. KSIS_A WEB-INF/views/main/main.jsp + leftMenu.jsp 마크업 그대로.
  - 탭 : KSIS_A js/application/main/main.js(TabManager) 복사본을 그대로 쓴다. 탭을 열면 $(".contens-wrap").load(url).
  - 좌측 메뉴 : leftMenu.jsp 는 /paragon/menu/accessible 을 불러 그리므로, 같은 마크업을 서버에서 그리고
    leftMenu.jsp 의 클릭 · 검색 · 즐겨찾기 탭 동작만 아래에 옮겨 왔다(서버 호출 부분만 뺌).
--%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
<style>
/* leftMenu.jsp 안의 <style> 그대로 */
.menu-sub .menu-link { padding-left: 28px !important; font-size: 13px; }
.menu-sub .menu-link i { font-size: 7px; margin-right: 8px; }
.menu-sub .menu-item { position: relative; }
.menu-sub .menu-item .menu-link { padding-right: 34px !important; }
.fav-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #c7ccd6; opacity: 0; cursor: pointer; padding: 4px 6px; font-size: 12px; transition: opacity .12s, color .12s; z-index: 2; }
.menu-sub .menu-item:hover .fav-toggle { opacity: 1; }
.fav-toggle:hover { color: #f5b301; }
.fav-toggle.on { opacity: 1; color: #f5b301; }
.lnb-toggle-btn { display: flex; align-items: center; justify-content: flex-end; width: 100%; padding: 10px 14px; background: transparent; border: none; cursor: pointer; font-size: 16px; color: inherit; box-sizing: border-box; }
.lnb-toggle-btn:hover { opacity: 0.7; }
</style>
</head>
<body class="">
	<aside id="lnb" class="lnb">
		<button class="lnb-toggle-btn" id="lnbToggleBtn" title="메뉴 펼침/닫침"><i class="fa-solid fa-bars"></i></button>
		<div class="sidebar-logo">
			<img class="brand-logo" src="<c:url value='/orig-a/images/logo.png'/>" alt="현대케피코" onerror="this.style.display='none'">
			<div class="brand-text">
				<span class="brand-title"><span class="brand-k">K</span>-SIS</span>
				<span class="brand-sub">영업정보시스템</span>
			</div>
		</div>
		<div class="sidebar-search">
			<input type="serch" id="menuSearchInput" placeholder="메뉴 검색..." readonly>
		</div>
		<div class="menu-filter-tabs" id="menuFilterTabs">
			<button class="filter-tab active" data-filter="all"><i class="fa-solid fa-bars"></i><span class="lnb-label">전체</span></button>
			<button class="filter-tab" data-filter="favorite"><i class="fa-regular fa-star"></i><span class="lnb-label">즐겨찾기</span></button>
		</div>
		<nav class="nav">
			<ul class="menu-inner" id="nav-accordion">
				<c:set var="icons" value="${fn:split('fa-solid fa-briefcase,fa-solid fa-won-sign,fa-solid fa-database,fa-solid fa-chart-column,fa-solid fa-gear', ',')}"/>
				<c:forEach var="g" items="${menus}" varStatus="gs">
					<li class="menu-item" data-menu-url="" data-menu-id="${g.key()}">
						<a href="#" class="menu-link menu-toggle"><i class="${icons[gs.index]}"></i><div>${g.title()}</div></a>
						<ul class="menu-sub">
							<c:forEach var="m" items="${g.items()}">
								<c:url var="u" value="/fragment/orig-a/screen"><c:param name="title" value="${m.title()}"/></c:url>
								<li class="menu-item" data-menu-url="${u}" data-menu-id="${m.path()}">
									<a href="#" class="menu-link"><i class="fa-solid fa-circle-dot"></i><span>${m.title()}</span></a>
									<span class="fav-toggle" title="즐겨찾기 추가/해제"><i class="fa-regular fa-star"></i></span>
								</li>
							</c:forEach>
						</ul>
					</li>
				</c:forEach>
			</ul>
			<ul class="menu-inner" id="nav-favorites" style="display:none;"></ul>
		</nav>
	</aside>

	<div class="container-wrap">
		<div class="header-wrap">
			<div class="tab-nav" id="tabNav">
				<button class="tab-scroll-btn" id="tabScrollLeft" title="이전"><i class="fa-solid fa-chevron-left"></i></button>
				<div class="tab-list-wrap">
					<div class="tab-list" id="tabList"></div>
					<span class="tab-hint" id="tabHint">탭을 마우스 우클릭하여 즐겨찾기를 등록/해제할 수 있습니다</span>
				</div>
				<button class="tab-scroll-btn" id="tabScrollRight" title="다음"><i class="fa-solid fa-chevron-right"></i></button>
				<a class="close-all-tabs" id="closeAllTabs" title="전체 탭 닫기"><i class="fa-solid fa-xmark"></i> 전체닫기</a>
			</div>
			<div class="header_util">
				<div class="username-wrap" id="usernameWrap">
					<a class="username" id="username" title="프로필"><span class="avatar">홍</span></a>
					<div class="profile-dropdown" id="profileDropdown">
						<div class="pd-header">
							<div class="pd-avatar-lg">홍</div>
							<div class="pd-name">홍길동</div>
							<div class="pd-email">K123456</div>
						</div>
						<ul class="pd-footer">
							<li><span class="pd-menu-icon"><i class="fa-solid fa-right-from-bracket"></i></span>로그아웃</li>
						</ul>
					</div>
				</div>
				<span class="sect"></span>
				<a class="logout" id="logout" href="#" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></a>
			</div>
		</div>
		<div class="contens-wrap"></div>
	</div>
</body>
<script src="<c:url value='/orig-a/js/application/main.js'/>"></script>
<script>
/* leftMenu.jsp 의 setupMenuEvents · setupMenuSearch · setupFilterTabs 를 옮겨 옴(서버 호출 · 펼침 상태 저장(biz.pref)만 뺌) */
$(function () {
	MainModule.init();
	$('#lnbToggleBtn').on('click', function () { $('body').toggleClass('lnb-collapsed'); });

	$('.menu-item > .menu-link').on('click', function (e) {
		e.preventDefault();
		var menuItem = $(this).parent('.menu-item');
		var isSubMenu = menuItem.closest('.menu-sub').length > 0;
		var hasSubmenu = menuItem.find('.menu-sub').length > 0;
		if (isSubMenu) {
			TabManager.openTab(menuItem.data('menu-url'), $(this).find('span').text().trim());
			return;
		}
		if (hasSubmenu) {
			if ($('body').hasClass('lnb-collapsed')) { $('body').removeClass('lnb-collapsed'); menuItem.addClass('open'); return; }
			if (menuItem.hasClass('open')) menuItem.removeClass('open');
			else { $('.menu-item').removeClass('open').removeClass('active'); menuItem.addClass('open'); }   // 하나를 열면 나머지는 닫힘
		}
	});

	var $input = $('#menuSearchInput');
	$input.on('focus', function () { $(this).removeAttr('readonly'); });
	$input.on('input', function () {
		var keyword = ($input[0].value || '').trim().toLowerCase();
		if (!keyword) { $('.menu-item').show(); $('.menu-inner > .menu-item').removeClass('open'); return; }
		$('.menu-inner > .menu-item').each(function () {
			var any = false;
			$(this).find('.menu-sub .menu-item').each(function () {
				var hit = $(this).find('.menu-link span').text().toLowerCase().indexOf(keyword) >= 0;
				$(this).toggle(hit); any = any || hit;
			});
			$(this).toggle(any).toggleClass('open', any);
		});
	});

	$('#menuFilterTabs').on('click', '.filter-tab', function () {
		$('#menuFilterTabs .filter-tab').removeClass('active');
		$(this).addClass('active');
		var fav = $(this).data('filter') === 'favorite';
		$('#nav-accordion').toggle(!fav);
		$('#nav-favorites').toggle(fav).html(fav ? '<li class="fav-empty"><i class="fa-regular fa-star"></i><span>등록된 즐겨찾기가 없습니다.</span></li>' : '');
	});
	$('.fav-toggle').on('click', function (e) { e.stopPropagation(); $(this).toggleClass('on').find('i').toggleClass('fa-regular fa-solid'); });
});
</script>
</html>
