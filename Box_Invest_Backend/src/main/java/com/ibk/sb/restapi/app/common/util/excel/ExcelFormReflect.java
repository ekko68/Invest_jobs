package com.ibk.sb.restapi.app.common.util.excel;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibk.sb.restapi.app.common.util.StringUtil;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * excel 변환 라이브러리 메서드 특성상 멤버변수 타입은 String, Date, Boolean, Double에 국한시킬것
 */
public interface ExcelFormReflect {

    default Map<String, Object> convertMap() {
        Map<String, Object> result = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .convertValue(this, HashMap.class);

        return result;
    }

//    /**
//     * Class 정보로 Excel Format 정보 설정
//     *
//     * @return
//     * @throws Exception
//     */
//    default ExcelFormVO getExcelSettingInfo() throws Exception {
//
//        Field[] fields = this.getClass().getDeclaredFields();
//
//        // 테이블 헤더 컬럼 key 리스트
//        List<String> columnList = new ArrayList<>();
//        // 테이블 헤더 컬럼명 리스트 (없는 경우 key(필드변수명)로 컬럼명 작성됨)
//        Map<String, String> colNmMap = new HashMap<>();
//        // 테이블 컬럼 추가 너비 설정
//        Map<String, Integer> addWidthMap = new HashMap<>();
//
//        for (Field field : fields) {
//            // 컬럼 Key 리스트 세팅
//            columnList.add(field.getName());
//            // 각 필드에 설정된 @ExcelProperty 어노테이션 값이 있는 경우 매핑정보 세팅
//            ExcelFieldProperty annoInfo = field.getAnnotation(ExcelFieldProperty.class);
//            if (annoInfo instanceof ExcelFieldProperty) {
//                // isColumnIgnored = true 인 경우 해당 필드는 엑셀 변환에서 제외한다.
//                if (annoInfo.isColumnIgnored()) {
//                    columnList.remove(field.getName());
//                } else {
//                    // 컬럼명 매핑 설정
//                    if (StringUtil.hasLengthWithTrim(annoInfo.fieldName())) colNmMap.put(field.getName(), annoInfo.fieldName());
//                    else colNmMap.put(field.getName(), field.getName());
//                    // 컬럼 너비 설정
//                    addWidthMap.put(field.getName(), annoInfo.additionalWidth());
//                }
//            }
//        }
//
//        // Form result
//        return new ExcelFormVO(columnList, colNmMap, addWidthMap);
//    }
}
