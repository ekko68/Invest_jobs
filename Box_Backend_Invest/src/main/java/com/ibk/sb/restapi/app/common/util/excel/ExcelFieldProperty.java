package com.ibk.sb.restapi.app.common.util.excel;

import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xwpf.usermodel.VerticalAlign;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelFieldProperty {

    // 엑셀 컬럼명 (컬럼 헤더 세팅)
    String fieldName() default "";

    // 엑셀 컬럼 추가 너비
    int additionalWidth() default 0;

    // 엑셀 컬럼 제외 여부 : true 설정 시 엑셀 출력 제외
    boolean isColumnIgnored() default false;

    // 가로정렬 옵션
    boolean useHorizontalAlignOption() default false;
    HorizontalAlignment horizontalAlign() default HorizontalAlignment.GENERAL;
}
