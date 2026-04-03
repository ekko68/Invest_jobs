package com.ibk.sb.restapi.biz.service.common.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseCodeTableVO;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("InvestFieldVO")
@JsonIgnoreProperties({
        "delYn", "useYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum",
        "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class InvestFieldVO extends BaseCodeTableVO {

    /**
     * Table : TB_BOX_IVT_INVM_FILD_C
     * DESC : 투자분야 코드 정보
     */

    // 투자분야 ID
    private String invmFildCd;

    // 투자분야명
    private String invmFildCdnm;

    // 분야 배너 이미지 파일 필드
    @JsonIgnore
    private String bnnrImgFileId;

    private String fileId; // 프론트 공통화

    private String imgUrl;

}
