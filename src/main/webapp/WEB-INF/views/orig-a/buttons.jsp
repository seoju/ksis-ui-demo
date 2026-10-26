<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 버튼. 마크업은 KSIS_A WEB-INF/views/paragon/designtemplate/button.jsp 와 같은 클래스 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
<style>
	/* 시연용 : layout.css 의 :hover 규칙을 그대로 클래스에 붙여 올림 모양을 나란히 보여 준다(누름 효과는 원래 없음) */
	.page-btn.btn-primary.is-hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,130,199,0.35); }
	.page-btn.btn-outline.is-hover { background: #f0f7fc; }
	.page-btn.btn-danger.is-hover { background: #FEE2E2; }
	.page-btn.btn-ghost.is-hover { background: #E4E4E7; color: #18181B; }
</style>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">

	<div class="demo-sec">
		<p class="demo-h"><b>19·20~23번</b> .page-btn : 높이 34 · 모서리 8 · 12.5px · 500 · 폭은 글자만큼</p>
		<div class="demo-line">
			<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button>
			<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-pen-to-square"></i> 작성</button>
			<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-plus"></i> 신규</button>
			<button type="button" class="page-btn btn-outline"><i class="fa-solid fa-pen"></i> 수정</button>
			<button type="button" class="page-btn btn-danger"><i class="fa-solid fa-trash"></i> 삭제</button>
			<button type="button" class="page-btn btn-ghost"><i class="fa-solid fa-rotate"></i> 초기화</button>
			<button type="button" class="page-btn btn-ghost">취소</button>
		</div>
		<p class="demo-tip">저장 59 · 삭제 53 · 수정 23곳은 테두리 버튼(.btn-outline). 구형 .btn(36px · 모서리 3px · 15px)도 남아 있다 ↓</p>
		<div class="demo-line" style="margin-top:6px">
			<button type="button" class="page-btn btn-ghost"><i class="fa-regular fa-file-excel"></i> Excel</button>
			<button type="button" class="page-btn btn-outline"><i class="fa-solid fa-floppy-disk"></i> 저장</button>
			<button type="button" class="btn btn_primary">주기능</button>
			<button type="button" class="btn">부기능</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>24·25번</b> 평소 → 마우스 올림 → 누르는 동안</p>
		<table style="border-collapse:collapse">
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">주</td>
				<td style="padding:4px"><button type="button" class="page-btn btn-primary">조회</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-primary is-hover demo-force-hover">조회</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-primary demo-force-hover">조회</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">수정</td>
				<td style="padding:4px"><button type="button" class="page-btn btn-outline">수정</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-outline is-hover demo-force-hover">수정</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-outline demo-force-hover">수정</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">삭제</td>
				<td style="padding:4px"><button type="button" class="page-btn btn-danger">삭제</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-danger is-hover demo-force-hover">삭제</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-danger demo-force-hover">삭제</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">보조</td>
				<td style="padding:4px"><button type="button" class="page-btn btn-ghost">취소</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-ghost is-hover demo-force-hover">취소</button></td>
				<td style="padding:4px"><button type="button" class="page-btn btn-ghost demo-force-hover">취소</button></td></tr>
			<tr><td></td><td class="demo-tip" style="text-align:center">평소</td><td class="demo-tip" style="text-align:center">올림</td><td class="demo-tip" style="text-align:center">누름(효과 없음)</td></tr>
		</table>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>26번</b> 비활성 : 신규 규격에 정의 없음(브라우저 기본)</p>
		<div class="demo-line">
			<button type="button" class="page-btn btn-primary" disabled>저장</button>
			<button type="button" class="page-btn btn-ghost" disabled>비활성</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>27번</b> Enter : 공통 규칙 없음. 알림 창은 띄우기 전에 포커스를 뺀다</p>
		<div class="demo-line">
			<button type="button" class="page-btn btn-outline" id="btnAlert">알림 열기</button>
			<button type="button" class="page-btn btn-danger" id="btnConfirm"><i class="fa-solid fa-trash"></i> 삭제</button>
		</div>
	</div>
</div>
</div>
<script>
$('#btnAlert').on('click', function () { biz.showAlert('저장했습니다.'); });
$('#btnConfirm').on('click', function () { biz.showConfirm('선택한 문서 2건을 삭제하시겠습니까?', function () { biz.showAlert('삭제했습니다.'); }); });
</script>
</body>
</html>
