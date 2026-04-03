package com.ibk.sb.restapi.biz.service.vc.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VentureCapitalBasicVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VentureCapitalBasicVO extends BaseTableVO {

    @JsonIgnore
    private String useYn;

    // 이용기관(투자사) 아이디
    private String utlinsttId;

    // 이용기관의 사업자명
    private String bplcNm;

    // 이용기관의 사업자등록번호
    private String bizrno;

    // IBK 투자사 확인
    private String ibkVcYn;

    // 투자사 홈페이지
    private String hmpgAdres;

    // 투자사 대표
    private String rprsntvNm;

    // 투자사 대표 연락처
    private String reprsntTelno;

    // 팩스번호
    private String reprsntFxnum;

    // 투자사 대표 이메일
    private String reprsntEmail;

    // 투자사 우편번호
    private String postNo;

    // 투자사 표시 주소
    private String addr;

    // 투자사 주소 전체 정보
    private String nwAdrAllNm;

    // 투자사 구주소 전체 정보
    private String guAdrAllNm;

    // 이용기관 로고 파일 아이디
    private String logoImageUrl;

    // 설립일
    private String fondDe;

    // 투자사 연차
    private Integer yearCnt;

    // 투자사 투자심사 재요청 제한 기간
    private Integer invmexntRapLmtnMnct;

    /** JOIN **/
    // 이용기관 소개정보
    private String enprInrdCon;


    // 프로필 이미지 파일 아이디
    private String fileId;

    // 투자사 유형 코드
    private String invmCmpPtrnCd;

    // 투자사 유형명
    private String invmCmpPtrnNm;

    // 직원수
    private Integer empCnt;

    // 조회수
    private Long crewRtrv;

    // 지역코드
    private String bsunDwarCd;
    private String bsunDwarNm;

    // 관심분야 키워드 리스트
    private List<VcInterestVO> cnrnFildList;
}
