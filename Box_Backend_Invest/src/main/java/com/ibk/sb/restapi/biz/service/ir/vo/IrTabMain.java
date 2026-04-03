package com.ibk.sb.restapi.biz.service.ir.vo;

/***
 * 각각의 IR 탭 Progress 계산 구현을 위한 인터페이스
 * 적용시킬 VO : InvestRelationVO (기본정보 탭), IrFinanceVO(재무정보 탭), IrExtraVO(제품/기술/시장 탭), IrPlanAndResult(성과 및 계획 탭)
 * 남은 주요연혁, 주요인력, 주주현황의 경우 리스트 유무로만 판단한다.
 */
public interface IrTabMain {

    public int calcIRTabProgress();

}
