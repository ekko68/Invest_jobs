package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrSStchL")
@NoArgsConstructor
public class IrSStchL extends NwIvtBaseVO {
    /** 기업IR 주주 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("STCH_SQN")
    private Integer stchSqn;
    @JsonProperty("STCH_NM")
    private String stchNm;
    @JsonProperty("PFST_HOLD_CNT")
    private Long pfstHoldCnt;
    @JsonProperty("PFST_PVPR")
    private Long pfstPvpr;
    @JsonProperty("PFST_AMT")
    private Long pfstAmt;
    @JsonProperty("CMSC_HOLD_CNT")
    private Long cmscHoldCnt;
    @JsonProperty("CMSC_PVPR")
    private Long cmscPvpr;
    @JsonProperty("CMSC_AMT")
    private Long cmscAmt;
    @JsonProperty("PRRA")
    private Double prra;
    @JsonProperty("RMRK")
    private String rmrk;
}
