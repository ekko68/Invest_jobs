package com.ibk.sb.restapi.app.annotation;

import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Properties의 값을 @Value로 가져오기 위해
 * Spring Bean Component로 지정한 class에 사용
 *
 * ex:
 * FileUtil (profile에 따라 파일 경로 바뀜, 프로퍼티에 경로 저장함)
 */

@Component
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface PropertyComponent {
    String value() default "";
}
