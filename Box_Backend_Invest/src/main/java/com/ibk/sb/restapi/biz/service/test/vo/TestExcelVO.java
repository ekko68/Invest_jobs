package com.ibk.sb.restapi.biz.service.test.vo;

import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestExcelVO implements ExcelFormReflect {

    @ExcelFieldProperty(fieldName = "이름")
    private String name;

    @ExcelFieldProperty(fieldName = "직군")
    private String jbcl;

    @ExcelFieldProperty(fieldName = "나이")
    private Double age;


//    @Override
//    public Map<String, Object> convertMap() {
//        return null;
//    }
}
