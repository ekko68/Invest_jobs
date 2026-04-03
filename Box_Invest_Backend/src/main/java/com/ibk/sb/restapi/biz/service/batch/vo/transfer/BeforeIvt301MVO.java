package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;

@Getter
@Setter
@Alias("BeforeIvt301MVO")
public class BeforeIvt301MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT301M
     * 투자 요청을 한 정보를 심사한 결과 정보
     */

    // 심사정보 일련번호
    private Integer exntInfoSrn;

    // 투자 신청을 관리하는 번호
    private String invmAplcMngmNo;

    // 이용기관ID
    private String usisId;

    // 투자 이용기관ID
    private String invmUsisId;

    // 신청한 금
    private Long aplcAmt;

    // 신청한 일
    private Date aplcTs;

    // 진행 상태 코
    private String pgrsSttsCd;

    // 심사를 완료한 일
    private Date exntFnsgTs;
}
