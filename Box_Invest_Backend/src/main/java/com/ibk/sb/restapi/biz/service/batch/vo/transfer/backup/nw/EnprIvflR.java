package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("EnprIvflR")
@NoArgsConstructor
public class EnprIvflR extends NwIvtBaseVO {
    /** 기업별 투자 분야 맵핑 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("IVFL_SQN")
    private Integer ivflSqn;
    @JsonProperty("INVM_FILD_CD")
    private String invmFildCd;
}