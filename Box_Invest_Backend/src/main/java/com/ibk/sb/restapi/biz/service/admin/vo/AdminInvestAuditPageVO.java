package com.ibk.sb.restapi.biz.service.admin.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Alias("AdminInvestAuditPageVO")
@NoArgsConstructor
public class AdminInvestAuditPageVO extends PageVO {
	
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
    
    // 정렬 순 검색
    private String searchType;
    
    // 심사결과 검색
    private String searchResStatus;
    
    // 상태 검색
    private String searchStatus;
    
    public AdminInvestAuditPageVO(PageVO pageVO) {
        super(pageVO.getPage(), pageVO.getRecord(), pageVO.getPageSize());
    }

    public void setListStartType(IvtCode.AuditListTypeEnum auditListTypeEnum) {
        if(auditListTypeEnum == IvtCode.AuditListTypeEnum.COMPANY_RECEIVE) this.listStartType = ComCode.AUDIT_SUGGEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.COMPANY_SEND) this.listStartType = ComCode.AUDIT_REQUEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.VC_RECEIVE) this.listStartType = ComCode.AUDIT_REQUEST.getCode();
        else if(auditListTypeEnum == IvtCode.AuditListTypeEnum.VC_SEND) this.listStartType = ComCode.AUDIT_SUGGEST.getCode();
    }
}
