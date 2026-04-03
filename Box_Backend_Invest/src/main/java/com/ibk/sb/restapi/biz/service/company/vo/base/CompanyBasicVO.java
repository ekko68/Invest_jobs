package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("CompanyBasicVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyBasicVO extends BaseTableVO {

    /**
     * FFPC_UTLINSTT_LEDGR 에서 투자박스 기업 프로필 정보
     */

    // 이용기관(회사)에 부여되는 ID
    private String utlinsttId;

    // 이용기관의 사업자명
    private String bplcNm;

    // 이용기관대표자명
    private String rprsntvNm;

    // 이용기관 대표 전화번호
    private String reprsntTelno;

    // 이용기관 대표이메일
    private String reprsntEmail;

    // 이용기관 대표팩스번호
    private String reprsntFxnum;

    // 이용기관 홈페이지 주소
    private String hmpgAdres;

    // 법인등록번호
    private String jurirno;

    // 사업자를 식별하는 고유번호
    private String bizrno;

    // 이용기관의 설립일자
    private String fondDe;

    /** 주소 **/

    // 이용기관 표시 주소
    private String addr;

    // 이용기관 소재 우편번호
    private String postNo;

    // 주소 전체 정보
    private String nwAdrAllNm;

    // 구주소 전체 정보
    private String guAdrAllNm;

    // 이용기관의 매출금액
    private Long salamt;

    /** IMG **/

    // 회사 로고 경로
    private String logoImageUrl;

    /** 추가 영역 **/

    // 기업 구분
    private String enprDsncClsfCd;
    private String enprDsncClsfNm;

    // 기업 형태
    private String enfmClsfCd;
    private String enfmClsfNm;

    // 사업장 소재지
    private String bsunDwarCd;
    private String bsunDwarNm;

    // 상장 여부
    private String lstnYn;

    // 이용기관 최근매출금액 연도
    private String msrnAmslYear;

    // 이용기관의 최근매출금액
    private Long msrnAmslAmt;

    // 이용기관 소개정보
    private String enprInrdCon;

    // 직원수
    private Integer empCnt;

    // 조회수
    private Long crewRtrv;

    // 관심분야 리스트
    private List<CompanyInterestVO> cnrnFildList;

    // 업종
    private String btnm;

    // 업태
    private String bzstNm;

    // 자동갱신 약관 동의 여부
    private String atrwStplCosnYn;

    // 추천기업 설정 여부
    private String rcmdEnprStupYn;

    // 투자사 전환 요청 정보
    private AdminVcConvertRequestVO convertInfo;


    /** @Builder 사용을 위한 super 필드 */
    private String rgsnUserId;
    private String amnnUserId;

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;

    // 해당 요소는 기업정보 상세조회에서 사용되므로
    // 기본조회 쿼리에서는 우선 제외로 변경

    // 투자단계 공개여부
//    private String oppbYn;

    // 희망 투자유치 단계 코드
//    private String invmStgCd;
//    private String invmStgNm;

    // 희망 투자유치 금액 코드
//    private String invmAmtCd;
//    private String invmAmtNm;

    // 로그인 이용기관 좋아요 여부
    private String loginUsisLikeYn;

    // 좋아요 카운트 정보
    private Integer prefCnt;
}
