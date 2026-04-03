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
@Alias("Ivt101M")
@NoArgsConstructor
public class Ivt101M extends TsIvtBaseVO {
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("INVM_RQST_BZN")
    private String invmRqstBzn;
    @JsonProperty("USER_ID")
    private String userId;
    @JsonProperty("INVM_RQST_ENPR_NM")
    private String invmRqstEnprNm;
    @JsonProperty("ENIN_INRD_CON")
    private String eninInrdCon;
    @JsonProperty("BIZ_FILD_CON")
    private String bizFildCon;
    @JsonProperty("UTLZ_TCHN_CON")
    private String utlzTchnCon;
    @JsonProperty("HMPG_ADR")
    private String hmpgAdr;
    @JsonProperty("ALL_HOLD_STCK_CNT")
    private Long allHoldStckCnt;
    @JsonProperty("ALL_STCK_ISS_AMT")
    private Long allStckIssAmt;
    @JsonProperty("STCH_INFO_MNGM_NO")
    private String stchInfoMngmNo;
    @JsonProperty("EMP_CNT")
    private Integer empCnt;
    @JsonProperty("RSPR_NM")
    private String rsprNm;
    @JsonProperty("RSPR_JBCL_NM")
    private String rsprJbclNm;
    @JsonProperty("RSPR_DVM")
    private String rsprDvm;
    @JsonProperty("RSPR_CNPL_TPN")
    private String rsprCnplTpn;
    @JsonProperty("MNFR_BSNS_NM")
    private String mnfrBsnsNm;
    @JsonProperty("MNFR_BSNS_INRD_CON")
    private String mnfrBsnsInrdCon;
    @JsonProperty("IMG_NO")
    private String imgNo;
    @JsonProperty("HOPE_INIT_CON")
    private String hopeInitCon;
    @JsonProperty("HOPE_INVM_STG_ID")
    private String hopeInvmStgId;
    @JsonProperty("HOPE_INVM_ENMT_AMT")
    private Long hopeInvmEnmtAmt;
    @JsonProperty("HOPE_LOAN_ENMT_AMT")
    private Long hopeLoanEnmtAmt;
    @JsonProperty("EXST_INVM_ENMT_MNGM_NO")
    private String exstInvmEnmtMngmNo;
    @JsonProperty("IRRS_DAT_MNGM_NO")
    private String irrsDatMngmNo;
    @JsonProperty("ETC_DAT_MNGM_NO")
    private String etcDatMngmNo;
    @JsonProperty("PGRS_STTS_DCD")
    private String pgrsSttsDcd;
    @JsonProperty("SMS_RCV_YN")
    private String smsRcvYn;
    @JsonProperty("MAIL_RCV_YN")
    private String mailRcvYn;
    @JsonProperty("PUSH_RCV_YN")
    private String pushRcvYn;
    @JsonProperty("EXMN_CD")
    private String exmnCd;
    @JsonProperty("EXNT_RSLT_CD")
    private String exntRsltCd;
    @JsonProperty("EXNT_OPNN_CON")
    private String exntOpnnCon;
    @JsonProperty("EXNT_TS")
    private Timestamp exntTs;
    @JsonProperty("EXNT_RJCN_STTS_CD")
    private String exntRjcnSttsCd;
    @JsonProperty("EXNT_RJCN_CON")
    private String exntRjcnCon;
    @JsonProperty("BRCD")
    private String brcd;
    @JsonProperty("CORP_RRB_MNGM_NO")
    private String corpRrbMngmNo;

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
    @JsonProperty("RQST_FNSG_DD")
    private String rqstFnsgDd;

    public void setExntTs (Timestamp exntTs) {this.exntTs = exntTs;}
    public void setExntTs (String exntTs) throws Exception { this.exntTs = super.convertJsonStringToTimestamp(exntTs); }
}