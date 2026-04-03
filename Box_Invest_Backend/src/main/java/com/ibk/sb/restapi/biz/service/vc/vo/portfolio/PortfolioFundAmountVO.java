package com.ibk.sb.restapi.biz.service.vc.vo.portfolio;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("PortfolioFundAmountVO")
public class PortfolioFundAmountVO {

    // 전체 투자사 포트폴리오 투자금액 총계
    private Long invmAmt;
    // 전체 투자사 포트폴리오 투자금액 총계 (단위 등 표현 용)
    private String invmAmtStr;
}
