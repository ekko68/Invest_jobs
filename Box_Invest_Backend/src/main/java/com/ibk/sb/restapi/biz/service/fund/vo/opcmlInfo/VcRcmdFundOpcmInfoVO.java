package com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("VcRcmdFundOpcmInfoVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class VcRcmdFundOpcmInfoVO extends BaseTableVO {

    // 펀드추천ID
    private String fundRcmdId;

    // 운용사명
    private String opcmNm;

    // 사업자번호
    private String bsnnNo;

    // 대표이사명
    private String rpdirNm;

    // 회사주소
    private String cmpnAdr;

    // 설립년월일
    private String incrYmd;

    // 펀드시작년월일
    private String fundSttgYmd;

    // 자본총계금액
    private Long cptsTtsmAmt;

    // 납입자본금액
    private Long pcapAmt;

    // 징계여부
    private String adcpYn;

    // 최근회계연도
    private String msrnAcngYy;

    // 자산총계금액
    private Long astTtsmAmt;

    // 부채총계금액
    private Long lbltTtsmAmt;

    // 영업수익금액
    private Long boerAmt;

    // 영업비용
    private Long bsopExp;

    // 당기순이익금액
    private Long ctnpAmt;

    // 1년전 자산총계금액
    private Long by1AstTtsmAmt;

    // 2년전 자산총계금액
    private Long by2AstTtsmAmt;

    // 1년전 부채총계금액
    private Long by1LbltTtsmAmt;

    // 2년전 부채총계금액
    private Long by2LbltTtsmAmt;

    // 1년전 자본총계금액
    private Long by1CptsTtsmAmt;

    // 2년전 자본총계금액
    private Long by2CptsTtsmAmt;

    // 1년전 영업수익금액
    private Long by1BsopErnnAmt;

    // 2년전 영업수익금액
    private Long by2BsopErnnAmt;

    // 1년전 영업비용금액
    private Long by1BsopExpAmt;

    // 2년전 영업비용금액
    private Long by2BsopExpAmt;

    // 1년전 당기순이익금액
    private Long by1CtnpAmt;

    // 2년전 당기순이익금액
    private Long by2CtnpAmt;

    // 운용펀드수
    private int mnivFundCnt;

    // 운용펀드 금액
    private int mnivFundAmt;

    // 블라인드 펀드수
    private int blndFundCnt;

    // 블라인드 펀드금액
    private int blndFundAmt;

    // 프로젝트 펀드수
    private int prjFundCnt;

    // 프로젝트 펀드금액
    private int prjFundAmt;

    // 청산펀드 수익율
    private String lqdnFundErnnRt;

    // 펀드 소진율
    private String fundExhsRt;

    // 운용사 운용인력 수
    private int opcmMnivHmrsCnt;

    // 대표펀드매니저명
    private String rprsFundMgrNm;

    // 운용인력 징계여부
    private String mnivHmrsAdcpYn;

    // 전담관리 직원 수
    private int whrsAdemCnt;

    // 자격증 보유 직원 수
    private int qlcrHoldEmpCnt;

    // 공동운용사 여부
    private String jntOpcmYn;

    // 대표 운용사명
    private String rprsOpcmNm;

    // 간접투자 업무시스템 최초등록ID
    private String iibsFrrgId;

    // 간접투자 업무시스템 최초등록일시
    private Timestamp iibsFrrgTs;

    // 간접투자 업무시스템 최종변경ID
    private String iibsLsmdId;

    // 간접투자 업무시스템 최종변경일시
    private Timestamp iibsLsmdTs;

}
