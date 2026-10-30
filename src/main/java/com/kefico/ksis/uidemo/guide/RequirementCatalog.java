package com.kefico.ksis.uidemo.guide;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 비교표 49행 + 50번(requirements.json). 1~49번은 비교표 페이지에 입력된 요구사항을 그대로 옮긴 것이고,
 * 50번(여러 개 고르는 드롭다운, 2026-10-30)은 시연 프로그램에 먼저 넣었다.
 */
@Component
public class RequirementCatalog {

	private final List<Requirement> all;

	public RequirementCatalog(ObjectMapper mapper) throws IOException {
		try (InputStream in = new ClassPathResource("requirements.json").getInputStream()) {
			this.all = List.copyOf(mapper.readValue(in, new TypeReference<List<Requirement>>() { }));
		}
	}

	public List<Requirement> all() {
		return all;
	}

	public List<Requirement> of(DemoArea area) {
		return all.stream().filter(r -> r.area().equals(area.getKey())).toList();
	}
}
