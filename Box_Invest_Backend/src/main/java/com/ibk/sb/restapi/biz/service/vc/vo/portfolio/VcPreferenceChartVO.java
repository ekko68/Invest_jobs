package com.ibk.sb.restapi.biz.service.vc.vo.portfolio;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPreferenceChartVO")
public class VcPreferenceChartVO {

    // 선호분야 코드
    private String pfrcInvmFildCd;

    // 선호분야명
    private String pfrcInvmFildNm;

    // 선호분야 카운트
    private Integer pfrcInvmFildCnt;

    // 선호분야 비율
    private Double pfrcInvmFildRatio;

    // 선호분야 퍼센트
    private Integer pfrcInvmFildPercent;
}
