package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyIntroMediaVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyIntroMediaVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_ENPR_INTRO_D
     * DESC : 기업 소개 영상
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 소개 영상 ID
//    private String inrdPictId;

    // 소개 영상 순번
    private Integer inrdPictSqn;

    // 소개 영상 제목
    private String inrdPictTtl;

    // 소개 영상 URL
    private String inrdPictUrl;

    // 소개 영상 설명
//    private String inrdPictDesc;


}
