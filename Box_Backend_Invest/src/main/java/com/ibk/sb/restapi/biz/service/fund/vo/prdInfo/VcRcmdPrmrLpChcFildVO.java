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
@Alias("VcRcmdPrmrLpChcFildVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})

public class VcRcmdPrmrLpChcFildVO extends BaseTableVO {
    // 펀드추천ID
    private String fundRcmdId;

    // 등록순번
    private int rgsnSqn;

    // 출자기관명
    private String fncnInttNm;

    // 지원분야내용
    private String sprnFildCon;

    // 지원금액
    private int sprnAmt;

    // 간접투자 업무시스템 최초등록ID
    private String iibsFrrgId;

    // 간접투자 업무시스템 최초등록일시
    private Timestamp iibsFrrgTs;

    // 간접투자 업무시스템 최종변경ID
    private String iibsLsmdId;

    // 간접투자 업무시스템 최종변경일시
    private Timestamp iibsLsmdTs;
}
