package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.biz.service.ir.vo.IrTabMain;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("IrPlanAndResultVO")
public class IrPlanAndResultVO implements IrTabMain {

    // 투자유치 성과 리스트
    private List<IrInvestResultVO> investList;
    // 진행률 계산용
    @JsonIgnore
    private int calInvestList;

    // 수상실적 리스트
    private List<IrAwardResultVO> awardList;
    // 진행률 계산용
    @JsonIgnore
    private int calAwardList;

    // 수출실적 리스트
    private List<IrExportResultVO> exportList;
    // 진행률 계산용
    @JsonIgnore
    private int calExportList;

    // 정책자금 리스트
    private List<IrPolicyFundVO> policyFundList;
    // 진행률 계산용
    @JsonIgnore
    private int calPolicyFundList;

    // 주요계획 리스트
    private List<IrMainPlanVO> planList;
    // 진행률 계산용
    @JsonIgnore
    private int calPlanList;


    /** IR 성과 및 계획 탭 진행률 비중 계산
     * 주요성과 5%
     * 주요계획 5%
     */
    @Override
    public int calcIRTabProgress() {

        int sum = 0;
        
        // 주요성과 (4개 리스트 중 하나라도 있으면 됨)
        int[] listArr = {this.calInvestList, this.calAwardList, this.calExportList, this.calPolicyFundList};
        boolean cntFlg = false;
        for(int item : listArr) {
            if(item > 0) cntFlg = true;
        }
        sum = cntFlg ? ++sum : sum;

        // 주요계획
        sum = (this.planList != null && this.planList.size() > 0 && this.calPlanList > 0) ? ++sum : sum;

        // 진행도 계산 (각 5%)
        return sum * 5;
    }

}
