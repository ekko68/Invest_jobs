package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CerpBscInfrDVO {

    // 발급번호
    private String cerCvaIsnNo;

    // 대표자명
    private String cvarFnmJnt;

    // 사업장 소재지
    // 주소(본점) or 사업장
    // 표준재무제표의 경우 rcatDtm 값이 20160924000000 이후에는 주소, 이전은 사업장
    // 사업장 소재지
    private String cvarLdAdr;
    private String cvarRoadNmAdr;

    // 일자
    private String rcatDtm;
}
