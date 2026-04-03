package com.ibk.sb.restapi.biz.service.common.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Alias("VisitorCountVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "amnnUserId", "amnnUserNm", "totalCnt", "rvsRnum", "imgFileId", "imgUrl"
        , "excelSettingInfo", "rgsnTs", "amnnTs"
})
public class VisitorCountVO extends BaseTableVO implements ExcelFormReflect {

    /**
     * 방문자 접속 목록 정보
     * TB_BOX_IVT_VSTO_CCTN_L
     */

    // 접속 날짜
    @ExcelFieldProperty(fieldName = "접속 날짜", additionalWidth = 2048)
    private String cctnDt;

    // 방문자 수
    @ExcelFieldProperty(fieldName = "방문자 수", additionalWidth = 2048)
    private Long vstoCnt;

//    @Override
//    public Map<String, Object> convertMap() {
//        Map<String, Object> result = new HashMap<>();
//        result.put("cctnDt", this.cctnDt);
//        result.put("vstoCnt", this.vstoCnt);
//        return result;
//    }
}
