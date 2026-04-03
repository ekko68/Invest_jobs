package com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("FundIrStockExcelVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "amnnUserId", "amnnUserNm", "totalCnt", "rvsRnum", "imgFileId", "imgUrl"
        , "excelSettingInfo", "rgsnTs", "amnnTs"
})
@ToString
public class FundIrStockExcelVO extends BaseTableVO implements ExcelFormReflect{
	
	// 주주명
    @ExcelFieldProperty(fieldName = "주주명", additionalWidth = 2048)
    private String stchNm;

    // 지분액(원)
    @ExcelFieldProperty(fieldName = "지분액(원)", additionalWidth = 2048)
    private String cmscAmt;
    
    // 지분율(%)
    @ExcelFieldProperty(fieldName = "지분율(%)", additionalWidth = 2048)
    private Double prra;

    // 비고
    @ExcelFieldProperty(fieldName = "비고", additionalWidth = 2048)
    private String rmrk;
    
}
