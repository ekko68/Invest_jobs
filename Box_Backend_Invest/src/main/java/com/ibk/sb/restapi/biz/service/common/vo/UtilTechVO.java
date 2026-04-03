package com.ibk.sb.restapi.biz.service.common.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseCodeTableVO;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("UtilTechVO")
@JsonIgnoreProperties({
        "delYn", "useYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum",
        "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class UtilTechVO extends BaseCodeTableVO {

    /**
     * Table : TB_BOX_IVT_UTLZ_TCHN_C
     * DESC : 활용 기술 코드 정보
     */

    // 활용 기술 코드
    private String utlzTchnCd;

    // 활용 기술 코드명
    private String utlzTchnCdnm;
}
