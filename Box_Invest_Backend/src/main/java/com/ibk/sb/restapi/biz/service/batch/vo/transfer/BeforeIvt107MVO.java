package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BeforeIvt107MVO")
public class BeforeIvt107MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT107M
     * 투자 요청을 한 사업자의 사업장 주소 정보
     *
     * 기존의 경우 사업장 정보를 여러개 입력 가능하나 현재는
     * IR의 사업장 주소 입력이 단일로 존재하므로
     * prcpBsunYn가 Y이고 bsunAdrSrn가 가장 앞에 있는 것을 기준으로 함
     */

    /* key ========================== */

    // 투자 신청을 관리하는 번호
    private String invmAplcMngmNo;

    // 이용기관ID
    private String usisId;

    // 사업장 주소의 일련번호
    private Integer bsunAdrSrn;

    /* ========================== key */

    // 주사업장:Y,부사업장:N
    private String prcpBsunYn;

    // 사업장명
    private String bsunNm;

    // 사업장 사업자등록번호
    private String bsunBzn;

    // 사업장의 우편번호
    private String bsunZpcd;

    // 사업장의 주소
    private String bsunAdr;

    // 사업장의 상세 주소
    private String bsunDtlAdr;

}
