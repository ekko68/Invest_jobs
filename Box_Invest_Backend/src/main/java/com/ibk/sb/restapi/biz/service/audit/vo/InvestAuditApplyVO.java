package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Alias("InvestAuditApplyVO")
public class InvestAuditApplyVO {

    // 투지유치현황에 보여줄 현재 날짜
    @JsonFormat(pattern = "yyyyMMdd")
    private Date date;

    private Integer totalApplyCnt;

    private Integer progressAuditCnt;

    private Integer completeAuditCnt;

    private List<ApplySummaryVO> applyList;

    // ibk가 투자한 기업 수
    private Integer ibkAuditCompany;

    // ibk가 투자한  금액
    private Integer ibkAuditAmt;

}
