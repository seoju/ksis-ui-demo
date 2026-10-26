<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 버튼 [비교표 19~27번]. A 와 B 는 테마 파일만 다르다 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
<style>
	/* 시연용 : 올림 · 누름 모양을 마우스 없이 보여 주려고 같은 규칙을 클래스에 붙임 */
	.k-btn-primary.is-hover { background: var(--k-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px var(--k-primary-shadow-hover); }
	.k-btn-primary.is-press { background: var(--k-primary-press); box-shadow: 0 2px 8px var(--k-primary-shadow); }
	.k-btn-edit.is-hover { background: var(--k-primary-soft); color: var(--k-primary-hover); }
	.k-btn-edit.is-press { background: var(--k-edit-press); color: var(--k-primary-hover); }
	.k-btn-danger.is-hover { background: var(--k-danger-hover-bg); }
	.k-btn-danger.is-press { background: var(--k-danger-press-bg); }
	.k-btn-ghost.is-hover { background: var(--k-ghost-hover-bg); color: var(--k-ghost-hover-text); }
	.k-btn-ghost.is-press { background: var(--k-ghost-press-bg); color: var(--k-ghost-hover-text); }
</style>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>19·20~23번</b> 공통 규격 : 높이 34 · 모서리 8 · 12.5px · 굵기 500 · 최소 폭 66px(예전 82px 의 80%, 3글자 기준) · 버튼 안 아이콘 없음</p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-primary">조회</button>
			<button type="button" class="k-btn k-btn-primary">작성</button>
			<button type="button" class="k-btn k-btn-primary">신규</button>
			<button type="button" class="k-btn k-btn-edit">수정</button>
			<button type="button" class="k-btn k-btn-danger">삭제</button>
			<button type="button" class="k-btn k-btn-ghost">초기화</button>
			<button type="button" class="k-btn k-btn-ghost">취소</button>
		</div>
		<p class="demo-tip">글자 수가 달라도(2글자 · 3글자) 폭 66px 로 같다. 글자가 길면 그만큼 늘어난다 ↓</p>
		<div class="demo-line" style="margin-top:6px">
			<button type="button" class="k-btn k-btn-ghost">엑셀 다운</button>
			<button type="button" class="k-btn k-btn-primary">저장</button>
			<button type="button" class="k-btn k-btn-primary">확인</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>24·25번</b> 평소 → 마우스 올림 → 누르는 동안 (실제로 올리고 눌러 봐도 같다)</p>
		<table style="border-collapse:collapse">
			<tr>
				<td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">주</td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-primary">조회</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-primary is-hover demo-force-hover">조회</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-primary is-press demo-force-hover">조회</button></td>
			</tr>
			<tr>
				<td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">수정</td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-edit">수정</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-edit is-hover demo-force-hover">수정</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-edit is-press demo-force-hover">수정</button></td>
			</tr>
			<tr>
				<td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">삭제</td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-danger">삭제</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-danger is-hover demo-force-hover">삭제</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-danger is-press demo-force-hover">삭제</button></td>
			</tr>
			<tr>
				<td style="padding:4px 10px 4px 0;font-size:11px;color:#8A949F">보조</td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-ghost">취소</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-ghost is-hover demo-force-hover">취소</button></td>
				<td style="padding:4px"><button type="button" class="k-btn k-btn-ghost is-press demo-force-hover">취소</button></td>
			</tr>
			<tr>
				<td></td>
				<td class="demo-tip" style="padding:0 4px;text-align:center">평소</td>
				<td class="demo-tip" style="padding:0 4px;text-align:center">올림</td>
				<td class="demo-tip" style="padding:0 4px;text-align:center">누름</td>
			</tr>
		</table>
		<p class="demo-tip">주 버튼만 올리면 1px 떠오르고 그림자가 커진다. 누르는 동안은 떠오름이 풀린다. 나머지는 바탕만 한 단계씩 진해진다(0.15초).</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>26번</b> 비활성 버튼은 쓰지 않는다 — 불가피하면 회색</p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-primary" disabled>저장</button>
			<button type="button" class="k-btn k-btn-danger" disabled>삭제</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>27번</b> 팝업이 열릴 때 포커스(10/21 미팅 내용 정정) : ① 작성창(43번) = 첫 번째 작성 항목 · ② 알림 · 확인 창(44번) = 주 버튼(파랑 · 초록)<c:if test="${theme != 'b'}"> · ③ (KSIS-A 만) 결재자가 여는 작성창 = 확인창처럼 [승인]에 포커스 → 업무 팝업 화면에서 확인</c:if></p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-edit" id="btnOpenPop">작성창 열기</button>
			<button type="button" class="k-btn k-btn-danger" id="btnAskDelete">삭제</button>
		</div>
		<p class="demo-tip">[작성창 열기] → 바로 글자를 치면 첫 칸(품번)에 들어간다. [삭제] → 확인 창의 [확인]에 포커스, 바로 Enter = 확인. Esc 는 닫기.</p>
	</div>
</div>

<div class="k-modal" id="popEnter" hidden>
	<div class="k-pop k-pop-s">
		<div class="k-pop-header">
			<div class="k-pop-title">품번 메모 작성</div>
			<button type="button" class="k-pop-close" title="닫기">✕</button>
		</div>
		<div class="k-pop-body">
			<table class="k-field">
				<colgroup><col class="k-label-col"><col></colgroup>
				<tr><th>품번</th><td><input type="text" class="k-input" id="popEnterFirst"></td></tr>
				<tr><th>메모</th><td><textarea class="k-input"></textarea></td></tr>
			</table>
		</div>
		<div class="k-pop-footer">
			<button type="button" class="k-btn k-btn-ghost" data-modal-close>취소</button>
			<button type="button" class="k-btn k-btn-primary" id="btnPopSave">저장</button>
		</div>
	</div>
</div>

<script>
document.getElementById('btnOpenPop').addEventListener('click', function () { ksis.modal.open('popEnter'); });
document.getElementById('btnPopSave').addEventListener('click', function () {
	ksis.modal.close('popEnter');
	ksis.showAlert('저장했습니다.');
});
document.getElementById('btnAskDelete').addEventListener('click', function () {
	ksis.showConfirm('선택한 문서 2건을 삭제하시겠습니까?', function () { ksis.showAlert('삭제했습니다.'); });
});
</script>
</body>
</html>
