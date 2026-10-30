<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%--
  ② KSIS-B 원래 — 검색 영역 · 입력칸. SalesPerformanceSearchBar.razor · SegToggle.razor · StackPager.razor · DocumentWrite 의 날짜칸 +
  DatePickerPopup.razor 가 그리는 마크업 그대로(app.css). 달력 그리기만 아래 짧은 JS 로 흉내 냈다(B 는 C# 이 그림).
--%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
</head>
<body style="background:#fff">
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>38 · 42번</b> 검색창(.data-options.search-area) : 회색 46px 한 줄 · [모드 버튼] · 조건 · [검색] [검색 해제] · 맨 오른쪽 [이전]/[다음] · 사이 8px</p>
		<div class="data-options search-area sp-search-bar">
			<div class="data-options-left sp-search-left">
				<div class="seg-stack seg-mode">
					<button type="button" class="seg-stack-btn selected">국내</button>
					<button type="button" class="seg-stack-btn">해외</button>
				</div>
				<label>매출 발생 기간</label>
				<input class="text-input" style="width:104px;" placeholder="시작 년월" value="2026-09">
				<span class="sp-search-tilde">~</span>
				<input class="text-input" style="width:104px;" placeholder="종료 년월" value="2026-10">
				<label style="margin-left:10px;">고객사</label>
				<select class="text-input" style="width:150px"><option>(고객사를 골라주세요)</option><option>현대자동차</option><option>기아</option></select>
				<label style="margin-left:10px;">K품번</label>
				<input class="text-input" style="width:150px;">
				<label class="sp-internal-check"><input type="checkbox" checked> 내부거래 제외</label>
				<button class="btn btn-primary btn-sm">검색</button>
				<button class="btn btn-outline btn-sm">검색 해제</button>
			</div>
			<div class="search-area-right">
				<div class="seg-stack">
					<button type="button" class="seg-stack-btn" disabled>← 이전</button>
					<button type="button" class="seg-stack-btn">다음 →</button>
				</div>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 좁은 창 : 줄바꿈 없이 입력칸만 줄어듦</p>
		<div class="data-options search-area" style="width:620px">
			<div class="data-options-left">
				<div class="seg-stack seg-mode">
					<button type="button" class="seg-stack-btn selected">기본</button>
					<button type="button" class="seg-stack-btn">상위포함</button>
				</div>
				<label>고객사</label>
				<select class="text-input" style="width:150px"><option>전체</option></select>
				<label style="margin-left:10px;">K품번</label>
				<input class="text-input" style="width:200px;">
				<label style="margin-left:10px;">고객품번</label>
				<input class="text-input" style="width:200px;">
				<button class="btn btn-primary btn-sm">검색</button>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>39번</b> 입력칸(.search-area .text-input) : 평소 · 누름(초록 테두리 + 3px 연초록 빛)</p>
		<div class="data-options search-area" style="background:transparent;padding-left:0">
			<div class="data-options-left">
				<input class="text-input" style="width:160px" value="평소">
				<input class="text-input demo-focus" style="width:160px" value="누른 상태">
				<input class="text-input" style="width:160px" placeholder="안내 글">
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>40번</b> 드롭다운 : 브라우저 기본 select(펼친 목록은 운영체제 모양) · 더미 선택지 "(…골라주세요)"</p>
		<div class="data-options search-area" style="background:transparent;padding-left:0">
			<div class="data-options-left">
				<select class="text-input" style="width:260px"><option>(중장기 매출 문서를 골라주세요)</option><option>2026 상반기 중장기 매출</option><option>2027 중장기 매출</option></select>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>41번</b> 날짜(작성 화면 날짜칸 + DatePickerPopup) : 글자 칸 + 초록 달력 버튼 · 버튼 아래 오른쪽 맞춤 작은 달력</p>
		<div style="width:320px;min-height:330px">
			<div class="date-input-wrap" id="bDate">
				<input class="text-input" type="text" value="2026-10-26" placeholder="예: 2025-09-30 / 20250930 / 2025.09.30">
				<button type="button" class="date-picker-btn" title="달력에서 선택" tabindex="-1">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
				</button>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>42번</b> 모드 버튼(SegToggle · SegSelect 3단)</p>
		<div class="data-options search-area" style="background:transparent;padding-left:0">
			<div class="data-options-left">
				<div class="seg-stack seg-mode"><button type="button" class="seg-stack-btn selected">ERP</button><button type="button" class="seg-stack-btn">KPDM</button></div>
				<div class="seg-stack seg-mode seg-n3"><button type="button" class="seg-stack-btn">일</button><button type="button" class="seg-stack-btn selected">월</button><button type="button" class="seg-stack-btn">년</button></div>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>50번</b> 여러 개 고르는 드롭다운 : 없음</p>
		<div style="padding:18px 16px;border:1px dashed #C9CED6;border-radius:8px;font-size:13px;color:#767676;max-width:520px;line-height:1.6">
			여러 화면이 같이 쓰는 다중 선택 드롭다운 부품이 없다.<br>
			비슷한 것은 매출 수량 피벗 조회(SalesPerformanceQuantityByPart.razor)의 필터 체크 목록뿐 : 검색 · (모두 선택) · N개 선택 · [취소] [확인]. 그 화면 안에만 있다.
		</div>
	</div>
</div>
<style>.search-area .text-input.demo-focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft); }</style>
<script>
document.querySelectorAll('.seg-mode').forEach(function (g) {
	g.addEventListener('click', function (e) {
		var b = e.target.closest('.seg-stack-btn'); if (!b) return;
		g.querySelectorAll('.seg-stack-btn').forEach(function (x) { x.classList.toggle('selected', x === b); });
	});
});
/* DatePickerPopup.razor 흉내 */
(function () {
	var wrap = document.getElementById('bDate'), input = wrap.querySelector('input'), view, sel;
	function parse(t) { var m = /^(\d{4})[-./]?(\d{1,2})[-./]?(\d{1,2})$/.exec(t.trim()); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; }
	function pad(n) { return (n < 10 ? '0' : '') + n; }
	function close() { wrap.querySelectorAll('.date-calendar-clickcatcher,.date-calendar-popup').forEach(function (x) { x.remove(); }); }
	function open() {
		close(); sel = parse(input.value); view = view || new Date((sel || new Date()).getFullYear(), (sel || new Date()).getMonth(), 1);
		var y = view.getFullYear(), mo = view.getMonth(), first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate(), t = new Date();
		var h = '<div class="date-calendar-clickcatcher"></div><div class="date-calendar-popup"><div class="date-calendar-header">' +
			'<div class="date-calendar-nav-group"><button type="button" class="date-calendar-nav-btn" data-n="-12">‹</button><span class="date-calendar-title">' + y + '년</span><button type="button" class="date-calendar-nav-btn" data-n="12">›</button></div>' +
			'<div class="date-calendar-nav-group"><button type="button" class="date-calendar-nav-btn" data-n="-1">‹</button><span class="date-calendar-title">' + (mo + 1) + '월</span><button type="button" class="date-calendar-nav-btn" data-n="1">›</button></div></div>' +
			'<table class="date-calendar-table"><thead><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr></thead><tbody><tr>';
		var c = 0; for (; c < first; c++) h += '<td class="date-calendar-empty"></td>';
		for (var d = 1; d <= days; d++, c++) {
			if (c && c % 7 === 0) h += '</tr><tr>';
			var cls = 'date-calendar-day' + (sel && sel.getFullYear() === y && sel.getMonth() === mo && sel.getDate() === d ? ' is-selected' : '') + (t.getFullYear() === y && t.getMonth() === mo && t.getDate() === d ? ' is-today' : '');
			h += '<td class="' + cls + '" data-d="' + d + '">' + d + '</td>';
		}
		while (c % 7) { h += '<td class="date-calendar-empty"></td>'; c++; }
		h += '</tr></tbody></table><div class="date-calendar-footer"><button type="button" class="date-calendar-text-btn" data-a="clear">지우기</button><button type="button" class="date-calendar-text-btn" data-a="today">오늘</button></div></div>';
		wrap.insertAdjacentHTML('beforeend', h);
	}
	function set(dt) { input.value = dt ? dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()) : ''; close(); }
	wrap.addEventListener('click', function (e) {
		var t = e.target;
		if (t.closest('.date-picker-btn')) { wrap.querySelector('.date-calendar-popup') ? close() : open(); }
		else if (t.classList.contains('date-calendar-clickcatcher')) close();
		else if (t.dataset.n) { view = new Date(view.getFullYear(), view.getMonth() + +t.dataset.n, 1); open(); }
		else if (t.dataset.d) set(new Date(view.getFullYear(), view.getMonth(), +t.dataset.d));
		else if (t.dataset.a) set(t.dataset.a === 'today' ? new Date() : null);
	});
	if (location.hash !== '#closed') open();
})();
</script>
</body>
</html>
