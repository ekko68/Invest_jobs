package com.ibk.sb.restapi.biz.service.fund.vo.prdInfo;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("FundPrdtInfoVO")
@ToString
@JsonIgnoreProperties({
    "delYn", "imgUrl", "imgFileId", "rnum", "rvsRnum"
})
public class FundPrdtInfoVO extends BaseTableVO {
	
	// 이용기관(회사) 
    private String utlinsttId;
    
    // 펀드Id  
    private String fundId;
    
    // 펀드명  
    private String fundNm;
    
    // 펀드유형
    private String fundPtrn;
    
    // 결성목표액 
    private Integer orgzTrgpft;
    
    // ibk 출자 제안금액 
    private Integer ibkInvstmntPrplAmt;
    
    // 기준수익률(IRR)
    private Integer stdrErnRt;
    
    // 존속기간(년)
    private String cntnncPdyy;

    // 성과보수*IRR 초과수익의 (%)
    private Integer rsltMendngIrrExcessErn;

    // 투자기간(년)
    private String invtPdyy;
    
    // 관리보수(%)  
    private Integer mngMendngRt;
    
    // 납부방식
    private String pmntMthd;
    
    // 투자대상
    private String invtTgt;

    // ibk 제안금액
    private String ibkPrplAmt;

    // ibk 제안율
    private String ibkPrplRto;

    // 심사단계
    private String auditStg;
    
    // 답변내용
    private String rplyCon;

    // 작성일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp wody;
    
    // 결성목표가 
    private Integer orgzTgpr;

    // 결성목표율 
    private Integer orgzRto;
    
    // 등록일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    
    // 등록자 ID 
    private String rgsnUserId;
    
    // 수정일 
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp amnnTs;
    
    // 수정자 ID 
    private String amnnUserId;
    
    // gp출자금액
    private int gpFncnInfo;
    
    // 펀드 구분
    private String fundDsnc;
    
    // 제안서 기준일
    private String ProposalDocBaseDay;
    
    // 주요LP 지원 및 선정분야
    private List<PrmrLpChcFildVO> prmrLpChcFild;
    
    // 출자자 모집 현황
    private List<FncnEnlsPsstListVO> fncnEnlsPsst;
}
