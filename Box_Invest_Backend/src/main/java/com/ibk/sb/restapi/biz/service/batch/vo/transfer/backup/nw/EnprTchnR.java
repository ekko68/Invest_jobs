package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("EnprTchnR")
@NoArgsConstructor
public class EnprTchnR extends NwIvtBaseVO {
    /** 기업별 활용 기술 맵핑 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("UTLZ_TCHN_SQN")
    private Integer utlzTchnSqn;
    @JsonProperty("UTLZ_TCHN_CD")
    private String utlzTchnCd;
}