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
@Alias("Ivt201M")
@NoArgsConstructor
public class Ivt201M extends TsIvtBaseVO {
    @JsonProperty("SCPG_RQST_NO")
    private String scpgRqstNo;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("USER_ID")
    private String userId;
    @JsonProperty("SCPG_BZN")
    private String scpgBzn;
    @JsonProperty("DOC_SBMS_TS")
    private Timestamp docSbmsTs;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;

    public void setDocSbmsTs(Timestamp docSbmsTs) { this.docSbmsTs = docSbmsTs; }
    public void setDocSbmsTs(String docSbmsTs) throws Exception { this.docSbmsTs = super.convertJsonStringToTimestamp(docSbmsTs); }
}