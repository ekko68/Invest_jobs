package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BeforeIvt102MVO")
public class BeforeIvt102MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT102M
     * 투자BOX에서 투자를 받기 위한 사업자의 주주정보
     */

    /* key ========================== */

    // 등록정보을 Unique하게 식별하기 위해 순차적으로 부번되는 일련 번호
    private Integer rgsnSrn;

    // 투자신청관리번호
    private String invmAplcMngmNo;

    // 이용기관ID
    private String usisId;

    /* ========================== key */

    // 주주명
    private String stchNm;

    // 주주의 생년월
    private String stchBirtYmd;

    // 보유 주식의 수량
    private Long hlstCnt;
}
