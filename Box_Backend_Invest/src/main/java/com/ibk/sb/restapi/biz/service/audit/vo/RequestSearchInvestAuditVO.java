package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchInvestAuditVO")
@NoArgsConstructor
@AllArgsConstructor
public class RequestSearchInvestAuditVO {

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

    // 투자심사 ID
    @JsonIgnore
    private String invmExntRqstId;
}
