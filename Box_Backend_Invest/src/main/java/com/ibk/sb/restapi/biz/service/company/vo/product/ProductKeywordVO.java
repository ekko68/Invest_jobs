package com.ibk.sb.restapi.biz.service.company.vo.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("ProductKeywordVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class ProductKeywordVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_ENPR_KWRD_D
     * DESC : 기업 제품별 키워드
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 제품 코드
//    private String prdtId;
    private String prdtId;

    // 키워드 순번
    private Integer kwrSqn;

    // 키워드명
    private String kwrNm;

}
