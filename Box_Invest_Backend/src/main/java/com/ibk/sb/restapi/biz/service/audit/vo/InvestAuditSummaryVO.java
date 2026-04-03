package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("InvestAuditSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "amnnUserId", "amnnTs",
        "totalCnt", "rgsnTs", "rgsnUserNm", "amnnUserNm", "imgFileId"
})
public class InvestAuditSummaryVO extends BaseTableVO {

    // 투자 심사 요청 ID
    private String invmExntRqstId;

    // 제안 투자사 ID
    private String invmCmpId;

    // 요청 기업 ID
    private String rqstEnprId;

    // 투자사 사업자명
    private String invmCmpBplcNm;

    // 기업 사업자명
    private String rqstBplcNm;

    // 제안 투자사 유형
    private String invmCmpPtrnCd;
    private String invmCmpPtrnNm;

    // 요청 기업 구분
    private String enprDsncClsfCd;
    private String enprDsncClsfNm;

    // 투자 심사 진행단계 코드
    private String invmExntPgsgCd;

    // 투자 심사 진행단계명
    private String invmExntPgsgNm;

    // 투자 심사 제안|요청 메시지
    // 제안 메시지
    private String prplMsgCon;

    // 요청 메시지
    private String rqstMsgCon;

    // 투자 예정금액
    private Integer invmPrfrScdlAmt;

    // 투자 심사 제안/요청 받은 날짜 (투자심사 시작일)
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp invmSttgDt;

    // 투자심사요청 분기처리로 인한 추가
    // 사업자등록번호
    private String comBzn;

    private String vcBzn;

    // 설립일자
    private String comIncrYmd;

    private String vcIncrYmd;
}
