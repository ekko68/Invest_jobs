package com.ibk.sb.restapi.biz.service.batch.vo.batch;

import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;

@Getter
@Setter
@Alias("SourceAuditRequestVO")
public class SourceAuditRequestVO {

    public InvestAuditVO convertAuditVO() {

        return null;
    }

    public InvestAuditStageVO convertAuditRequestStage() {

        return null;
    }


    /**
     * 기존 메인박스 투자심사요청 테이블
     * TB_BOX_IVT101M
     * [엔티티정의] 투자BOX에서 투자를 받기 위해 제출한 정보
     * [대상내] 투자를 받기 위한 제출 정보
     */

    // 이용기관ID
    private String usisId;

    // 투자 신청을 관리하는 번호
    private String invmAplcMngmNo;

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
    private String stchInfoMngmNo;

    // 투자 요청한 기업의 직원수
    private Long empCnt;

    // 투자 요청 담당자명
    private String rsprNm;

    // 투자 요청 담당자의 직급명
    private String rsprJbclNm;

    // 투자 요청 담당자의 부서명
    private String rsprDvm;

    // 투자 요청 담당자의 전화번호
    private String rsprCnplTpn;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보
    private String mnfrBsnsNm;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보 소개
    private String mnfrBsnsInrdCon;

    // 투자 요청한 기업의 제품, 서비스, 기술 정보에 대한 이미지 파일 관리번호
    private String imgNo;

    // 투자 희망 기관
    private String hopeInitCon;

    // 희망 투자 단계
    private String hopeInvmStgId;

    // 희망 투자유치금액
    private Long hopeInvmEnmtAmt;

    // 희망 대출유치금액
    private Long hopeLoanEnmtAmt;

    // 기존 투자 유치 정보를 관리하기 위한 번호
    private String exstInvmEnmtMngmNo;

    // IR자료파일 관리번호
    private String irrsDatMngmNo;

    // 기타자료관리번호
    private String etcDatMngmNo;

    // 투자 요청을 한 상태 코드
    private String pgrsSttsDcd;

    // 최초로 등록한 사용자의 ID
    private String rgsrId;

    // 최초로 등록한 일시
    private Date rgsnTs;

    // 시스템 속성으로 해당 정보를 변경한 주체의 최종 정보
    private String sysLsmdId;

    // 시스템 속성으로 해당 정보가 변경된 최종 일시
    private Date sysLsmdTs;

    // 투자진행안내를 문자로 수신하는지에 대한 여부
    private String smsRcvYn;

    // 투자진행안내를 메일로 수신하는지에 대한 여부
    private String mailRcvYn;

    // 투자진행안내를 앱PUSH로 수신하는지에 대한 여부
    private String pushRcvYn;

    //
    private String exmnCd;

    //
    private String exntRsltCd;

    //
    private String exntOpnnCon;

    //
    private Date exntTs;

    // 심사거절상태코드
    private String exntRjcnSttsCd;

    // 심사거절내용
    private String exntRjcnCon;

    // 부점코드
    private String brcd;

    // 법인등기부등본관리번호
    private String corpRrbMngmNo;

}
