<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 검색 영역 · 입력칸. designtemplate/filter.jsp · input.jsp 와 같은 클래스(filter-bar-v2 · filter-input-v2 · form-control · fm_radio).
     50번 다중 선택 드롭박스는 공통 위젯 biz.ui.multiSelect(paragon/1.0.0/biz.ui.multiselect.js 복사본) 그대로 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 필터바(filter-bar-v2) : 흰 카드 · 모서리 12 · 그림자 · 라벨 왼쪽 · 조건 사이 구분선 · 버튼 오른쪽 끝 · 넘치면 줄바꿈</p>
		<div class="filter-bar-v2">
			<form class="filter-form-v2" onsubmit="return false;">
				<div class="filter-group-v2">
					<span class="filter-label-v2">기간</span>
					<input type="date" class="filter-input-v2" value="2026-09-01">
					<span class="filter-label-v2">~</span>
					<input type="date" class="filter-input-v2" value="2026-10-26">
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<span class="filter-label-v2">고객사</span>
					<select class="filter-input-v2"><option value="">전체</option><option>현대자동차</option><option>기아</option></select>
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<span class="filter-label-v2">K품번</span>
					<input type="text" class="filter-input-v2" placeholder="K품번 일부">
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<label class="fm_checkbox">본인 기준 조회<input type="checkbox" checked><span class="checkmark"></span></label>
				</div>
			</form>
			<div class="filter-actions-v2">
				<button type="button" class="page-btn btn-ghost"><i class="fa-solid fa-rotate"></i> 초기화</button>
				<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 좁은 창 : 줄이 바뀐다(.nowrap 을 붙이면 한 줄 고정)</p>
		<div class="filter-bar-v2" style="width:620px">
			<form class="filter-form-v2" onsubmit="return false;">
				<div class="filter-group-v2"><span class="filter-label-v2">고객사</span><select class="filter-input-v2"><option>전체</option></select></div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2"><span class="filter-label-v2">K품번</span><input type="text" class="filter-input-v2"></div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2"><span class="filter-label-v2">고객품번</span><input type="text" class="filter-input-v2"></div>
			</form>
			<div class="filter-actions-v2"><button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button></div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>39번</b> 입력칸 : 새 filter-input-v2(34px · 1.5px · #FAFAFA · 누르면 파랑) · 구형 form-control(36px · 모서리 2 · 15px)</p>
		<div class="demo-line">
			<input type="text" class="filter-input-v2" value="평소">
			<input type="text" class="filter-input-v2 demo-focus" value="누른 상태">
			<input type="text" class="form-control" value="구형 form-control" style="width:180px;flex:none">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>40번</b> 드롭다운 : select(자체 화살표) · 자동완성(jQuery UI, .custom-autocomplete 목록)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:190px">
			<select class="filter-select-v2" style="height:34px;width:200px"><option>선택하세요</option><option>2026 상반기 중장기 매출</option></select>
			<input type="text" class="filter-input-v2" id="aAuto" placeholder="고객사 두 글자" value="현대" style="width:220px">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>41번</b> 날짜 : 브라우저 기본 날짜 칸(type="date"). 달력은 브라우저가 그림 · yyyyMMdd 직접 입력 불가</p>
		<div class="demo-line">
			<input type="date" class="filter-input-v2" value="2026-10-26">
			<span>~</span>
			<input type="date" class="filter-input-v2">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>42번</b> 모드 버튼 부품 없음 → 동그라미 선택(fm_radio) · 보기 전환(seg_toggle)</p>
		<div class="demo-line">
			<div class="fm_radio_box">
				<label class="fm_radio">국내<input type="radio" name="aRegion" checked><span class="checkmark"></span></label>
				<label class="fm_radio">해외<input type="radio" name="aRegion"><span class="checkmark"></span></label>
			</div>
			<div class="seg_toggle" style="margin-left:20px">
				<button type="button" class="seg_btn on">일</button><button type="button" class="seg_btn">월</button><button type="button" class="seg_btn">년</button>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>50번</b> 다중 선택 드롭박스(biz.ui.multiSelect) : 고른 것 = 칩(줄이 넘치면 칸이 아래로 커짐) · 펼치면 찾기 칸(회색 안내 글) · 전체 선택 + N개 선택 · 체크하면 바로 반영([확인] 없음) · 출장보고 안건 품목군(업무 분류 수주 = 1개, 가격 · 개발 = 여러 개)</p>
		<div style="min-height:400px">
			<div class="demo-line" style="margin-bottom:8px">
				<span style="width:80px;font-weight:600">업무 분류</span>
				<div class="fm_radio_box" id="aBizType">
					<label class="fm_radio">수주<input type="radio" name="aBusType" value="ORD"><span class="checkmark"></span></label>
					<label class="fm_radio">가격<input type="radio" name="aBusType" value="PRI" checked><span class="checkmark"></span></label>
					<label class="fm_radio">개발<input type="radio" name="aBusType" value="DEV"><span class="checkmark"></span></label>
				</div>
			</div>
			<div class="demo-line" style="align-items:flex-start">
				<span style="width:80px;font-weight:600;line-height:38px">품목군</span>
				<div id="aGrpBox" style="width:360px"></div>
			</div>
		</div>
		<p class="demo-tip">키보드 : 닫힌 상자는 Tab 으로 갈 수 없음(div). 마우스로 펼치면 커서가 찾기 칸, Tab 으로 체크 칸을 하나씩 옮겨 Space 로 체크. ↑↓ · Enter · Esc 는 동작 없음(하나만 고를 때 동그라미끼리는 ↑↓ 가 브라우저 기본으로 옮겨 고름).</p>
	</div>
</div>
</div>
<style>.filter-input-v2.demo-focus { border-color: #0082c7; background: #FFFFFF; }</style>
<script>
$(function () {
	$('#aAuto').autocomplete({
		source: ['현대자동차', '현대모비스', '현대케피코', '현대위아', '기아'],
		minLength: 2,
		classes: { 'ui-autocomplete': 'custom-autocomplete' }
	});
	if (location.hash !== '#closed') $('#aAuto').autocomplete('search', '현대');
	$('.seg_toggle').on('click', '.seg_btn', function () { $(this).addClass('on').siblings().removeClass('on'); });
	// [50번] 출장보고 작성(bustripWrite.js initGrpWidget · applyWorkDivRule)과 같은 방법. 시연이라 서버 대신 더미 품목군을 돌려준다
	biz.ajax = biz.ajax || {};
	biz.ajax.request = function (o) { o.callback({ data: [{ value: 'G01', label: 'ECU(가솔린)' }, { value: 'G02', label: 'ECU(디젤)' }, { value: 'G03', label: 'TCU' }, { value: 'G04', label: 'BMS' }, { value: 'G05', label: 'OBC' }, { value: 'G06', label: 'LDC' }, { value: 'G07', label: 'VCU' }, { value: 'G08', label: '인젝터' }, { value: 'G09', label: '연료펌프 모듈' }, { value: 'G10', label: '산소센서' }, { value: 'G11', label: '압력센서' }, { value: 'G12', label: '점화코일' }, { value: 'G13', label: '스로틀바디' }, { value: 'G14', label: '전동식 워터펌프' }] }); };
	var grpMs = biz.ui.multiSelect($('#aGrpBox'), { url: 'demo', valueField: 'value', textField: 'label', single: false, placeholder: '선택' });
	grpMs.setValues(['G03', 'G05', 'G06', 'G07']);
	$('#aBizType').on('change', 'input', function () { grpMs.setSingle(this.value === 'ORD'); });
	if (location.hash !== '#closed') {
		$('#aGrpBox .biz-ms-box').trigger('click');
		setTimeout(function () { window.scrollTo(0, 0); }, 30); // 위젯이 찾기 칸에 커서를 넣으며 화면이 맨 아래로 굴러가므로 되돌림(시연용)
	}
});
</script>
</body>
</html>
