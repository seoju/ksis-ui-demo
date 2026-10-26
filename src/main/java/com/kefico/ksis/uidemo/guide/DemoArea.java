package com.kefico.ksis.uidemo.guide;

import java.util.Arrays;
import java.util.Optional;

/**
 * 화면 영역. 비교표의 행 번호 범위와 짝을 이룬다.
 * key 는 URL 과 JSP 파일 이름(orig-a/{key}.jsp, orig-b/{key}.jsp, req/{key}.jsp)에 쓴다.
 */
public enum DemoArea {

	LAYOUT("layout", "레이아웃 · 메뉴 · 탭", "상단 가로바, 좌측 메뉴, 화면 탭, 본문 영역", 1, 18),
	BUTTONS("buttons", "버튼", "버튼 규격, 색, 마우스 올림 · 누름, 비활성, Enter", 19, 27),
	GRID("grid", "그리드", "칸 선택, 키보드 이동, 복사 · 붙여넣기, 열 폭, 페이지, 행 · 머리글 · 본문, 편집 칸", 28, 37),
	SEARCH("search", "검색 영역 · 입력칸", "검색 영역, 입력칸, 드롭다운, 날짜 입력, 모드 버튼", 38, 42),
	POPUP("popup", "업무 팝업", "업무 팝업 크기 · 머리줄 · 본문 · 버튼줄", 43, 43),
	DIALOG("dialog", "알림 · 확인 창", "알림 창과 확인 창", 44, 44),
	TEXT("text", "글자 · 제목 · 간격", "글자 색, 일반 글 크기, 화면 제목, 간격, 부제", 45, 49);

	private final String key;
	private final String title;
	private final String summary;
	private final int fromNo;
	private final int toNo;

	DemoArea(String key, String title, String summary, int fromNo, int toNo) {
		this.key = key;
		this.title = title;
		this.summary = summary;
		this.fromNo = fromNo;
		this.toNo = toNo;
	}

	public String getKey() { return key; }
	public String getTitle() { return title; }
	public String getSummary() { return summary; }
	public int getFromNo() { return fromNo; }
	public int getToNo() { return toNo; }

	public String getRange() {
		return fromNo == toNo ? fromNo + "번" : fromNo + "~" + toNo + "번";
	}

	public static Optional<DemoArea> of(String key) {
		return Arrays.stream(values()).filter(a -> a.key.equals(key)).findFirst();
	}
}
