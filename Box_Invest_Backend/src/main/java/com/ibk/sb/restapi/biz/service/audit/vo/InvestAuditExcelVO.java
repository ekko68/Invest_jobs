package com.ibk.sb.restapi.biz.service.audit.vo;

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
@Alias("InvestAuditExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class InvestAuditExcelVO  extends BaseTableVO implements ExcelFormReflect{
	
    // 번호
    @ExcelFieldProperty(fieldName = "번호", additionalWidth = 4096)
    private int seq;

    // 투자 심사 제안/요청 받은 날짜 (투자심사 시작일)
    @ExcelFieldProperty(fieldName = "신청일자", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp invmSttgDt;

	// 투자 심사 요청 ID
    private String invmExntRqstId;

    // 제안 투자사 ID
    private String invmCmpId;

    // 요청 기업 ID
    private String rqstEnprId;

    // 투자사 사업자명
    @ExcelFieldProperty(fieldName = "투자사 명", additionalWidth = 4096)
    private String invmCmpBplcNm;

    // 기업 사업자명
    @ExcelFieldProperty(fieldName = "기업 명", additionalWidth = 4096)
    private String rqstBplcNm;

    @ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
    // 사업자번호
    private String bzn;

    // 설립일자
    @ExcelFieldProperty(fieldName = "설립일자", additionalWidth = 4096)
    private String incrYmd;

    // 투자 심사 제안|요청 메시지
    @ExcelFieldProperty(fieldName = "메시지", additionalWidth = 4096)
    // 메시지
    private String msgCon;
    
    // 제안 메시지
    private String prplMsgCon;
    
    // 투자 심사 제안|요청 메시지
    // 요청 메시지
    private String rqstMsgCon;

    // 투자 심사 진행단계명
    @ExcelFieldProperty(fieldName = "투자 심사 진행단계", additionalWidth = 4096)
    private String invmExntPgsgNm;

    //접수구분
    @ExcelFieldProperty(fieldName = "접수구분", additionalWidth = 4096)
    private String rcdt;
}
