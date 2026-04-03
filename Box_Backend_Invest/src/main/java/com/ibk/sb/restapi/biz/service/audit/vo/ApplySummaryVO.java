package com.ibk.sb.restapi.biz.service.audit.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("ApplySummaryVO")
public class ApplySummaryVO {

    // 투자 심사 요청 ID
    private String invmExntRqstId;

    // 요청 기업 ID
    private String rqstEnprId;

    // 기업 사업자명
    private String rqstBplcNm;

    // 투자 심사 진행단계 코드
    private String invmExntPgsgCd;
    private String invmExntPgsgNm;
}
