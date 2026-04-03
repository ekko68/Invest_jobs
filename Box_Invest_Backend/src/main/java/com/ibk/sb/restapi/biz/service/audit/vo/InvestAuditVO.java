package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceSimpleDocGroupVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("InvestAuditVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class InvestAuditVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_EXNT_RQST_M
     * DESC : 투자 심사 요청 정보
     */

    // 투자 심사 요청 ID
    private String invmExntRqstId;

    // 제안 투자사 ID
    private String invmCmpId;

    // 요청 기업 ID
    private String rqstEnprId;

    // 발표자료 파일 ID
    private String anncDatFileId;

    // 추가서류 파일 ID
    private String addtDocFileId;

    // 홍보영상 URL
    private String pbrlPictUrl;

    // 제안 메시지
    private String prplMsgCon;

    // 요청 메시지
    private String rqstMsgCon;

    // 심사 총평
    private String exntMsgCon;

    // IR 조회기간 (일수)
    private Integer inqAblNdd;

    // IR 조회가능 여부
    private String rqstEnprIrInqYn;

    /**
     * JOIN
     **/
    // 투자사 사업자명
    private String invmCmpBplcNm;

    // 기업 사업자명
    private String rqstBplcNm;

    // 투자사 사업자번호
    private String invmCmpBizrno;

    // 기업 사업자번호
    private String rqstBplcBizrno;
    
    // 기업 연락처
    private String reprsntTelno;
    
    // IBK 투자사 여부
    private String ibkVcYn;

    // 투자사 대표자명
    private String invmCmpRprsntvNm;

    // 기업 대표자명
    private String rqstEnprRprsntvNm;

    // 제안 투자사 유형
    private String invmCmpPtrnCd;
    private String invmCmpPtrnNm;

    // 요청 기업 구분
    private String enprDsncClsfCd;
    private String enprDsncClsfNm;

    // 제안 투자사 로고 이미지
    private String invmLogoImageUrl;

    // 요청 기업 로고 이미지
    private String enprLogoImageUrl;

    // 발표자료 파일명
    private String anncDatFileNm;

    // 추가서류 파일명
    private String addtDocFileNm;

    // 투자 심사 진행단계 코드
    private String invmExntPgsgCd;

    // 투자 심사 진행단계명
    private String invmExntPgsgNm;

    // 투자 심사 요청 날짜
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp invmRqstDt;

    // 기업 투자심사요청시 포괄적 동의 처리 여부
    private String atrwStplCosnYn;

    /**
     * NICE 간편서류 리스트
     */
    private NiceSimpleDocGroupVO niceDoc;
    
    /**
     * INFOTECH 간편서류 리스트
     */
    private List<ComFileInfoVO> infotechDoc;
    
    /**
     * INFOTECH 간편서류 구분 키
     */
    private String infotechId;
    
    // 산업분류 코드
    private String mainBizcnd;
    
    // 산업분류 코드명
    private String mainBizcndNm;
    
    /**
     * 추천영업점, 추천직원 추가
     */
    // 부점코드 - 추천영업점 코드
    private String brcd;
    // 직원번호 - 추천직원 번호
    private String emn;
    // 직원명
    private String emm;

    /**
     * TCB 조회정보
     * -> 기존 프로세스에 있었기에
     * 우선 투자심사요청 시점을 기준으로 해당 정보 저장
     */
    private String tcbTchnGrd;
    private String incfCd1;
    private String incfCd2;
    private String incfCd3;

    /**
     * 추가 필드 : 심사결과코드, 심사 담당자, 투자집행예정금액, 심사결과, 대표투자심사역, 투자사 투자심사 재요청 제한 기간(입력)
     */
    // 심사결과코드
    private String exntRsltCd;
    private String exntRsltNm;
    // 심사담당자 ID
    private String exntRsprId;
    // 투자집행예정금액
    private Long invmPrfrScdlAmt;
    private String invmPrfrScdlAmtStr;
    // 심사결과 비고
    private String exntRsltRmrk;
    // 대표투자심사역
    private String invmcrofRepnm;
    // 투자사 투자심사 재요청 제한 기간
    private int invmexntRapLmtnMnct;

    // 비즈니스 분야
    private List<String> bsinList;

    // 활용기술
    private List<String> techUtilList;

    // 주소
    private String adr;

    // 홈페이지
    private String hmpgUrlAdr;

    // 직원 수
    private String empCnt;

    // 기업소개
    private String enprInrdCon;

    // 업종코드
    private String mainBizCd;

    // 업종명
    private String mainBizCdNm;

    // 설립일자
    private String incrYmd;
}
