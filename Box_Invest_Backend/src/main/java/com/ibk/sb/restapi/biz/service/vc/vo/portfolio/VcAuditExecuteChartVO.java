package com.ibk.sb.restapi.biz.service.vc.vo.portfolio;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcAuditExecuteChartVO")
public class VcAuditExecuteChartVO {

    // 집행 년월
    private String invmPrfrYm;

    // 집행 년도
    private String invmPrfrYear;

    // 집행 월
    private String invmPrfrMonth;

    // 년월별 집행금액
    private Long invmAmt;

}
