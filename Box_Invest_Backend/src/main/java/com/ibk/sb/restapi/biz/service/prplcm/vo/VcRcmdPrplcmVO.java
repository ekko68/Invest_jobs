package com.ibk.sb.restapi.biz.service.prplcm.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("VcRcmdPrplcmVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class VcRcmdPrplcmVO extends BaseTableVO  {

    // 사업자번호
    private String bsnnNo;

    // 추천ID
    private String enprRcmdId;

    // 운용사명
    private String opcmNm;

    // 담당심사역명
    private String rscfNm;

    // 연락처 내용
    private String cnplCon;

    // 이메일 내용
    private String emlCon;

    // 기업명
    private String enprNm;

    // 주요사업내용
    private String prmrBsnsCon;

    // 리드투자자 운용사명
    private String leadInvmOpcmNm;

    // 투자금액
    private int invmAmt;

    // 단계명
    private String stgNm;

    // 투자종료년월일
    private String invmFnshYmd;

    // 투자유치합계시작금액
    private String invmEnmtSumSttgAmt;

    // 투자유치이전기업가치시작금액
    private String invmEnmtEtvlSttgAmt;

    // 투자유치합계종료금액
    private int invmEnmtSumFnshAmt;

    // 투자유치이전기업가치종료금액
    private int invmEnmtEtvlFnshAmt;

    // 추천의견내용
    private String rcmdOpnnCon;

    // 확인여부
    private String cnfaYn;

    // 메모
    private String memoCon;
    
    // 취소여부
    private String cnclYn;

    // 간접투자 업무시스템 최초등록ID
    private String iibsFrrgId;

    // 간접투자 업무시스템 최초등록일시
    private Timestamp iibsFrrgTs;

    // 간접투자 업무시스템 최종변경ID
    private String iibsLsmdId;

    // 간접투자 업무시스템 최종변경일시
    private Timestamp iibsLsmdTs;

}
