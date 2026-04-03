package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class NwIvtBackupVO {

    /** 첨부파일은 제외 -> 투자심사, 기업제품 쪽 첨부파일에서 논리삭제할 아이디를 추려서 처리 */
    /** @Alias 적용을 위해 내부클래스가 아니라 각각 class 파일 생성 */

    // 투자심사
    @JsonProperty("TB_BOX_IVT_EXNT_RQST_M")
    private List<ExntRqstM> exntRqstMList;
    // 투자심사단계
    @JsonProperty("TB_BOX_IVT_EXNT_PGSG_R")
    private List<ExntPgsgR> exntPgsgRList;
    // 기업제출간편서류
    @JsonProperty("TB_BOX_IVT_SIMP_DOC_L")
    private List<SimpDocL> simpDocLList;
    // 기업상세
    @JsonProperty("TB_BOX_IVT_ENPR_INFO_D")
    private List<EnprInfoD> enprInfoDList;
    // 기업제품
    @JsonProperty("TB_BOX_IVT_ENPR_PRDT_L")
    private List<EnprPrdtL> enprPrdtLList;
    // 기업투자희망
    @JsonProperty("TB_BOX_IVT_INVM_HOPE_D")
    private List<InvmHopeD> invmHopeDList;
    // 기업비즈니스분야
    @JsonProperty("TB_BOX_IVT_ENPR_IVFL_R")
    private List<EnprIvflR> enprIvflRList;
    // 기업활용기술
    @JsonProperty("TB_BOX_IVT_ENPR_TCHN_R")
    private List<EnprTchnR> enprTchnRList;
    // 기업IR기본
    @JsonProperty("TB_BOX_IVT_IR_B_BSIN_M")
    private List<IrBBsinM> irBBsinMList;
    // 기업IR제품
    @JsonProperty("TB_BOX_IVT_IR_P_PRDT_D")
    private List<IrPPrdtD> irPPrdtDList;
    // 기업IR투자유치
    @JsonProperty("TB_BOX_IVT_IR_B_INVM_D")
    private List<IrBInvmD> irBInvmDList;
    // 기업IR주주
    @JsonProperty("TB_BOX_IVT_IR_S_STCH_L")
    private List<IrSStchL> irSStchLList;
    // 기업IR진행률
    @JsonProperty("TB_BOX_IVT_IR_PGRS_RT_D")
    private List<IrPgrsRtD> irPgrsRtDList;


    // 투자사 포트폴리오 (추가)
    @JsonProperty("TB_BOX_IVT_VC_PRTF_L")
    private List<VcPrtfL> vcPrtfLList;
}
