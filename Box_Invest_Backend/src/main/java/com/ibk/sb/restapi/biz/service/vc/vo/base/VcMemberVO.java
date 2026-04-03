package com.ibk.sb.restapi.biz.service.vc.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcMemberVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcMemberVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_TMMB_L
     * DESC : 투자사 대표심사역 정보
     */

    // 투자사 이용기관(회사) ID
    private String utlinsttId;

    // 대표심사역 ID
    private String rprsCrofId;

    // 대표심사역 명
    private String rprsCrofNm;

    // 대표심사역 직급
    private String rprsCrofJbcl;

    // 경력정보
    private String crrCon;

    // 파일 아이디
    @JsonIgnore
    private String crofImgFileId;
    private String fileId;

}
