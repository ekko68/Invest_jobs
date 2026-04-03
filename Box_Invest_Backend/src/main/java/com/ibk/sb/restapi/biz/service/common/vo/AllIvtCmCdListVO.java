package com.ibk.sb.restapi.biz.service.common.vo;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllIvtCmCdListVO {

    /* 필드 명명 기준 : 기존 controller 주소명 */

    // 투자분야
    private List<InvestFieldVO> categoryList;

    // 활용기술
    private List<UtilTechVO> techList;

    // 사업장 소재지 지역
    private List<ComCodeVO> regionList;

    // 주요투자업종
    private List<ComCodeVO> prmrInvmTpbsList;

    // 기업구분
    private List<ComCodeVO> companyTypeList;

    // 기업형태
    private List<ComCodeVO> companyShapeList;

    // 투자사유형
    private List<ComCodeVO> vcTypeList;

    // 투자희망단계
    private List<ComCodeVO> investStepList;

    // 투자희망금액
    private List<ComCodeVO> investAmountList;

    // 컨설팅유형
    private List<ComCodeVO> consultingTypeList;

    // 컨설팅상태
    private List<ComCodeVO> consultingStepList;

    // 메시지유형
    private List<ComCodeVO> messageTypeList;

    // IR 국내외구분지표
    private List<ComCodeVO> irDomesticList;

    // IR 지적재산권상태
    private List<ComCodeVO> irIpStatusList;

    // IR 주요지표
    private List<ComCodeVO> irIndexList;

    // Qna 상태
    private List<ComCodeVO> qaStatusList;

    // Qna 유형
    private List<ComCodeVO> qaTypeList;

    // 투자사 전환상태
    private List<ComCodeVO> vcConvertStatusList;

    // 투자 심사 단계
    private List<ComCodeVO> auditStepTypeList;

    // 투자 심사 결과
    private List<ComCodeVO> auditResultTypeList;
}
