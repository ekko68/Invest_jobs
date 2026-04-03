package com.ibk.sb.restapi.biz.service.vc.vo.pagelink;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPageFaqVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPageFaqVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_PG_FAQ_L
     * DESC : 투자사전용 페이지 FAQ 목록
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자사 전용 페이지 ID
    private String invmCmpExusPageId;

    // FAQ 순번
    private Integer faqSqn;

    // FAQ 질문
    private String faqQstn;

    // FAQ 답변
    private String faqRply;

}
