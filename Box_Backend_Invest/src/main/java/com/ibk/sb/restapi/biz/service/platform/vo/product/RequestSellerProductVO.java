package com.ibk.sb.restapi.biz.service.platform.vo.product;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestSellerProductVO extends PageVO {
    /** single **/
    // 상품 정보 ID
    private String pdfInfoId;


    /** bundle **/
    // 묶음 상품 정보 번호 ID
    private String bunInfId;

    // 묶음 상품 리스트 페이징
    private PageVO itemPage;


    /** 공통 검색 조건 **/
    // 상품 검색 조건
    private String pdfInfoCon;

    // 판매자 이용기관 ID
    private String selrUsisId;


    /*
     * 카테고리
     */
    // 1차 분류 Id
    private String oneCtgyId;

    // 2차 분류 Id
    private String twoCtgyId;

    // 3차 분류 Id
    private String thrCtgyId;

    // 4차 분류 Id
    private String forCtgyId;

    // 5차 분류 Id
    private String fivCtgyId;

    // mapper 검색용 카테고리 ID
    private String categoryId;

    // mapper 검색용 카테고리 깊이
    private String categoryDepth;

    /*
     * 플래그
     */
    // 최신 순 플래그
    private String orderByDate;

    // 가격 순 플래그
    private String orderByPrice;

    // 문의 순 플래그
    private String inquFlg;

    // 에이전시 판매자 여부
    private String agencyFlg;

    // 관련상품 여부
    private String relatedProductYn;

    // 구매 순 플래그
    private String orderByDeal;

    /** 시스템 내부에서 사용**/
    // 좋아요 플래그 용 로그인 유저 아이디
    private String loginUserId;

    // 좋아요 플래그 용 로그인 유저 이용기관(회사)ID
    private String loginUtlinsttId;

    // 상품 공통 파일 정보 구분 코드 ID - 초기값 상품이미지
//    private String filePtrnId = ComCode.GDS05001.getCode();

    // 상품 조회 이력 유형 ID - 초기값 상품 상세 보기
//    private String prhsPtrnId = ComCode.HTS00001.getCode();

    // 상품 상태 ID - 판매중
//    private String pdfSttsId = ComCode.SELLING_OK.getCode();
    private String pdfSttsId;


    /** 메인화면 **/
    // 인기상품 플래그(최근 한달간 조회 건수)
    private String popularFlg;

    // 셀럽쵸이스(최근 한달간 좋아요 건수) 플래그
    private String celebrityFlg;

    // 메인화면 묶음 상품 리스트 플래그
    private String mainPageFlg;

    // 관리자 검색 조건
    private boolean adminSearchStatus;

    // @Builder로 입력시키기 위해 설정잡음
    @Builder.Default
    private Integer page = 1; // pageNum, 현재 페이지
    @Builder.Default
    private Integer record = 10; // amount, 페이지당 보여줄 데이터
}
