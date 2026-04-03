package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrBInvmD")
@NoArgsConstructor
public class IrBInvmD extends NwIvtBaseVO {
    /** 기업IR 투자유치 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("INVM_ENMT_SQN")
    private Integer invmEnmtSqn;
    @JsonProperty("INVM_ENMT_YM")
    private String invmEnmtYm;
    @JsonProperty("INVM_ENMT_ETNM")
    private String invmEnmtEtnm;
    @JsonProperty("INVM_ENMT_AMT")
    private Long invmEnmtAmt;
}
