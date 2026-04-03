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
@Alias("VcRcmdFundPartCptnVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class VcRcmdFundPartCptnVO extends BaseTableVO {

    // 펀드추천ID
    private String fundRcmdId;

    // 등록순번
    private int rgsnSqn;

    // 참여자명
    private String ptcnNm;

    // 투자경력년수
    private int invmCrrNyy;

    // 근속년수
    private int ctsvNyy;

    // 최근 5년 투자금액
    private int msrnYy5InvmAmt;

    // 최근 10년 투자 실적금액
    private int msrnYy10InvmAcrsAmt;

    // 최근 10년 회수 실적금액
    private int msrnYy10RtrvAcrsAmt;

    // 간접투자 업무시스템 최초등록ID
    private String iibsFrrgId;

    // 간접투자 업무시스템 최초등록일시
    private Timestamp iibsFrrgTs;

    // 간접투자 업무시스템 최종변경ID
    private String iibsLsmdId;

    // 간접투자 업무시스템 최종변경일시
    private Timestamp iibsLsmdTs;

}
