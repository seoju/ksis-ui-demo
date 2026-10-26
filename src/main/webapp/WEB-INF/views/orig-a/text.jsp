<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 글자 · 제목 · 간격. designtemplate/list.jsp · notice.jsp 와 같은 클래스(page-title-v2 · page-sub-v2 · txt_info · notice_bar · description_box · no-data-message) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">
	<div class="demo-sec">
		<p class="demo-h"><b>47 · 48 · 49번</b> 제목 20px · 700 · 마지막 단어 파랑(span) + 아래 부제 12px · 덩어리 사이 16px</p>
		<div class="work-wrap-v2">
			<div class="page-header-v2">
				<div>
					<div class="page-title-v2">사용자 <span>관리</span></div>
					<div class="page-sub-v2">시스템 사용자 계정을 관리합니다</div>
				</div>
			</div>
			<div class="filter-bar-v2">
				<form class="filter-form-v2" onsubmit="return false;">
					<div class="filter-group-v2"><span class="filter-label-v2">이름</span><input type="text" class="filter-input-v2"></div>
					<div class="filter-divider-v2"></div>
					<div class="filter-group-v2"><span class="filter-label-v2">부서</span><input type="text" class="filter-input-v2"></div>
				</form>
				<div class="filter-actions-v2"><button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button></div>
			</div>
			<div class="txt_info dot">화면 안 설명글(.txt_info) 14px 얇은 글씨. 퇴사자는 목록에 나오지 않습니다.</div>
			<div class="table-card-v2">
				<div class="table-toolbar-v2">
					<div class="table-toolbar-left-v2"><span class="table-title-v2">사용자 목록</span><span class="count-badge-v2">15건</span></div>
					<div class="table-toolbar-right-v2"><button type="button" class="page-btn btn-primary"><i class="fa-solid fa-plus"></i> 신규</button></div>
				</div>
				<div class="table-inner-wrap">
					<table class="tbl_list">
						<thead><tr><th>사번</th><th>이름</th><th>부서</th><th>권한</th></tr></thead>
						<tbody>
						<c:forEach var="r" items="${rows}" end="2">
							<tr><td>K12345${r.no}</td><td>${r.owner}</td><td>영업${r.no}팀</td><td>작성자</td></tr>
						</c:forEach>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>46번</b> 빈 목록(.no-data-message 13px) · 안내줄(.notice_bar) · 안내 상자(.description_box) · 입력칸 아래 ※ 안내(.field-hint 11.5px)</p>
		<div class="no-data-message">조회된 데이터가 없습니다.</div>
		<div class="notice_bar"><b>내 결재 차례입니다.</b> 내용을 확인하고 [결재] 또는 [반려]를 누르세요.</div>
		<div class="description_box"><div class="txt_info dot">기본 조회 조건은 <b>본인 이름</b>이며 지우면 전체가 조회됩니다.</div></div>
		<div class="ksis-pop" style="margin-top:10px"><input type="text" class="form-control" style="width:240px;flex:none" value="NE1 HEV"><span class="field-hint">※ 프로젝트명은 수주 기준으로 입력합니다.</span></div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>45번</b> 글자 색 : 제목 #18181B · 본문 #3F3F46 · 보조 #71717A · 흐림 #A1A1AA · 구형 본문 #59636b · 정하지 않은 글 15px</p>
		<div style="display:grid;grid-template-columns:120px auto;gap:6px 12px;align-items:baseline">
			<span class="demo-tip" style="margin:0">제목</span><span style="color:#18181B;font-weight:700">화면 · 절 제목</span>
			<span class="demo-tip" style="margin:0">본문</span><span style="color:#3F3F46">본문 글</span>
			<span class="demo-tip" style="margin:0">보조</span><span style="color:#71717A">보조 글</span>
			<span class="demo-tip" style="margin:0">흐림</span><span style="color:#A1A1AA">흐린 글</span>
			<span class="demo-tip" style="margin:0">구형 본문</span><span>크기를 정하지 않은 글(body 15px · #59636b)</span>
		</div>
	</div>
</div>
</div>
</body>
</html>
