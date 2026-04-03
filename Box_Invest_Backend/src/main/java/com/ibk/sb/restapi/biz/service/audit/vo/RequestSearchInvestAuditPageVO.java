package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchInvestAuditPageVO")
@NoArgsConstructor
public class RequestSearchInvestAuditPageVO extends PageVO {

    // 기업 타입 구분 상수값
    @JsonIgnore
    private final String COM_TYPE = IvtCode.UsisTypeEnum.COMPANY.getType();
    @JsonIgnore
    private final String VC_TYPE = IvtCode.UsisTypeEnum.VC.getType();

    // 투자심사 리스트 조회 조건 상수값
    @JsonIgnore
    private final String AUDIT_SUGGEST_CODE = ComCode.AUDIT_SUGGEST.getCode(); // EXN00000
    @JsonIgnore
    private final String AUDIT_REQUEST_CODE = ComCode.AUDIT_REQUEST.getCode(); // EXN00001
    @JsonIgnore
    private final String AUDIT_EVALUATE_CODE = ComCode.AUDIT_EVALUATE.getCode(); // EXN00002
    @JsonIgnore
    private final String AUDIT_COMPLETE_CODE = ComCode.AUDIT_COMPLETE.getCode(); // EXN00003
    @JsonIgnore
    private final String AUDIT_EXPIRED_CODE = ComCode.AUDIT_EXPIRED.getCode(); // EXN00004
    @JsonIgnore
    private final String AUDIT_CANCEL_CODE = ComCode.AUDIT_CANCEL.getCode(); // EXN00005

    // 투자사 or 기업 ID
    @JsonIgnore
    private String utlinsttId;

    // 투자사 or 기업 구분
    // IvtCode.UsisTypeEnum의 Type값
    private String comType;

    // 투자심사 리스트 조회 시작 타입
    @JsonIgnore
    private String listStartType;
    // private String auditType;

    // 투자심사요청 limit check 확인
    // -> false일 경우 최신상태에서 cancel과 compelete 제외
    @JsonIgnore
    private boolean checkLimit = false;

    // 투자심사 진행단계 코드
    private String invmExntPgsgCd;

    // 사업자번호
    private String bizrno;
    
    // 기업명 검색
    private String searchComNm;
    
    // 사업자 등록 검색
    private String searchBzn;
    
    // 시작일자 검색
    private String searchFromDate;
    
    // 종료일자 검색
    private String searchToDate;

    // 접수 구분
    private String investRcdt;

    public RequestSearchInvestAuditPageVO(PageVO pageVO) {
        super(pageVO.getPage(), pageVO.getRecord(), pageVO.getPageSize());
    }

    public void setListStartType(IvtCode.AuditListTypeEnum auditListTypeEnum) {
        if(auditListTypeEnum == IvtCode.AuditListTypeEnum.COMPANY_RECEIVE) this.listStartType = ComCode.AUDIT_SUGGEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.COMPANY_SEND) this.listStartType = ComCode.AUDIT_REQUEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.VC_RECEIVE) this.listStartType = ComCode.AUDIT_REQUEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.VC_SEND) this.listStartType = ComCode.AUDIT_SUGGEST.getCode();
    }
}
