package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Alias("Ivt301M")
@NoArgsConstructor
public class Ivt301M extends TsIvtBaseVO {
    @JsonProperty("EXNT_INFO_SRN")
    private String exntInfoSrn;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("INVM_USIS_ID")
    private String invmUsisId;
    @JsonProperty("APLC_AMT")
    private Long aplcAmt;
    @JsonProperty("APLC_TS")
    private Timestamp aplcTs;
    @JsonProperty("PGRS_STTS_CD")
    private String pgrsSttsCd;
    @JsonProperty("EXNT_FNSG_TS")
    private Timestamp exntFnsgTs;

    public void setAplcTs(Timestamp aplcTs) { this.aplcTs = aplcTs; }
    public void setAplcTs(String aplcTs) throws Exception { this.aplcTs = super.convertJsonStringToTimestamp(aplcTs); }

    public void setExntFnsgTs(Timestamp exntFnsgTs) { this.exntFnsgTs = exntFnsgTs; }
    public void setExntFnsgTs(String exntFnsgTs) throws Exception { this.exntFnsgTs = super.convertJsonStringToTimestamp(exntFnsgTs); }
}
