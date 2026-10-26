package com.kefico.ksis.uidemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * KSIS UI 통일 시연 프로그램.
 * KSIS A·B 비교표(49행)의 결론을 화면 영역별로 4칸(A 원본 / B 원본 / A 요구사항 / B 요구사항)으로 보여 준다.
 * KSIS-A 와 같은 구성(Spring Boot 3.4.3 + JSP, war)이라 외주사 개발 환경에서 그대로 열 수 있다.
 */
@SpringBootApplication
public class UiDemoApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(UiDemoApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(UiDemoApplication.class, args);
	}
}
