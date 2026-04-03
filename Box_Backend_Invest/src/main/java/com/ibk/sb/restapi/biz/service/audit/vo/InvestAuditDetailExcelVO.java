package com.ibk.sb.restapi.biz.service.audit.vo;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditExcelVO.InvestAuditExcelVOBuilder;

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
@Alias("InvestAuditDetailExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class InvestAuditDetailExcelVO extends BaseTableVO implements ExcelFormReflect{
	// 번호
    @ExcelFieldProperty(fieldName = "번호", additionalWidth = 4096, useHorizontalAlignOption=true, horizontalAlign=HorizontalAlignment.CENTER)
    private int seq;

    //접수구분
    @ExcelFieldProperty(fieldName = "접수구분", additionalWidth = 4096)
    private String rcdt;

	// 투자 심사 요청 ID
    @ExcelFieldProperty(fieldName = "투자 심사요청ID", additionalWidth = 4096)
    private String invmExntRqstId;

    // 제안 투자사 ID
    @ExcelFieldProperty(fieldName = "제안 투자사ID", additionalWidth = 4096)
    private String invmCmpId;

    // 투자사 사업자명
    @ExcelFieldProperty(fieldName = "투자사 명", additionalWidth = 4096)
    private String invmCmpBplcNm;
    
    // 제안 투자사 유형
    private String invmCmpPtrnCd;
    
    @ExcelFieldProperty(fieldName = "투자사 구분", additionalWidth = 4096)
    private String invmCmpPtrnNm;

    // 요청 기업 ID
    @ExcelFieldProperty(fieldName = "요청 기업ID", additionalWidth = 4096)
    private String rqstEnprId;

    // 기업 사업자명
    @ExcelFieldProperty(fieldName = "기업 명", additionalWidth = 4096)
    private String rqstBplcNm;
    
    // 기업 사업자명
    @ExcelFieldProperty(fieldName = "사업자등록번호", additionalWidth = 4096)
    private String bzn;
    
    // 요청 기업 구분
    private String enprDsncClsfCd;
    
    @ExcelFieldProperty(fieldName = "기업 구분", additionalWidth = 4096)
    private String enprDsncClsfNm;
    
    //대표자명
    @ExcelFieldProperty(fieldName = "대표자명", additionalWidth = 4096)
    private String rprNm;
    
    //설립일자
    @ExcelFieldProperty(fieldName = "설립일자", additionalWidth = 4096)
    private String col;
    // 업종
    @ExcelFieldProperty(fieldName = "업종", additionalWidth = 4096)
    private String mainBizcnd;
    
    // 산업분류 코드명
    @ExcelFieldProperty(fieldName = "업종명", additionalWidth = 4096)
    private String mainBizcndNm;
    
    // 추천직원
    @ExcelFieldProperty(fieldName = "추천직원", additionalWidth = 4096)
    private String emm;
    
    // 추천영업점
    @ExcelFieldProperty(fieldName = "추천영업점", additionalWidth = 4096)
    private String brcd;
    	
    // 희망투자단계
    @ExcelFieldProperty(fieldName = "희망투자단계", additionalWidth = 4096)
    private String invmHopeStgNm;
    
    // 희망투자금액
    @ExcelFieldProperty(fieldName = "희망투자금액", additionalWidth = 4096)
    private String invmHopeAmtNm;
    
    // 홈페이지 주소
    @ExcelFieldProperty(fieldName = "홈페이지 주소", additionalWidth = 4096)
    private String hmpgUrlAdr;

    // 주소
    @ExcelFieldProperty(fieldName = "주소", additionalWidth = 4096)
    private String adr;
    
    //우편번호
    @ExcelFieldProperty(fieldName = "우편번호", additionalWidth = 4096)
    private String zpcd;

    //직원수
    @ExcelFieldProperty(fieldName = "직원수", additionalWidth = 4096)
    private String empCnt;
    
    // 자본금 금액
    @ExcelFieldProperty(fieldName = "자본금 금액", additionalWidth = 4096)
    private String cpfnAmt;
    
    // 액면가 금액
    @ExcelFieldProperty(fieldName = "액면가 금액", additionalWidth = 4096)
    private String pvprAmt;
    
    // 총보유주식수
    @ExcelFieldProperty(fieldName = "총 보유 주식수", additionalWidth = 4096)
    private String ttisStcnt;
    
    
    // 투자 심사 진행단계 코드
    private String invmExntPgsgCd;

    // 투자 심사 진행단계명
    @ExcelFieldProperty(fieldName = "진행상태", additionalWidth = 4096)
    private String invmExntPgsgNm;
    
    // 투자 심사 제안|요청 메시지
    @ExcelFieldProperty(fieldName = "메시지", additionalWidth = 4096)
    // 메시지
    private String msgCon;
    
    // 제안 메시지
    private String prplMsgCon;
    
    // 투자 심사 제안|요청 메시지
    // 요청 메시지
    private String rqstMsgCon;
    
    // 투자 심사 제안/요청 받은 날짜 (투자심사 시작일)
    @ExcelFieldProperty(fieldName = "투자심사 시작일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp invmSttgDt;
}
