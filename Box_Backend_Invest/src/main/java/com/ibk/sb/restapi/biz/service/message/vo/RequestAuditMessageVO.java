package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestAuditMessageVO")
public class RequestAuditMessageVO extends PageVO {

    // 투자심사 메시지 리스트 조회는 투자심사 문의에 한정함 (알림 제외)
    @JsonIgnore
    private final String MESSAGE_AUDIT_CODE = ComCode.MESSAGE_AUDIT.getCode();

    // 투자심사 ID
    private String invmExntRqstId;

    // 사업자번호
    // BizrnoInvestAuditController 사용
    private String bizrno;

}
