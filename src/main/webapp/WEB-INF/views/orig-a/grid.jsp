<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%--
  ① KSIS-A 원래 — 그리드. designtemplate/list.jsp · list.js 와 같은 방식 : biz.ui.grid.init(Tabulator) + table-card-v2.
  원래는 서버 페이지(paginationMode remote)인데 여기서는 같은 표를 로컬 데이터로 그린다(paginationMode local).
--%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="work-wrap-v2 demo-page" style="padding-left:0">

	<div class="demo-sec">
		<p class="demo-h"><b>28~36번</b> Tabulator 목록 : 행 클릭 = 그 한 행 선택 · 칸 선택 · 복사 없음 · 머리글 경계를 끌어 열 폭 · 아래 번호 페이지(20/50/100)</p>
		<div class="table-card-v2">
			<div class="table-toolbar-v2">
				<div class="table-toolbar-left-v2">
					<span class="table-title-v2">품번별 매출 실적</span>
					<span class="count-badge-v2">${fn:length(rows)}건</span>
				</div>
				<div class="table-toolbar-right-v2">
					<button type="button" class="page-btn btn-ghost"><i class="fa-regular fa-file-excel"></i> Excel</button>
				</div>
			</div>
			<div class="table-inner-wrap">
				<div id="aGrid"></div>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>30 · 37번</b> 편집 표(Tabulator editor) : 칸을 누르면 파란 1.5px 테두리 + 연노랑 바탕 · Ctrl+V 여러 행 붙여넣기 없음</p>
		<div class="table-card-v2">
			<div class="table-inner-wrap">
				<div id="aEdit"></div>
			</div>
		</div>
	</div>
</div>
</div>

<script>
var ROWS = ${rowsJson};
function esc(cell) { return $('<i>').text(cell.getValue() == null ? '' : cell.getValue()).html(); }

biz.ui.grid.init('#aGrid', {
	columns: [
		{ field: 'no', title: 'No', width: 60, hozAlign: 'center' },
		{ field: 'kPart', title: 'K품번', width: 130, hozAlign: 'center', formatter: function (c) { return '<a href="#" class="grid_link">' + esc(c) + '</a>'; } },
		{ field: 'custPart', title: '고객품번', width: 130, hozAlign: 'center', formatter: esc },
		{ field: 'customer', title: '고객사', width: 120, hozAlign: 'left', formatter: esc },
		{ field: 'carType', title: '차종', width: 80, hozAlign: 'center', formatter: esc },
		{ field: 'item', title: '품목', minWidth: 140, hozAlign: 'left', formatter: esc },
		{ field: 'qty', title: '수량', width: 90, hozAlign: 'right', formatter: esc },
		{ field: 'amount', title: '금액', width: 120, hozAlign: 'right', formatter: esc },
		{ field: 'owner', title: '담당', width: 80, hozAlign: 'center', formatter: esc },
		{ field: 'date', title: '등록일', width: 110, hozAlign: 'center', formatter: esc }
	],
	data: ROWS,
	layout: 'fitColumns',
	paginationMode: 'local',
	sortMode: 'local',
	height: '520px',
	showControls: false,
	onRowClick: function (e, row) {
		if ($(e.target).hasClass('grid_link')) { e.preventDefault(); biz.showAlert('K품번 ' + row.getData().kPart + ' 상세 화면을 엽니다(시연).'); }
	}
});

biz.ui.grid.init('#aEdit', {
	columns: [
		{ field: 'kPart', title: 'K품번', width: 150, hozAlign: 'center', editor: 'input' },
		{ field: 'item', title: '품목', minWidth: 140, hozAlign: 'left', editor: 'input' },
		{ field: 'y2027', title: '2027', width: 120, hozAlign: 'right', editor: 'number', validator: 'numeric' },
		{ field: 'y2028', title: '2028', width: 120, hozAlign: 'right', editor: 'number', validator: 'numeric' },
		{ field: 'y2029', title: '2029', width: 120, hozAlign: 'right', editor: 'number', validator: 'numeric' }
	],
	data: ROWS.slice(0, 5).map(function (r, i) { return { kPart: r.kPart, item: r.item, y2027: (i + 1) * 1000 + 20, y2028: (i + 1) * 1000 + 30, y2029: (i + 1) * 1000 + 40 }; }),
	layout: 'fitColumns',
	pagination: false,
	selectable: false,
	showControls: false
});
</script>
</body>
</html>
