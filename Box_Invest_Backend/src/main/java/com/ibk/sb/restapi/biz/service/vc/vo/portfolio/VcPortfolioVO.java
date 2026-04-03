package com.ibk.sb.restapi.biz.service.vc.vo.portfolio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPortfolioVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPortfolioVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_PRTF_L
     * DESC : 투자사 포트폴리오
     */

    // 투자 사 이용기관(회사) ID
    private String utlinsttId;

    // 포트폴리오 ID
    private String prtfId;

    // 투자분야 ID
    private String invmFildCd;

    // 활용기술 ID
    private String utlzTchnCd;

    // 투자기관명
    private String invmEnprNm;

    // 투자기관 로고 이미지
    @JsonIgnore
    private String invmEnprLgtyImgId;
    private String fileId;

    // 투자단계코드
    private String invmStgCd;

    // 투자금액
    private Long invmAmt;

    // 투자집행 날짜
    private String invmPrfrDt;

    // 공개여부
    private String oppbYn;

    /** JOIN **/
    // 투자분야 명
    private String invmFildNm;

    // 활용기술 명
    private String utlzTchnNm;

    // 투자단계명
    private String invmStgNm;
}
