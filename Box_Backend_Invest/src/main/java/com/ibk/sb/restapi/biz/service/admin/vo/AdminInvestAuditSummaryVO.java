package com.ibk.sb.restapi.biz.service.admin.vo;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("AdminInvestAuditSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "amnnUserId",
        "totalCnt", "rgsnTs", "rgsnUserNm", "amnnUserNm", "imgFileId"
})
public class AdminInvestAuditSummaryVO extends BaseTableVO {

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

    // 투자 심사 제안/요청 받은 날짜 (투자심사 시작일)
    @JsonFormat(pattern = "yyyyMMdd", timezone = "Asia/Seoul")
    private Timestamp invmSttgDt;

    // 사업자 등록번호
    private String bzn;

    // 추천영업점
    private String brcd;

    // 추천영업점명
    private String brcdNm;

    // 업종
    private String mainBizcnd;

    // 업종명
    private String mainBizcndNm;

    // 심사결과코드
    private String exntRsltCd;

    // 심사결과명
    private String exntRsltCdNm;

    // 투자예상액
    private String invmPrfrScdlAmt;

    // 투자비고
    private String exntRsltRmrk;

    // 심사메세지
    private String exntMsgCon;

    // 투자심사 수정 날짜
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;

}
