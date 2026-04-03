package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("ExntRqstM")
public class ExntRqstM extends NwIvtBaseVO {
    /** 투자 심사 요청 정보 */
    @JsonProperty("INVM_EXNT_RQST_ID")
    private String invmExntRqstId;
    @JsonProperty("INVM_CMP_ID")
    private String invmCmpId;
    @JsonProperty("RQST_ENPR_ID")
    private String rqstEnprId;
    @JsonProperty("ANNC_DAT_FILE_ID")
    private String anncDatFileId;
    @JsonProperty("ADDT_DOC_FILE_ID")
    private String addtDocFileId;
    @JsonProperty("PBRL_PICT_URL")
    private String pbrlPictUrl;
    @JsonProperty("SCPG_RQST_NO")
    private String scpgRqstNo;
    @JsonProperty("RQST_MSG_CON")
    private String rqstMsgCon;
    @JsonProperty("PRPL_MSG_CON")
    private String prplMsgCon;
    @JsonProperty("EXNT_MSG_CON")
    private String exntMsgCon;
    @JsonProperty("INQ_ABL_NDD")
    private Integer inqAblNdd;

    /** 투자박스 신규 요청사항 건 관련 */

    @JsonProperty("BRCD")
    private String brcd;
    @JsonProperty("EMN")
    private String emn;
    @JsonProperty("EMM")
    private String emm;
    @JsonProperty("TCB_TCHN_GRD")
    private String tcbTchnGrd;
    @JsonProperty("INCF_CD1")
    private String incfCd1;
    @JsonProperty("INCF_CD2")
    private String incfCd2;
    @JsonProperty("INCF_CD3")
    private String incfCd3;

    @JsonProperty("EXNT_RSLT_CD")
    private String exntRsltCd;
    @JsonProperty("EXNT_RSPR_ID")
    private String exntRsprId;
    @JsonProperty("INVM_PRFR_SCDL_AMT")
    private Long invmPrfrScdlAmt;
    @JsonProperty("EXNT_RSLT_RMRK")
    private String exntRsltRmrk;
    @JsonProperty("INVMCROF_REPNM")
    private String invmcrofRepnm;
}