package com.ibk.sb.restapi.biz.service.company.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("CompanyProductSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyProductSummaryVO extends BaseTableVO {


    // 이용기관(회사) ID
    private String utlinsttId;

    // 제품 코드
    private String prdtId;

    // 제품명
    private String prdtNm;

    /** FILE **/

    // 파일 아이디
    @JsonIgnore
    private String prdtImgFileId;

    private String fileId;

}
