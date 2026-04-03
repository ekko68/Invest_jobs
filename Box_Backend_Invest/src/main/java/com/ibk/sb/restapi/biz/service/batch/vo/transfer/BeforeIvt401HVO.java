package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BeforeIvt401HVO")
public class BeforeIvt401HVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT401H
     */

    // 투자신청현황 일련번호
    private Integer invmAplcPsstSrn;

    // 이용기관ID
    private String usisId;

    // 투자신청관리번호
    private String invmAplcMngmNo;

    // 투자신청현황 내용
    private String pgrsCon;

    // 투자신청상태 코드값
    private String pgrsSttsCd;
}
