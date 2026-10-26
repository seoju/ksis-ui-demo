package com.kefico.ksis.uidemo.guide;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 그리드 시연용 고정 데이터(품번 · 고객 · 수량 · 금액). 매번 같은 값이 나오도록 계산으로 만든다.
 */
public final class SampleData {

	private static final String[] CUSTOMERS = { "현대자동차", "기아", "현대모비스", "HMMA", "KaGA", "HMMC" };
	private static final String[] CAR_TYPES = { "NE1", "MV1", "SG2", "CN7", "JK1", "US4", "NX4" };
	private static final String[] ITEMS = { "ECU", "TCU", "인젝터", "점화코일", "센서", "액추에이터" };
	private static final String[] OWNERS = { "김민준", "이서연", "박지훈", "최유진", "정하늘" };

	private SampleData() {
	}

	/** 좌측 메뉴 시연용(4칸 모두 같은 메뉴). 실제 KSIS-A 는 DB 메뉴를 그대로 쓴다 */
	public record MenuItem(String path, String title) { }
	public record MenuGroup(String key, String title, List<MenuItem> items) { }

	public static List<MenuGroup> menus() {
		return List.of(
				new MenuGroup("sales", "영업 관리", List.of(
						new MenuItem("/sales/quote", "견적 관리"),
						new MenuItem("/sales/order", "수주 관리"),
						new MenuItem("/sales/longterm", "중장기 매출 조회"))),
				new MenuGroup("price", "가격 관리", List.of(
						new MenuItem("/price/search", "가격 조회"),
						new MenuItem("/price/history", "가격 변경 이력"))),
				new MenuGroup("base", "기준 정보", List.of(
						new MenuItem("/base/k-part", "K품번 기준 고객품번 조회"),
						new MenuItem("/base/customer", "고객사 관리"))),
				new MenuGroup("perf", "매출 실적", List.of(
						new MenuItem("/perf/monthly", "월별 매출 실적"),
						new MenuItem("/perf/by-doc", "청구문서별 매출 실적 조회"),
						new MenuItem("/perf/by-part", "품번별 매출 실적"))),
				new MenuGroup("admin", "관리자", List.of(
						new MenuItem("/admin/users", "사용자 관리"),
						new MenuItem("/admin/menus", "메뉴 관리"))));
	}

	public static List<Map<String, Object>> rows(int count) {
		List<Map<String, Object>> list = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			Map<String, Object> r = new LinkedHashMap<>();
			r.put("no", i + 1);
			r.put("kPart", "39" + String.format("%03d", 100 + (i * 37) % 900) + "-" + String.format("%05d", 10000 + (i * 7919) % 90000));
			r.put("custPart", (char) ('A' + i % 6) + String.format("%04d", 1000 + (i * 131) % 9000) + "-" + CAR_TYPES[i % CAR_TYPES.length]);
			r.put("customer", CUSTOMERS[i % CUSTOMERS.length]);
			r.put("carType", CAR_TYPES[(i * 3) % CAR_TYPES.length]);
			r.put("item", ITEMS[(i * 5) % ITEMS.length]);
			r.put("qty", String.format("%,d", 1200 + (i * 4513) % 98000));
			r.put("amount", String.format("%,d", 15_000 + (i * 87_311) % 4_800_000));
			r.put("owner", OWNERS[i % OWNERS.length]);
			r.put("date", String.format("2026-%02d-%02d", 1 + (i * 7) % 10, 1 + (i * 11) % 28));
			list.add(r);
		}
		return list;
	}
}
