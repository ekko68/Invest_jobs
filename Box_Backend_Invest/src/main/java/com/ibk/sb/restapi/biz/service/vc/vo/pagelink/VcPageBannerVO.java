package com.ibk.sb.restapi.biz.service.vc.vo.pagelink;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPageBannerVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPageBannerVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_PG_BAN_L
     * DESC : 투자사전용 페이지 배너 목록
     */


    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자사 전용 페이지 ID
    private String invmCmpExusPageId;

    // 배너 순번
    private Integer bnnrSqn;

    // 배너 이미지 파일 ID
    @JsonIgnore
    private String bnnrImgFileId;
    private String fileId;
    private String fileNm;
}
