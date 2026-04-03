package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

@Getter
@Setter
@Alias("AdminStatisticsVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "excelSettingInfo"
})
public class AdminStatisticsVO extends BaseTableVO implements ExcelFormReflect {

    @ExcelFieldProperty(fieldName = "날짜", additionalWidth = 2048)
    private String displayDate;     // 날짜
//    @ExcelFieldProperty(fieldName = "투자심사완료", additionalWidth = 2048)
//    private Integer count;          // 통계 수치

    @ExcelFieldProperty(fieldName = "투자사", additionalWidth = 2048)
    private String invmCmpNm;

    @ExcelFieldProperty(fieldName = "투자희망기업", additionalWidth = 2048)
    private String rqstEnprNm;

    // 심사결과코드
    private String exntRsltCd;

    @ExcelFieldProperty(fieldName = "결과", additionalWidth = 2048)
    private String exntRsltNm;

    @ExcelFieldProperty(fieldName = "투자예정액(원)", additionalWidth = 2048,
            useHorizontalAlignOption = true, horizontalAlign = HorizontalAlignment.RIGHT)
    private String invmPrfrScdlAmtStr;

//    @ExcelFieldProperty(fieldName = "투자예정액(천원)", additionalWidth = 2048)
    private Long invmPrfrScdlAmt;
}
