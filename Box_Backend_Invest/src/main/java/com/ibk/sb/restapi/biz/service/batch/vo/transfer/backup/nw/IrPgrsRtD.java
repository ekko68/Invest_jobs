package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrPgrsRtD")
@NoArgsConstructor
public class IrPgrsRtD extends NwIvtBaseVO {
    /** 기업IR 진행률 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("BSIN_PGRS_RT")
    private Integer bsinPgrsRt;
    @JsonProperty("PRMR_ORDV_PGRS_RT")
    private Integer prmrOrdvPgrsRt;
    @JsonProperty("PRMR_HMRS_PGRS_RT")
    private Integer prmrHmrsPgrsRt;
    @JsonProperty("STCH_PSST_PGRS_RT")
    private Integer stchPsstPgrsRt;
    @JsonProperty("FNAM_PGRS_RT")
    private Integer fnamPgrsRt;
    @JsonProperty("PRDT_TCHN_INFO_PGRS_RT")
    private Integer prdtTchnInfoPgrsRt;
    @JsonProperty("OTCM_PLAN_INFO_PGRS_RT")
    private Integer otcmPlanInfoPgrsRt;
}
