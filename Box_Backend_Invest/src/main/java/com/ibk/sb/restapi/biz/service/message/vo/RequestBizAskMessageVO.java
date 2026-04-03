package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestBizAskMessageVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class RequestBizAskMessageVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_ENPR_INQR_D
     * DESC : 사업 문의
     */

    // 이용기관(회사) ID (문의대상)
    private String utlinsttId;

    // 등록(문의)자 이용기관 ID
//    private String rcvUtlinsttId;
    private String rgsrUsisId;

    // 사업문의 ID
    private String bsnsInqrId;

    // 문의 제목
    private String inqrTtl;

    // 문의 내용
    private String inqrCon;

    // 발신 메시지 ID
    @JsonIgnore
    private String dsmsMsgId;

}
