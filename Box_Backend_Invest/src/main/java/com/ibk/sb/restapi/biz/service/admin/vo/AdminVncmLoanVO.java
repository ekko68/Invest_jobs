package com.ibk.sb.restapi.biz.service.admin.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("AdminVncmLoanVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "amnnUserId", "amnnTs",
    "totalCnt", "rnum"
})
public class AdminVncmLoanVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VNENTRLON_REQST_BASS_M
     * DESC : 투자박스 IBK벤처대출 추천 접수 정보
     */

    // 식별번호
    private String vnentrlonId;

    // 제안기업 사업자번호
    private String rcmdEnprBzn;

    // 이용기관(회사)ID
    private String utlinsttId;
    
    // 투자기관명
    private String invmEnprNm;
    
    // 기업명 내용
    private String etnm;
    
    // 대표자명
    private String rprnm;
    
    // 설립년월일
    private String col;
    
    // 본사 주소
    private String adr;
    
    // 업종명(표준산업분류)
    private String btnm;
    
    // 투자업종 구분
    private String invtIndutySe;
    
    // 주요제품
    private String mainProduct;
    
    // 기업 담당자명
    private String rsprNm;
    
    // 담당자 직책
    private String rsprJbclNm;
    
    // 담당자 연락처
    private String rsprCnplTpn;
    
    // 담당자 이메일
    private String rsprEad;
    
    // 기업 경쟁력 또는성장가능성
    private String entrprsCmptpw;
    
    // 후속투자 가능성 및예상시기
    private String fllwinvtPosbltyExpectEra;
    
    // 투자내역_투자기관
    private String invtDtlsInvtInstt;
    
    // 투자내역_투자라운드(직전)
    private String invtDtlsInvtPnttm;
    
    // 투자내역_투자금액(원)
    private String invtDtlsInvtAmount;
    
    // 투자내역_투자일자(직전)
    private String invtDtlsInvtDe;
    
    // 투자내역_주당가격(원)
    private String invtDtlsStkpc;
    
    // 투자내역_기업가치(원)
    private String invtDtlsEtvlAmt;
    
    // 투자내역_투자종류
    private String invtDtlsInvtKnd;
    
    // 투자내역_비고
    private String invtDtlsRm;
    
    // 담당심사역_담당자이름
    private String chrgAudofirRsprNm;
    
    // 담당심사역_담당자직책
    private String chrgAudofirRsprJbclNm;
    
    // 담당심사역_담당자연락처
    private String chrgAudofirRsprCnplTpn;
    
    // 담당심사역_담당자이메일
    private String chrgAudofirRsprEad;
    
    // 연락담당자_담당자이름
    private String contactAudofirRsprNm;
    
    // 연락담당자_담당자직책
    private String contactAudofirRsprJbclNm;
    
    // 연락담당자_담당자연락처
    private String contactAudofirRsprCnplTpn;
    
    // 연락담당자_담당자이메일
    private String contactAudofirRsprEad;
    
    // 추천 기업은행 영업점
    private String recomendIbkBuzplc;
    
    // 추천 진행 상태
    private String recomendSttus;
    
    // 투자사실 증빙 서류 첨부
    private String invtFactPrufPapersAtch;
    
    // 투자분석 보고서(투자심사자료) 첨부
    private String invtAnalsReprtAtch;
    
    // 기타 파일 첨부
    private String etcFileAtch;
    
    //투자사실 증빙 서류 첨부 파일 리스트
    private List<BoxIvtFileVO> invtFactPrufPapersAtchList;
    
    //투자분석 보고서(투자심사자료) 첨부 파일 리스트
    private List<BoxIvtFileVO> invtAnalsReprtAtchList;
    
    //기타 파일 리스트
    private List<BoxIvtFileVO> etcFileAtchList;
    
    // 투자기관에 전달할 메시지
    private String invtInsttDlivMsg;
    
    // 이메일 발송 여부
    private String emailSndngYn;
    
    // sms 발송 여부
    private String smsSndngYn;
    
    // 자료제출 여부
    private String dtaPresentnYn;
    
    // 추천상태명
    private String recomendSttusNm;
    
    // 투자업종구분명
    private String invtIndutySeNm;

    // bpr index no
    private String bprIdxNo;
    
    //추천상태 공통코드
    private List<ComCodeVO> recomendSttusCdList;
    

}
