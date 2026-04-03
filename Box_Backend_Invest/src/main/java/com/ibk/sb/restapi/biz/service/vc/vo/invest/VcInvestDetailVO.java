package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VentureCapitalBasicVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VcInvestDetailVO")
public class VcInvestDetailVO {

    // 기본정보
    private VentureCapitalBasicVO basicData;

    // 관심투자분야
    private List<VcInvestFieldVO> investFieldList;

    // 관심투자활용기술
    private List<VcUtilTechVO> utilTechList;

    // 주요투자단계
    private List<VcInvestStepVO> investStepList;

    // 관심투자지역
    private List<VcInvestRegionVO> investRegionList;

    // 주요투자금액단계
    private VcInvestAmountVO investAmount;

    // 투자사 전환 요청 확인 정보
    private AdminVcConvertRequestVO convertInfo;

}
