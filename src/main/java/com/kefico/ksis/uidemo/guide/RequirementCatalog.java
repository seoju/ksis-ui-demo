package com.kefico.ksis.uidemo.guide;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 비교표 49행(requirements.json). 비교표 페이지에 입력된 요구사항을 그대로 옮긴 것이다.
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
