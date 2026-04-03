package com.ibk.sb.restapi.biz.service.platform.vo.product;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommerceSellerProductVO extends BaseTableVO {

    // 상품 정보 ID
    private String pdfInfoId;

    // 판매자 이용기관 ID
    private String selrUsisId;

    // 판매자 이용기관 명
    private String selrUsisName;

    // 판매자 타입 ID
    private String mmbrtypeId;

    // 판매자 인증여부 플래그
    private String userAuthYn;

    // 상품 카테고리 ID
    private String pdfCtgyId;

    // 카테고리 데이터
    private String ctgyData;

    // 카테고리 1단계
    private String tms2ClsfNm;

    // 카테고리 2단계
    private String tms3ClsfNm;

    // 카테고리 3단계
    private String tms4ClsfNm;

    // 카테고리 4단계
    private String tms5ClsfNm;

    // 에이전시 상품 여부
    private String agenState;

    // 에이전시 상품 요청 여부
    private String agenReqState;

    // 상품 명
    private String pdfNm;

    // 모델명
    private String mdlnm;

    // 상품 요약 설명
    private String brfDesc;

    // 상품 간략 설명
    private String brfSubDesc;

    // 상품 상세 설명
    private String dtlDesc;

    // 에이전시 접수 정보 ID
    private String agenInfId;

    // 판매가격
    private String pdfPrc;

    // 할인가
    private String salePrc;

    // 가격협의 여부
    private String prcDscsYn;


    // 공통 가격 단위 ID
    private String comPrcutId;

    // 공통 가격 단위 명
    private String comPrcutName;


    // 주문수량 제한 사용여부
    private String ordnQtyLmtnUsyn;

    // 주문 최소 수량
    private int ordnMnmmQty;

    // 주문 최대 수량 여부
    private String ordnMxmmQtyYn;

    // 주문 최대 수량
    private int ordnMxmmQty;


    // 파일 경로(대표이미지) 패스
    private String filePath;


    // 위시 리스트 추가 플래그
    private String wishFlg = "N";

    // 위시 리스트 추가 수
    //      : 제품이 위시 리스트에 추가된 숫자
    private int wishCnt;

    // 조회 수
    private int viewCnt;

    // 문의 수
    private int inquCnt;

    // 거래 수
    private int dealCnt;

    // 결제 완료수
    private int payOrderCnt;

    // 상품 진행 여부(진열 여부)
    private String pdfPgrsYn;

    // 등록 일시 문자열
    private String rgsnTsStr;

    private String pdfSttsId;               // 판매 상품 상태 코드
    private String pdfSttsNm;               // 판매 상품 상태 명
    private String isAbleAdmStopYn;         // 관리자에 의한 판매중지 가능여부
    private String isAbleAdmCancelYn;       // 관리자에 의한 판매중지 취소 가능여부
    private String rgsnDate;                // 판매 상품 등록일자

}
