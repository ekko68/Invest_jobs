package com.ibk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EnableFeignClients
public class IbkBoxInvestApiApplication extends SpringBootServletInitializer {

    // war 배포를 위한 추가부
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(IbkBoxInvestApiApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(IbkBoxInvestApiApplication.class, args);
    }

}
