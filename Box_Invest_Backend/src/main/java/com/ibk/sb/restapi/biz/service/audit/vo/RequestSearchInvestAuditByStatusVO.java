package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("RequestSearchInvestAuditByStatusVO")
public class RequestSearchInvestAuditByStatusVO {

    // 기업 타입 구분 상수값
    @JsonIgnore
    private final String COM_TYPE = IvtCode.UsisTypeEnum.COMPANY.getType();
    @JsonIgnore
    private final String VC_TYPE = IvtCode.UsisTypeEnum.VC.getType();

    // 투자심사 시작 상태코드 (제안 or 요청 or 둘다)
    List<String> startStgCdList;

    // 투자심사 최종 상태코드 리스트
    List<String> endStgCdList;

    // 검색 기준 이용기관 아이디
    String utlinsttId;

    // 검색 기준 이용기관 타입 (IvtCode.UsisTypeEnum의 타입값)
    String comType;

    public RequestSearchInvestAuditByStatusVO(List<String> startStgCdList, List<String> endStgCdList, String utlinsttId, String comType) {
        this.startStgCdList = startStgCdList;
        this.endStgCdList = endStgCdList;
        this.utlinsttId = utlinsttId;
        this.comType = comType;
    }
}
