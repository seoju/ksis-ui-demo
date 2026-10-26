package com.kefico.ksis.uidemo.guide;

/**
 * 비교표 한 행.
 * aRequirement = "KSIS A 요구사항" 칸, bNote = 그 칸 안의 "@@KSISB:" 뒤 내용(B 쪽 변경 메모).
 * summary() = 요구사항 칸의 "요약:" 뒤 글. "요약:" 이 없으면 첫 줄(길면 줄임).
 */
public record Requirement(
		int no,
		String category,
		String item,
		String area,
		String aOriginal,
		String bOriginal,
		String aRequirement,
		String bNote) {

	private static final String SUMMARY_MARK = "요약:";
	private static final int SUMMARY_MAX = 70;

	public String summary() {
		if (aRequirement == null || aRequirement.isBlank()) {
			return "";
		}
		int at = aRequirement.indexOf(SUMMARY_MARK);
		if (at >= 0) {
			return aRequirement.substring(at + SUMMARY_MARK.length()).strip();
		}
		String first = aRequirement.strip().lines().findFirst().orElse("").strip();
		return first.length() > SUMMARY_MAX ? first.substring(0, SUMMARY_MAX) + "…" : first;
	}
}
