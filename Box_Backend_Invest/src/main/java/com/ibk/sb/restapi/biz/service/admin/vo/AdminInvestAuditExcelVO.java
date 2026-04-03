package com.ibk.sb.restapi.biz.service.admin.vo;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("AdminInvestAuditExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminInvestAuditExcelVO extends BaseTableVO implements ExcelFormReflect {
	// 번호
    @ExcelFieldProperty(fieldName = "번호", additionalWidth = 4096)
    private int seq;

    // 투자 심사 제안/요청 받은 날짜 (투자심사 시작일)
    @ExcelFieldProperty(fieldName = "투자심사 시작일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp invmSttgDt;
    
    // 요청 기업 ID
    private String rqstEnprId;
    
    // 투자심사 진행단계 코드
    private String invmExntPgsgCd;
    
    // 투자사 사업자명
    @ExcelFieldProperty(fieldName = "투자사 명", additionalWidth = 4096)
    private String invmCmpBplcNm;

    // 기업 사업자명
    @ExcelFieldProperty(fieldName = "기업 명", additionalWidth = 4096)
    private String rqstBplcNm;

    // 사업자 등록번호
    @ExcelFieldProperty(fieldName = "사업자 등록번호", additionalWidth = 4096)
    private String bzn;
    
    // 업종
    @ExcelFieldProperty(fieldName = "업종", additionalWidth = 4096)
    private String mainBizcndNm;

    // 상태
    @ExcelFieldProperty(fieldName = "상태", additionalWidth = 4096)
    private String invmExntPgsgNm;
    
    // 심사결과
    @ExcelFieldProperty(fieldName = "심사결과", additionalWidth = 4096)
    private String exntRsltCd;
    
    // 추천영업점명
    @ExcelFieldProperty(fieldName = "추천영업점명", additionalWidth = 4096)
    private String brcdNm;
    
    private String brcd;

}
