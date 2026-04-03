package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@Alias("BeforeIvt101MVO")
public class BeforeIvt101MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT101M
     * 투자BOX에서 투자를 받기 위해 제출한 정보
     */

    /* key ========================== */

    // 이용기관ID
    private String usisId;

    // 투자 신청을 관리하는 번호
    private String invmAplcMngmNo;

    /* ========================== key */

    // 투자를 요청한 사업자의 등록번호
    private String invmRqstBzn;

    // 로그인한 사용자 ID
    private String userId;

    // 투자 요청을 한 기업명
    private String invmRqstEnprNm;

    // 투자를 요청한 기업의 정보 소개
    private String eninInrdCon;

    // 투자를 요청한 기업의 비즈니스 분야
    private String bizFildCon;

    // 투자 요청한 기업의 활동 중인 비즈니스 영역에서 황용하고 있는 주요 기술
    private String utlzTchnCon;

    // 투자 요청한 기업의 홈페이지 주소
    private String hmpgAdr;

    // 전체 보유 주식수
    private Long allHoldStckCnt;

    // 전체 주식 발행 금액
    private Long allStckIssAmt;

    // 투자 요청한 기업의 주주정보를 관리하는 관리번호
//    private String stchInfoMngmNo;

    // 투자 요청한 기업의 직원수
    private Integer empCnt;

    // 투자 요청 담당자명
//    private String rsprNm;

    // 투자 요청 담당자의 직급명
//    private String rsprJbclNm;

    // 투자 요청 담당자의 부서명
//    private String rsprDvm;

    // 투자 요청 담당자의 전화번호
//    private String rsprCnplTpn;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보
    private String mnfrBsnsNm;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보 소개
    private String mnfrBsnsInrdCon;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보에 대한 이미지 파일 관리번호
    private String imgNo;

    // 투자 희망 기관
//    private String hopeInitCon;

    // 희망 투자 단계
    private String hopeInvmStgId;

    // 희망 투자유치금액
    private Long hopeInvmEnmtAmt;

    // 희망 대출유치금액
//    private Long hopeLoanEnmtAmt;

    // 기존 투자 유치 정보를 관리하기 위한 번호
//    private String exstInvmEnmtMngmNo;

    // IR자료파일 관리번호
    private String irrsDatMngmNo;

    // 기타자료관리번호
    private String etcDatMngmNo;

    // 투자 요청을 한 상태 코드
    private String pgrsSttsDcd;

    // 투자진행안내를 문자로 수신하는지에 대한 여부
//    private String smsRcvYn;

    // 투자진행안내를 메일로 수신하는지에 대한 여부
//    private String mailRcvYn;

    // 투자진행안내를 앱PUSH로 수신하는지에 대한 여부
//    private String pushRcvYn;

    // 심사자코드
//    private String exmnCd;

    // 심사결과코드
    private String exntRsltCd;

    // 심사의견내용
    private String exntOpnnCon;

    // 심사일시
    private Date exntTs;

    // 심사 거절 상태코드
    private String exntRjcnSttsCd;

    // 심사 거절 내용 (X)
    private String exntRjcnCon;

    // 부점코드
    private String brcd;

    // 법인등기부등본관리번호 : 우선 파일이므로 옮겨야 하나?
//    private String corpRrbMngmNo;


    /** JOIN : 투자신청정보 전체 조회
     * 심사별 진행 이력 리스트
     * resultMap = BeforeIvt101MAll */

    private List<BeforeIvt401HVO> history;

    /** JOIN : 기업별 최신 투자신청정보 조회
     * 사업장 정보 (107M) JOIN
     * 주사업장이고 일련번호가 가장 앞인 case로 조회
     */

    private String bsunNm;
    private String bsunZpcd;
    private String bsunAdr;
    private String bsunDtlAdr;

    /**
     * JOIN : 기업 로고 이미지
     */
    private String usisLogoFileId;

    /**
     * 투자박스 추가요건 관련 신규 필드 추가
     */
    // 직원번호
    private String emn;
    // 직원명
    private String emm;
    // TCB 기술등급
    private String tcbTchnGrd;
    // 산업분류코드1
    private String incfCd1;
    // 산업분류코드2
    private String incfCd2;
    // 산업분류코드3
    private String incfCd3;

//    private String rqstFnsgDd;
}
