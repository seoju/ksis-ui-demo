<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ② KSIS-B 원래 — 버튼. app.css .btn / .btn-primary / .btn-edit / .btn-danger / .btn-outline --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
<style>
	/* 시연용 : app.css 의 :hover · :active 규칙을 그대로 클래스에 붙여 나란히 보여 준다 */
	.btn-primary.is-hover { background-color: var(--color-primary-hover); }
	.btn-edit.is-hover { background-color: #1F4EC0; }
	.btn-danger.is-hover { background-color: var(--color-danger-hover); }
	.btn-outline.is-hover { background-color: #F5F5F5; }
	.btn.is-press { transform: translateY(1px); }
</style>
</head>
<body style="background:#fff">
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>19·20~23번</b> .btn : 안쪽 9px 18px · 모서리 8 · 14px 굵게(700) · 폭은 글자만큼</p>
		<div class="demo-line">
			<button type="button" class="btn btn-primary">조회</button>
			<button type="button" class="btn btn-primary">작성</button>
			<button type="button" class="btn btn-primary">신규</button>
			<button type="button" class="btn btn-edit">수정</button>
			<button type="button" class="btn btn-danger">삭제</button>
			<button type="button" class="btn btn-outline">초기화</button>
			<button type="button" class="btn btn-outline">취소</button>
		</div>
		<p class="demo-tip">작은 버튼 .btn-sm(13px) ↓</p>
		<div class="demo-line" style="margin-top:6px">
			<button type="button" class="btn btn-outline btn-sm">엑셀 다운로드</button>
			<button type="button" class="btn btn-primary btn-sm">저장</button>
			<button type="button" class="btn btn-blue btn-sm">SAP 매출 실적 업로드</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>24·25번</b> 평소 → 마우스 올림 → 누르는 동안</p>
		<table style="border-collapse:collapse">
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">주</td>
				<td style="padding:4px"><button type="button" class="btn btn-primary">조회</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-primary is-hover demo-force-hover">조회</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-primary is-hover is-press demo-force-hover">조회</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">수정</td>
				<td style="padding:4px"><button type="button" class="btn btn-edit">수정</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-edit is-hover demo-force-hover">수정</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-edit is-hover is-press demo-force-hover">수정</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">삭제</td>
				<td style="padding:4px"><button type="button" class="btn btn-danger">삭제</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-danger is-hover demo-force-hover">삭제</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-danger is-hover is-press demo-force-hover">삭제</button></td></tr>
			<tr><td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">보조</td>
				<td style="padding:4px"><button type="button" class="btn btn-outline">취소</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-outline is-hover demo-force-hover">취소</button></td>
				<td style="padding:4px"><button type="button" class="btn btn-outline is-hover is-press demo-force-hover">취소</button></td></tr>
			<tr><td></td><td class="demo-tip" style="text-align:center">평소</td><td class="demo-tip" style="text-align:center">올림</td><td class="demo-tip" style="text-align:center">누름(1px 아래)</td></tr>
		</table>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>26번</b> 비활성 : 흐리게(40%) + 금지 커서</p>
		<div class="demo-line">
			<button type="button" class="btn btn-primary" disabled>저장</button>
			<button type="button" class="btn btn-danger" disabled>삭제</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>27번</b> Enter = 화면의 기본 실행 버튼(enterKey.js). 확인 창은 브라우저 기본 confirm()</p>
		<div class="demo-line">
			<button type="button" class="btn btn-outline" onclick="alert('저장했습니다.')">알림 열기</button>
			<button type="button" class="btn btn-danger" onclick="if (confirm('선택한 문서 2건을 삭제하시겠습니까?')) alert('삭제했습니다.')">삭제</button>
		</div>
	</div>
</div>
</body>
</html>
