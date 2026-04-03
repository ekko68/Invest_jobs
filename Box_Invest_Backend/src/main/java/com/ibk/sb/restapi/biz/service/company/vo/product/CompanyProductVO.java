package com.ibk.sb.restapi.biz.service.company.vo.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("CompanyProductVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyProductVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_ENPR_PRDT_L
     * DESC : 기업 제품
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 제품 코드
//    private String prdtId;
    private String prdtId;

    // 제품명
    private String prdtNm;

    // 제품 유형
    private String prdtPtrn;

    // 제품 설명
    private String prdtDesc;

    // 제품 특징
    private String prdtChrc;

    /** FILE **/
    @JsonIgnore
    private String prdtImgFileId;

    private String fileId; // 프론트 공통화

    /** JOIN **/

    // 제품 키워드 리스트
    private List<ProductKeywordVO> keywordList;

}
