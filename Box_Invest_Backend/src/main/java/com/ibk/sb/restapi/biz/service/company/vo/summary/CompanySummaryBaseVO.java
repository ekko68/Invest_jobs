package com.ibk.sb.restapi.biz.service.company.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.ProfileHeadCharacter;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanySummaryBaseVO extends BaseTableVO {

    /**
     * 기업 목록 VO 중 Platform Service에서 조회해야 할 부분 공통화
     * -> 공통 메서드 처리
     */

    // 이용기관 아이디
    private String utlinsttId;

    // 이용기관 사업자명
    private String bplcNm;

    // 로고 이미지 경로
    private String logoImageUrl;

    // 목록 조회의 경우 default 로고 컬럼 사용 유무에 따라 해당 필드를 설정하여 프론트에서 랜덤 이미지를 사용한다.
    private String defaultLogoYn;
    private String defaultLogoChar;

    // 주소
    private String address;

    // 위치 (메인박스 주소값을 substring한 것)
//    private String addrAggr;

    // 위치 (투자박스 내정보 설정 사업장 소재지 -> 검색할 때도 해당 정보를 쓰므로 프론트에서 해당 정보 보이는 것을 변경)
    private String bsunDwarCd;
    private String bsunDwarNm;

    // 기업 가입 날짜
    private Date enprJnngDt;

    // 로그인 이용기관 좋아요 여부
    private String loginUsisLikeYn;

    // 좋아요 카운트 정보
    private Integer prefCnt;
}
