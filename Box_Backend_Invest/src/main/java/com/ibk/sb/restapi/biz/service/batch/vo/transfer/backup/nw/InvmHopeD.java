package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("InvmHopeD")
@NoArgsConstructor
public class InvmHopeD extends NwIvtBaseVO {
    /** 기업 투자 희망 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("INVM_STG_CD")
    private String invmStgCd;
    @JsonProperty("INVM_AMT_CD")
    private String invmAmtCd;
    @JsonProperty("INVM_AMT")
    private Long invmAmt;
    @JsonProperty("OPPB_YN")
    private String oppbYn;

    /** 투자박스 신규 요청사항 건 관련 */
    @JsonProperty("OSIV_HOPEYN")
    private String osivHopeyn;
}