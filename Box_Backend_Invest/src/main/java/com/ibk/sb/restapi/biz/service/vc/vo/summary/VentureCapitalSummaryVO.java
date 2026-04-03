package com.ibk.sb.restapi.biz.service.vc.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.InvestFieldVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VentureCapitalSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VentureCapitalSummaryVO extends BaseTableVO {

    // 이용기관(투자사) 아이디
    private String utlinsttId;

    // 이용기관(투자사) 사업자명
    private String bplcNm;

    // 투자사 유형 코드
    private String invmCmpPtrnCd;

    // 투자사 유형명
    private String invmCmpPtrnNm;

    // 관심 분야 키워드 리스트
    @JsonIgnore
    private String cnrnTags;
    private List<String> cnrnFildList;

    // 이용기관 소개정보
    private String enprInrdCon;

    // 이용기관 로고 파일 아이디
    private String logoImageUrl;

    // 목록 조회의 경우 default 로고 컬럼 사용 유무에 따라 해당 필드를 설정하여 프론트에서 랜덤 이미지를 사용한다.
    private String defaultLogoYn;
    private String defaultLogoChar;
}
