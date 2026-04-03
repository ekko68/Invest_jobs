package com.ibk.sb.restapi.biz.service.fund.vo.prdInfo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("VcRcmdFundPrdtInfoVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class VcRcmdFundPrdtInfoVO extends BaseTableVO  {

    // 펀드 추천 ID
    private String fundRcmdId;

    // 제안펀드 유형코드
    private String prplFundTcd;

    // 펀드결성 목표금액
    private int fundOrgzGoalAmt;

    // IBK 출자제안금액
    private int ibkFncnPrplAmt;

    // 기준수익율
    private int bserRt;

    // 존속 기간년수
    private String asceTrmNyy;

    // 성과보수율
    private int otcmRmnrRt;

    // 투자기간년수
    private String ivtmNyy;

    // 관리보수율
    private int mngmRmnrRt;

    // 출자금 납부방법 코드
    private String fnmnPmntMcd;

    // 투자대상내용
    private String ivgtCon;

    // 답변내용
    private String rplyCon;

    // 작성일시
    private Timestamp wrtnTs;

    // 펀드명
    private String fundNm;

    // 운용사 출자금액
    private int opcmFncnAmt;

    // 제안서 기준년월일
    private String prdoBaseYmd;

    // 제안펀드 구분코드
    private String prplFundDcd;

    // 간접투자 업무시스템 최초등록ID
    private String iibsFrrgId;

    // 간접투자 업무시스템 최초등록일시
    private Timestamp iibsFrrgTs;

    // 간접투자 업무시스템 최종변경ID
    private String iibsLsmdId;

    // 간접투자 업무시스템 최종변경일시
    private Timestamp iibsLsmdTs;

}
