<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 그리드 [비교표 28~37번]. 목록 표는 <table class="k-grid app-grid">, 입력 표는 <table class="k-grid data-grid"> --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
<%-- 그리드 기능은 KSIS-B 의 .js 를 그대로 옮긴 파일들 --%>
<script src="<c:url value='/ksis-ui/js/ksis-grid-select.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-paste.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-resize.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-pager.js'/>"></script>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>28~36번</b> 목록 표 : 칸 클릭 = 활성 칸 · 끌어서 영역 선택 · Ctrl+C 복사 · 방향키 / Shift / Ctrl 이동 · 머리글 오른쪽 끝을 끌어 열 폭 조절 · 아래 번호 페이지</p>
		<div class="k-toolbar">
			<h2 class="k-page-title">품번별 매출 실적</h2>
			<div class="k-count-box" id="listCount"></div>
			<div class="k-toolbar-actions">
				<button type="button" class="k-btn k-btn-ghost">엑셀 다운</button>
			</div>
		</div>
		<div class="k-grid-wrap">
			<table class="k-grid app-grid" id="listGrid">
				<colgroup>
					<col style="width:60px"><col style="width:130px"><col style="width:130px"><col style="width:120px">
					<col style="width:80px"><col><col style="width:90px"><col style="width:120px"><col style="width:80px"><col style="width:110px">
				</colgroup>
				<thead><tr>
					<th>No<span class="col-resizer"></span></th><th>K품번<span class="col-resizer"></span></th><th>고객품번<span class="col-resizer"></span></th>
					<th>고객사<span class="col-resizer"></span></th><th>차종<span class="col-resizer"></span></th><th>품목<span class="col-resizer"></span></th>
					<th>수량<span class="col-resizer"></span></th><th>금액<span class="col-resizer"></span></th><th>담당<span class="col-resizer"></span></th><th>등록일<span class="col-resizer"></span></th>
				</tr></thead>
				<tbody>
				<c:forEach var="r" items="${rows}">
					<tr>
						<td>${r.no}</td>
						<%-- [36번] 눌러서 무언가 열리는 칸에만 손가락 커서 --%>
						<td class="k-clickable" data-open="${r.kPart}">${r.kPart}</td>
						<td>${r.custPart}</td><td class="left">${r.customer}</td><td>${r.carType}</td><td class="left">${r.item}</td>
						<td class="num">${r.qty}</td><td class="num">${r.amount}</td><td>${r.owner}</td><td>${r.date}</td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
		<div id="listPager"></div>
		<p class="demo-tip">파란(초록) 글자 K품번 칸만 손가락 커서 — 누르면 상세가 열리는 칸. 나머지 칸은 누르면 활성 칸만 된다.</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>30 · 37번</b> 입력 표 : 칸을 누르면 주색 테두리 + 연노랑 바탕 · 엑셀에서 여러 줄을 복사해 Ctrl+V(행 수가 다르면 확인 창) · Tab 으로 옆 칸 · 빨간 테두리 = 검증 실패</p>
		<div class="k-grid-wrap">
			<textarea id="editGridPasteCatcher" class="grid-paste-catcher" tabindex="-1"></textarea>
			<table class="k-grid data-grid" id="editGrid">
				<colgroup><col style="width:60px"><col style="width:150px"><col><col style="width:120px"><col style="width:120px"><col style="width:120px"></colgroup>
				<thead><tr><th>No</th><th>K품번</th><th>품목</th><th>2027</th><th>2028</th><th>2029</th></tr></thead>
				<tbody>
				<c:forEach var="i" begin="0" end="4">
					<tr>
						<td>${i + 1}</td>
						<td class="k-edit"><input class="grid-cell-input" data-row="${i}" data-col="0" value="${rows[i].kPart}"></td>
						<td class="k-edit"><input class="grid-cell-input" data-row="${i}" data-col="1" value="${rows[i].item}" style="text-align:left"></td>
						<c:forEach var="c" begin="2" end="4">
							<td class="k-edit"><input class="grid-cell-input${i == 2 && c == 3 ? ' invalid' : ''}" data-row="${i}" data-col="${c}" value="${i == 2 && c == 3 ? '12,3x' : (i + 1) * 1000 + c * 10}" style="text-align:right"></td>
						</c:forEach>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>32 · 33번 KSIS-B 메모</b> 데이터형 표(숫자 많은 표)는 32px · 12px 유지 → table.k-grid.k-grid-dense. 번호 페이지(32번)는 문서형 표만 — 데이터형은 한 화면에 1만 건씩 띄우는 메뉴가 있어 페이지 넘기기 없음</p>
		<table class="k-grid app-grid k-grid-dense" style="width:640px">
			<thead><tr><th>구분</th><th>2026</th><th>2027</th><th>2028</th><th>2029</th></tr></thead>
			<tbody>
				<tr><td>판매 계획</td><td class="num">12,000</td><td class="num">13,500</td><td class="num">14,100</td><td class="num">15,800</td></tr>
				<tr><td>수주 잔고</td><td class="num">8,200</td><td class="num">9,050</td><td class="num">9,900</td><td class="num">10,400</td></tr>
				<tr><td>매출 실적</td><td class="num">11,430</td><td class="num">-</td><td class="num">-</td><td class="num">-</td></tr>
			</tbody>
		</table>
	</div>
</div>

<script>
(function () {
	var list = document.getElementById('listGrid');
	// [32번] 번호 페이지(A 방식). 지금 쪽의 행만 남기므로 방향키 이동도 이 쪽 안에서만
	ksisGrid.pager(list, { pagerEl: document.getElementById('listPager'), sizes: [20, 50, 100], countBox: document.getElementById('listCount') });
	// [31번] 열 폭 조절(폭은 기억하지 않음)
	columnResizeInterop.register(list, null);
	// [36번] 눌러서 여는 칸
	list.addEventListener('click', function (e) {
		var td = e.target.closest('td.k-clickable');
		if (td) ksis.showAlert('K품번 ' + td.dataset.open + ' 상세 화면을 엽니다(시연).');
	});

	// [30번] 입력 표 붙여넣기 · Tab — KSIS-B gridPaste.js 그대로, .NET 대신 ksisGrid.pasteTarget
	var edit = document.getElementById('editGrid');
	gridPasteInterop.register('editGrid', ksisGrid.pasteTarget(edit));
})();
</script>
</body>
</html>
