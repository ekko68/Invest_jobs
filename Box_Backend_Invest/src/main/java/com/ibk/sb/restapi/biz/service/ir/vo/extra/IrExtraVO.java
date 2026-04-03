package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.biz.service.ir.vo.IrTabMain;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.springframework.util.StringUtils;

import java.util.List;

@Getter
@Setter
@Alias("IrExtraVO")
public class IrExtraVO implements IrTabMain {

    // 제품 설명
    private IrProductVO product;

    // 주요 매출처 리스트
    private List<IrMainSaleVO> saleList;
    // 진행률 계산용
    @JsonIgnore
    private int calSaleList;

    // 주요 보유기술 설명
    private IrTechVO tech;

    // 지적재산권 리스트
    private List<IrIpStateVO> ipList;
    // 진행률 계산용
    @JsonIgnore
    private int calIpList;

    // 시장 정보
    private IrMarketVO market;

    // 시장 목표 리스트
    private List<IrMarketTargetVO> marketTargetList;
    // 진행률 계산용
    @JsonIgnore
    private int calMarketTargetList;

    // 시장 플레이어 리스트
    private List<IrMarketPlayerVO> marketPlayerList;
    // 진행률 계산용
    @JsonIgnore
    private int calMarketPlayerList;


    /** IR 제품/기술/시장 탭 비중 계산
     * 제품 설명 5%
     * 제품 특징 차별점 5%
     * 주요 매출처 5%
     * 주요 보유기술 5%
     * 장점 특징 차별성 5% (기술)
     * 지적재산권현황 5%
     * 시장리서치 5%
     * 장점/특징/차별성 5% (시장)
     */
    @Override
    public int calcIRTabProgress() {

        int sum = 0;

        // 제품 설명
        sum = StringUtils.hasLength(this.product.getPrdtDesc()) ? ++sum : sum;
        // 제품 특징 및 차별정
        sum = StringUtils.hasLength(this.product.getPrdtChrc()) ? ++sum : sum;
        // 주요매출처
        sum = (this.saleList != null && this.saleList.size() > 0 && this.calSaleList > 0) ? ++sum : sum;
        // 주요보유기술
        sum = StringUtils.hasLength(this.tech.getHoldTchnDesc()) ? ++sum : sum;
        // 장점/특징/차별점(기술)
        sum = StringUtils.hasLength(this.tech.getHoldTchnChrc()) ? ++sum : sum;
        // 지적재산권 현황
        sum = (this.ipList != null && this.ipList.size() > 0 && this.calIpList > 0) ? ++sum : sum;
        // 시장리서치
        sum = StringUtils.hasLength(this.market.getMrktInvgDesc()) ? ++sum : sum;
        // 장점/특징/차별성 (시장)
        sum = StringUtils.hasLength(this.market.getMrktChrc()) ? ++sum : sum;

        // 진행도 계산 (각 5%)
        return sum * 5;
    }
}
