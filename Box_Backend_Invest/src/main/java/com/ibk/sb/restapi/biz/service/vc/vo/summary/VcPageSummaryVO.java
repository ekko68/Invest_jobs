package com.ibk.sb.restapi.biz.service.vc.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPageSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPageSummaryVO extends BaseTableVO {

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자사 전용 페이지 ID
    private String invmCmpExusPageId;

    // 홈페이지 URL
    private String hmpgUrl;

    // 페이지 제목
    private String pageTtl;

    // 페이지 내용
    private String pageCon;

    // 대표이미지 파일
    @JsonIgnore
    private String rprsImgFileId;
    private String fileId;

    // 진행여부
    private String ongoingYn;


    /** JOIN **/
    // 투자사 타입
    private String invmCmpPtrnCd;
    private String invmCmpPtrnNm;
}
