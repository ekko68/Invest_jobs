package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BeforeIvt103MVO")
public class BeforeIvt103MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT103M
     * 투자BOX에서 투자를 받기 위한 사업자의 기존 투자 유치정보
     */

    /* key ========================== */

    // 등록정보을 Unique하게 식별하기 위해 순차적으로 부번되는 일련 번호
    // 테이블에 따라 Number로 되있는 경우와 Varchar로 되어 있는 경우가 있음 주의
    private String rgsnSrn;

    // 이용기관ID
    private String usisId;

    // 투자신청관리번호
    private String invmAplcMngmNo;

    /* ========================== key */

    // 기존에 투자를 받은 년월일
    private String invmYmd;

    // 기존에 투자를 받은 투자기관명
    private String invmInttNm;

    // 기존에 투자를 받은 금액
    private Long invmAmt;

    // 기업가치 금액
//    private Long etvlAmt;

    // 기존에 투자를 받은 투자단계정보
    private String invmStgId;
}
