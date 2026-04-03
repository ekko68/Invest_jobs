package com.ibk.sb.restapi.biz.service.vc.vo.portfolio;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcAuditExecuteIndicatorVO")
public class VcAuditExecuteIndicatorVO {

    // 투자집행건수
    private Integer invmPrfrCnt;

    // 투자집행금액
    private Long invmAmt;

    // 집행금액 공개여부
    private String oppbYn;

}
