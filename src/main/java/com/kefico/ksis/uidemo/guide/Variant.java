package com.kefico.ksis.uidemo.guide;

import java.util.Arrays;
import java.util.Optional;

/**
 * 4칸 비교의 한 칸.
 * ① A 원본 / ② B 원본 은 각 저장소의 실제 CSS·JS 복사본으로 그린다.
 * ③ A 요구사항 / ④ B 요구사항 은 같은 JSP(req/{area}.jsp)와 같은 공통 CSS·JS 에 색 테마 파일만 바꿔 그린다.
 */
public enum Variant {

	ORIG_A("orig-a", "① KSIS-A 원래 화면", "KSIS_A 저장소 CSS·JS 그대로", "orig-a", null),
	ORIG_B("orig-b", "② KSIS-B 원래 화면", "KSIS_B 저장소 app.css·JS 그대로", "orig-b", null),
	REQ_A("req-a", "③ KSIS-A 요구사항", "공통 CSS + 파랑 테마(ksis-theme-a.css)", "req", "a"),
	REQ_B("req-b", "④ KSIS-B 요구사항", "공통 CSS + 초록 테마(ksis-theme-b.css)", "req", "b");

	private final String key;
	private final String label;
	private final String source;
	private final String viewDir;
	private final String theme;

	Variant(String key, String label, String source, String viewDir, String theme) {
		this.key = key;
		this.label = label;
		this.source = source;
		this.viewDir = viewDir;
		this.theme = theme;
	}

	public String getKey() { return key; }
	public String getLabel() { return label; }
	public String getSource() { return source; }
	public String getViewDir() { return viewDir; }
	/** 요구사항 칸의 색 테마(a / b). 원본 칸은 null. */
	public String getTheme() { return theme; }

	public static Optional<Variant> of(String key) {
		return Arrays.stream(values()).filter(v -> v.key.equals(key)).findFirst();
	}
}
