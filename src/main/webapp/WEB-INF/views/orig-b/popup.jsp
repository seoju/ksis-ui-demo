<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ② KSIS-B 원래 — 업무 팝업. Home.razor 의 작성 창(write-modal-overlay > write-modal-box doc-tall) + DocumentWrite.razor(docform) 마크업 그대로 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
</head>
<body style="background:#fff">
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>43번</b> 작성 창 : 화면 비율 크기(50%×80%, 최대 900) · 모서리 16 · 오른쪽 위 동그란 ✕ · 전체 화면 전환 · 끌어 옮기기 없음 · 머리줄 없음</p>
		<button class="btn btn-primary" onclick="document.getElementById('bPop').hidden=false">작성</button>
	</div>
</div>
<div id="bPop">
	<div class="write-modal-overlay">
		<div class="write-modal-box doc-tall" id="bBox">
			<button class="write-modal-fullscreen-btn" title="전체화면 전환" onclick="document.getElementById('bBox').classList.toggle('is-fullscreen')">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 9 4 4 9 4" /><polyline points="20 9 20 4 15 4" /><polyline points="4 15 4 20 9 20" /><polyline points="20 15 20 20 15 20" /></svg>
			</button>
			<button class="write-modal-close" title="닫기" onclick="document.getElementById('bPop').hidden=true">✕</button>
			<div class="docform-shell">
				<div class="docform-body">
					<div class="docform-title">가격 변경 작성</div>
					<div class="docform-table">
						<div class="docform-row row-fixed"><div class="docform-label">제목</div><div class="docform-value"><input class="text-input" value="NE1 ECU 약정 인하"></div></div>
						<div class="docform-row row-fixed"><div class="docform-label">작성자</div><div class="docform-value"><input class="text-input" value="홍길동"></div></div>
						<div class="docform-row row-fixed"><div class="docform-label">작성 일자</div>
							<div class="docform-value date-input-wrap"><input class="text-input" type="text" value="2026-10-26">
								<button type="button" class="date-picker-btn" title="달력에서 선택" tabindex="-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg></button></div></div>
						<div class="docform-row row-fixed"><div class="docform-label">고객사</div><div class="docform-value"><select class="text-input"><option>(고객사를 골라주세요)</option><option>현대자동차</option></select></div></div>
						<div class="docform-row row-fixed"><div class="docform-label">K품번</div><div class="docform-value"><input class="text-input" value="39100-10000"></div></div>
						<div class="docform-row row-fixed"><div class="docform-label">변경 단가</div><div class="docform-value"><input class="text-input" value="14,550"></div></div>
						<div class="docform-row row-flex"><div class="docform-label">검토 사항</div><div class="docform-value"><textarea class="text-input" rows="4">약정 인하 3% (2027년 1월 적용)</textarea></div></div>
					</div>
				</div>
				<div class="modal-footer-actions">
					<button class="btn btn-outline docform-footer-btn" onclick="document.getElementById('bPop').hidden=true">취소</button>
					<button class="btn btn-primary docform-footer-btn">저장</button>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
