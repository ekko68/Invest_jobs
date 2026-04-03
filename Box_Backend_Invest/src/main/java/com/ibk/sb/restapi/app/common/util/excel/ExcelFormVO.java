package com.ibk.sb.restapi.app.common.util.excel;

import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@Alias("ExcelFormVO")
public class ExcelFormVO {


    // 엑셀 시트명
    private String title;

    // 테이블 헤더 컬럼 key 리스트
    private List<String> columnList;

    // 테이블 로우 리스트
    private List<Map<String, Object>> rowList;

    /**
     * Custom Annotation 설정 필드
     */
    // 테이블 헤더 컬럼명 리스트 (없는 경우 key(필드변수명)로 컬럼명 작성됨)
    private Map<String, String> colNmMap;

    // 테이블 컬럼 추가 너비 설정
    private Map<String, Integer> addWidthMap;

    // 테이블 컬럼 정렬 지정
    private Map<String, HorizontalAlignment> horizontalAlignmentMap;


    /**
     * 엑셀 폼 추가 구성 데이터 VO
     * - 상황에 따라 excelFileUtil 메서드와 함께 조정
     */

    // 헤더 타이틀
    private String headerTitle;
    // 마지막 총계 Row 타이틀
    private String lastTotalRowNm;
    // 마지막 총계 Row 데이터
    private Object lastTotalRowData;


    public ExcelFormVO(Class<? extends ExcelFormReflect> excelFormReflectClass) throws Exception {

        Field[] fields = excelFormReflectClass.getDeclaredFields();

        // 테이블 헤더 컬럼 key 리스트
        List<String> columnList = new ArrayList<>();
        // 테이블 헤더 컬럼명 리스트 (없는 경우 key(필드변수명)로 컬럼명 작성됨)
        Map<String, String> colNmMap = new HashMap<>();
        // 테이블 컬럼 추가 너비 설정
        Map<String, Integer> addWidthMap = new HashMap<>();
        // 테이블 컬럼 가로정렬 설정
        Map<String, HorizontalAlignment> horizontalAlignmentMap = new HashMap<>();

        for (Field field : fields) {
            // 컬럼 Key 리스트 세팅
            columnList.add(field.getName());
            // 각 필드에 설정된 @ExcelProperty 어노테이션 값이 있는 경우 매핑정보 세팅
            ExcelFieldProperty annoInfo = field.getAnnotation(ExcelFieldProperty.class);
            if (annoInfo instanceof ExcelFieldProperty) {
                // isColumnIgnored = true 인 경우 해당 필드는 엑셀 변환에서 제외한다.
                if (annoInfo.isColumnIgnored()) {
                    columnList.remove(field.getName());
                } else {
                    // 컬럼명 매핑 설정
                    if (StringUtil.hasLengthWithTrim(annoInfo.fieldName())) colNmMap.put(field.getName(), annoInfo.fieldName());
                    else colNmMap.put(field.getName(), field.getName());

                    // 컬럼 너비 설정
                    addWidthMap.put(field.getName(), annoInfo.additionalWidth());

                    // 가로정렬 사용자 지정 옵션
                    if (annoInfo.useHorizontalAlignOption()) horizontalAlignmentMap.put(field.getName(), annoInfo.horizontalAlign());
                }
            }
            // 없는 경우 columnList 삭제
            else {
                columnList.remove(field.getName());
            }
        }

        this.columnList = columnList;
        this.colNmMap = colNmMap;
        this.addWidthMap = addWidthMap;
        this.horizontalAlignmentMap = horizontalAlignmentMap;
    }

    public ExcelFormVO(Class<? extends ExcelFormReflect> excelFormReflectClass, List<? extends ExcelFormReflect> list) throws Exception {
        this(excelFormReflectClass);
        // list가 null일 경우 illegalException이 아닌 빈 배열 자동 처리
        if(list == null) this.rowList = new ArrayList<>();
        // list not null일 경우 stream map convert list 처리
        else this.rowList = list.stream().map(ExcelFormReflect::convertMap).collect(Collectors.toList());
    }

    public ExcelFormVO(
            Class<? extends ExcelFormReflect> excelFormReflectClass
            , List<? extends ExcelFormReflect> list, String title) throws Exception {

        this(excelFormReflectClass, list);
        this.title = title;
    }
}
