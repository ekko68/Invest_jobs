package com.ibk.sb.restapi.biz.service.platform.vo.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TcbResultVO {

    // 조회대상 기업 TCB 기술등급
    private String tcbTchnGrd;

    // 조회대상 기업 산업기술분류코드 1~3
    // (tcbTchnGrd가 T4일때 사용)
    private String incfCd1;
    private String incfCd2;
    private String incfCd3;
}
