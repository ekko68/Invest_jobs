package com.ibk.sb.restapi.biz.service.kipris.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KiprisTotalVO {

    // 특허 실용 항목 총계
    Integer ipTotalCnt;

    // 상표 항목 총계
    Integer trademarkTotalCnt;

    // 디자인 항목 총계
    Integer designTotalCnt;

    // 출원인 번호
    String applicantNumber;
}
