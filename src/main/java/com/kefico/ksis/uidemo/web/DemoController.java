package com.kefico.ksis.uidemo.web;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kefico.ksis.uidemo.guide.DemoArea;
import com.kefico.ksis.uidemo.guide.RequirementCatalog;
import com.kefico.ksis.uidemo.guide.SampleData;
import com.kefico.ksis.uidemo.guide.Variant;

/**
 * 화면 주소
 *   /                      영역 목록
 *   /summary               0번 비교표 및 요구사항 요약(50행 전체)
 *   /compare/{area}        한 영역의 4칸 비교 + 그 영역의 요구사항
 *   /view/{variant}/{area} 4칸 중 한 칸(비교 화면이 iframe 으로 부른다. 따로 열어도 된다)
 *   /fragment/{variant}/screen  ① KSIS-A 원래 틀이 탭을 열 때 $(".contens-wrap").load(url) 로 불러오는 업무 화면 조각
 */
@Controller
public class DemoController {

	private final RequirementCatalog catalog;
	private final ObjectMapper mapper;
	private final String buildTime;   // 첫 화면에 보이는 빌드 시각(한국 시간). IDE 에서 바로 띄우면 build-info 가 없어 빈 값

	public DemoController(RequirementCatalog catalog, ObjectMapper mapper, ObjectProvider<BuildProperties> build) {
		this.catalog = catalog;
		this.mapper = mapper;
		BuildProperties b = build.getIfAvailable();
		this.buildTime = b == null || b.getTime() == null ? ""
				: DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.of("Asia/Seoul")).format(b.getTime());
	}

	@GetMapping("/")
	public String index(Model model) {
		model.addAttribute("areas", DemoArea.values());
		model.addAttribute("variants", Variant.values());
		model.addAttribute("buildTime", buildTime);
		return "common/index";
	}

	@GetMapping("/summary")
	public String summary(Model model) {
		model.addAttribute("areas", DemoArea.values());
		model.addAttribute("reqs", catalog.all());
		return "common/summary";
	}

	@GetMapping("/compare/{area}")
	public String compare(@PathVariable String area, Model model) {
		DemoArea a = area(area);
		model.addAttribute("area", a);
		model.addAttribute("areas", DemoArea.values());
		model.addAttribute("variants", Variant.values());
		model.addAttribute("reqs", catalog.of(a));
		return "common/compare";
	}

	@GetMapping("/view/{variant}/{area}")
	public String view(@PathVariable String variant, @PathVariable String area, Model model) throws JsonProcessingException {
		Variant v = Variant.of(variant).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		DemoArea a = area(area);
		model.addAttribute("area", a);
		model.addAttribute("variant", v);
		model.addAttribute("theme", v.getTheme());
		if (a == DemoArea.GRID || a == DemoArea.LAYOUT || a == DemoArea.TEXT) {
			var rows = SampleData.rows(a == DemoArea.GRID ? 137 : 15);
			model.addAttribute("rows", rows);
			model.addAttribute("rowsJson", mapper.writeValueAsString(rows));
		}
		if (a == DemoArea.LAYOUT) {
			model.addAttribute("menus", SampleData.menus());
		}
		return v.getViewDir() + "/" + a.getKey();
	}

	@GetMapping("/fragment/{variant}/screen")
	public String screen(@PathVariable String variant, @RequestParam(defaultValue = "업무 화면") String title, Model model) {
		Variant v = Variant.of(variant).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		model.addAttribute("title", title);
		model.addAttribute("rows", SampleData.rows(15));
		return v.getViewDir() + "/_screen";
	}

	private DemoArea area(String key) {
		return DemoArea.of(key).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}
}
