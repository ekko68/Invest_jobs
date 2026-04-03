package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("AdminFncnBsnsPageVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class AdminFncnBsnsPageVO extends PageVO {
    // 등록자
    private String searchRgsrNm;

    // 출자사업공고 번호
    private String searchFncnBsnsPbanNo;

    // 출자사업공고 셀렉트박스 구분코드
    private String selectFncnBsnsPbanDcd;

    // 출자사업공고 제목명
    private String searchFncnBsnsPbanTtlNm;

    // 출자사업 접수 셀렉트박스 구분코드
    private String selectFncnBsnsPgrsScd;

    // 출자사업공고 제목명
    private String searchFncnBsnsRcipTtlNm;

    // 운용사명 검색
    private String searchOpcmNm;

    // 출자사업 접수 번호
    private String searchFncnBsnsRcipNo;

}
