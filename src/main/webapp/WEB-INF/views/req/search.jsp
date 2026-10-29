<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 검색 영역 · 입력칸 [비교표 38~42번] --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>38 · 42번</b> 검색 영역 : 회색 상자 46px 한 줄 · [모드 버튼] · 조건 · [검색] [해제] · 같은 것끼리 6px(라벨 ↔ 입력칸, 날짜 ~ 날짜, [검색] ↔ [해제]) · 다른 것끼리 12px(입력칸 → 다음 라벨, 마지막 입력칸 → [검색])</p>
		<div class="k-search">
			<div class="k-seg" data-name="region">
				<button type="button" class="k-seg-btn selected" data-value="KR">국내</button>
				<button type="button" class="k-seg-btn" data-value="OV">해외</button>
			</div>
			<label>매출 기간</label>
			<span class="k-date"><input type="text" class="k-input" name="fromDate" value="20260901"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<span class="k-tilde">~</span>
			<span class="k-date"><input type="text" class="k-input" name="toDate" value="2026.10.26"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<label>고객사</label>
			<select class="k-select" name="customer" data-empty>
				<option value="HMC">현대자동차</option><option value="KIA">기아</option><option value="MOBIS">현대모비스</option><option value="HMMA">HMMA</option><option value="KAGA">KaGA</option>
			</select>
			<label>K품번</label>
			<input type="text" class="k-input" name="kPart">
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
		<p class="demo-tip">버튼은 30px · 아이콘 없음 · 2글자. 이전/다음은 32번(표 아래 번호 페이지)을 따르므로 검색 영역에는 두지 않았다.</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 좁은 창 : 줄바꿈 없이 라벨 · 버튼 · 모드 버튼은 그대로, 입력칸만 줄어듦(최소 84px)</p>
		<div class="k-search" style="width:620px">
			<div class="k-seg">
				<button type="button" class="k-seg-btn selected" data-value="B">기본</button>
				<button type="button" class="k-seg-btn" data-value="U">상위포함</button>
			</div>
			<label>고객사</label>
			<select class="k-select"><option value="">전체</option><option>현대자동차</option><option>기아</option></select>
			<label>K품번</label>
			<input type="text" class="k-input">
			<label>고객품번</label>
			<input type="text" class="k-input">
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>39번</b> 입력칸 : 평소 · 누름(주색 테두리 + 3px 연한 빛) · 틀린 값</p>
		<div class="demo-line">
			<input type="text" class="k-input" value="평소" style="width:160px">
			<input type="text" class="k-input demo-focus" value="누른 상태" style="width:160px">
			<input type="text" class="k-input invalid" value="틀린 값" style="width:160px">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>40번</b> 드롭다운 : 닫힌 상자는 B 모양 · 펼친 목록은 모서리 둥글게 + 그림자 · 올린 줄 = 주색 + 흰 글자 · 더미 선택지 · 회색 안내 글 없음(고르기 전엔 빈 상자, "전체"는 진짜 선택지)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:190px">
			<select class="k-select" id="demoSelOpen" data-empty style="width:220px">
				<option>2026 상반기 중장기 매출</option><option>2026 하반기 중장기 매출</option><option>2027 중장기 매출</option><option>2028 중장기 매출</option>
			</select>
			<select class="k-select" style="width:160px"><option>현대자동차</option><option selected>기아</option><option>현대모비스</option></select>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>41번</b> 날짜 : 20261026 · 2026-10-26 · 2026.10.26 · 2026/10/26 모두 같은 날 → 칸을 떠나면 2026-10-26, 서버 값 20261026 · 그 달에 없는 일은 마지막 날로(2025-02-30 → 02-28, 2024-02-30 → 02-29, 2026-04-31 → 04-30) · Tab 은 달력 버튼에 멈추지 않음 · 달력 버튼은 입력칸 안 오른쪽 끝(20px)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:300px">
			<span class="k-date" id="demoDateOpen"><input type="text" class="k-input" value="2026/10/26"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<span class="k-tilde" style="line-height:30px">~</span>
			<span class="k-date"><input type="text" class="k-input"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<input type="text" class="k-input" style="width:120px">
			<span class="demo-tip" id="demoDateVal" style="margin:7px 0 0 8px"></span>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>42번</b> 모드 버튼 : 2단 · 3단 (고른 쪽 = 주색 + 흰 글자, 한 번 클릭으로 바뀜)</p>
		<div class="demo-line">
			<div class="k-seg"><button type="button" class="k-seg-btn selected" data-value="ERP">ERP</button><button type="button" class="k-seg-btn" data-value="KPDM">KPDM</button></div>
			<div class="k-seg n3"><button type="button" class="k-seg-btn" data-value="D">일</button><button type="button" class="k-seg-btn selected" data-value="M">월</button><button type="button" class="k-seg-btn" data-value="Y">년</button></div>
		</div>
	</div>
</div>
<style>
	/* 시연용 : 누른 모양을 클릭 없이 보여 줌(같은 규칙) */
	.k-input.demo-focus { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
</style>
<script>
document.addEventListener('DOMContentLoaded', function () {
	var v = document.getElementById('demoDateVal');
	var inp = document.querySelector('#demoDateOpen input');
	function show() { v.textContent = '서버로 보낼 값 : ' + (ksis.date.value(inp) || '(없음)'); }
	inp.addEventListener('change', show); inp.addEventListener('blur', show); show();
	// 처음에 펼친 모양을 보여 준다(바깥을 누르면 닫힘)
	if (location.hash !== '#closed') {
		document.querySelector('#demoSelOpen').parentNode.querySelector('.k-select-box').click();
		document.querySelector('#demoDateOpen .k-date-btn').click();
	}
});
</script>
</body>
</html>
