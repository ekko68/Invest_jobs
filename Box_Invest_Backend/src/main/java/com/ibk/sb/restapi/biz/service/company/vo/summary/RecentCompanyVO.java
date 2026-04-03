package com.ibk.sb.restapi.biz.service.company.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Alias("RecentCompanyVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class RecentCompanyVO extends CompanySummaryBaseVO {

    // 회사 ID
    private String utlinsttId;

    // 기업명
    private String bplcNm;

    // 직원수
    private Integer empCnt;

    // 이용기관의 설립일자
    private String fondDe;

    // 조회 수
    private Long crewRtrv;

//    // 관심 분야 태그 리스트 (DB 조회)
//    @JsonIgnore
//    private String cnrnTags;
//
//    // 관심분야 리스트
//    private List<String> cnrnFildList;
//
//    // 내용(기업 소개)
//    private String enprInrdCon;
//
//    // 조회 수
//    private Long crewRtrv;
//
//    // 즐겨찾기여부
//    private String fvryYn;
    
}
