package com.ibk.sb.restapi.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    /**
     *  application-properties 에서 resource handler 설정을 못 찾아와서
     *  java config로 따로 설정을 잡음
     *
     *  jsp error 페이지, thymeleaf 템플릿 엔진을 모두 사용하기 위해 viewResolver 2개 사용
     *  -> thymeleaf을 사용할 경우 /thymeleaf 로 view-name을 설정하여 구분한다.
     */

    /**
     * jsp, thymeleaf view resolver 등록
     * @param registry
     */
    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.viewResolver(jspViewResolver());
        registry.viewResolver(thymeleafViewResolver());
    }

    /**
     * jsp view resolver 설정 (prefix, suffix) 및 반환
     */
    @Bean
    public ViewResolver jspViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }

    /**
     * thymeleaf view resolver 설정 및 반환
     */
    @Bean
    public ViewResolver thymeleafViewResolver() {
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setTemplateEngine(templateEngine());
        // 우선 순위를 jsp를 먼저 두기 위함 (아래 뷰 이름 패턴의 경우에는 타임리프 선택됨)
        resolver.setOrder(1);
        // Thymeleaf로 처리할 뷰 이름 패턴을 설정
        resolver.setViewNames(new String[]{"/thymeleaf"});
        return resolver;
    }

    /**
     * thymeleaf view resolver 적용 템플릿 엔진 설정 및 반환
     */
    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        // 타임리프 Spring EL 표현식 속도 향상을 위한 컴파일러 활성화
        engine.setEnableSpringELCompiler(true);
        engine.setTemplateResolver(thymeleafTemplateResolver());
        return engine;
    }

    /**
     * thymeleaf 템플릿 엔진 적용 template resolver 설정 및 반환ㅇ
     */
    @Bean
    public ITemplateResolver thymeleafTemplateResolver() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setCacheable(false);
        return resolver;
    }

}
