package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BmanBscInfrInqrDVO {

    // 상호(법인명)
    private String txprNm;

    // 사업자 등록번호
    private String txprDscmNoEncCntn;

    // 업태
    private String bcNm;

    // 종목
    private String itmNm;

    // 사업자구분
    private String bmanClNm;

    // 개업일
    private String txprDscmDt;

    // 사업자등록일
    private String bmanRgtDt;

    // 사업장 소재지
    private String bmanClCd;
    private String etcDadr; // bmanClCd가 08일 경우

    // 법인 번호
    private String crpno;

    // 주민 번호
    private String cvarRprsResno;

    // 대표자명
    private String rprsTxprNm;

    // 표준재무재표 개인| 법인 구분 코드 (250이면 법인)
    private String txprDclsCd;

    // 표준재무재표 쪽 주민번호
    private String cvarResno;
}
