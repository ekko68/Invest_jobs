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
@Alias("FundStchCnfgVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserNm", "amnnUserNm",
        "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FundStchCnfgVO extends BaseTableVO {

    // 펀드ID
    private String fundId;

    // 등록순번
    private int rgsnSqn;

    // 주주명
    private String stchNm;

    // 지분액
    private int prtnAmt;

    // 지분율
    private float prtnRto;

    // 비고
    private String rmrk;

    // 등록 사용자
    private String rgsnUserId;

    // 등록일시
    private Timestamp rgsnTs;

    // 수정 사용자
    private String amnnUserId;

    // 수정일시
    private Timestamp amnnTs;

}
