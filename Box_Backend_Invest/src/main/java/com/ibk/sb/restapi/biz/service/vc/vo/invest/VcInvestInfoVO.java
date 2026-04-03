package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VcInvestInfoVO")
public class VcInvestInfoVO {

    // 관심투자분야 리스트
    private List<VcInvestFieldVO> investFieldList;

    // 관심활용기술 리스트
    private List<VcUtilTechVO> utilTechList;

    // 주요투자단계 리스트
    private List<VcInvestStepVO> investStepList;

    // 투자금액 범위
    private List<VcInvestAmountVO> investAmountList;

}
