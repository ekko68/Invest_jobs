package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("ExntPgsgR")
public class ExntPgsgR extends NwIvtBaseVO {
    /** 투자 심사 진행 단계 목록 */
    @JsonProperty("INVM_EXNT_RQST_ID")
    private String invmExntRqstId;
    @JsonProperty("INVM_EXNT_PGSG_CD")
    private String invmExntPgsgCd;
}