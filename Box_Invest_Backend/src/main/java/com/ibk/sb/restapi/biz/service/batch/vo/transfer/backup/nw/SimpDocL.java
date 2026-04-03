package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("SimpDocL")
@NoArgsConstructor
public class SimpDocL extends NwIvtBaseVO {
    /** 기업별 간편서류 등록 정보 목록 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("SIMP_DOC_RGSN_ID")
    private String simpDocRgsnId;
    @JsonProperty("DEL_YN")
    private String delYn;
}
