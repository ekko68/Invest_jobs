package com.ibk.sb.restapi.biz.service.fncn.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("FncnBsnsRcipVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FncnBsnsRcipVO extends BaseTableVO { // TB_BOX_IVT_IVB101_M
    
    // 출자사업 접수번호
    private String fncnBsnsRcipNo;
    
    // 출자사업 공고번호
    private String fncnBsnsPbanNo;
    
    // 출자사업 모집분야 고유번호
    private String fncnBsnsEnlsFildUqn;
    
    // 출자사업 진행상태 코드
    private String fncnBsnsPgrsScd;
    
    // 운용사명
    private String opcmNm;
    
    // 운용사 대표자명
    private String opcmRpprNm;
    
    // 운용자 설립년월일
    private String opcmIncrYmd;
    
    // 운용사 회사형태
    private String opcmLicsKcd;
    
    // 운용사 사업자 등록번호
    private String opcmBzn;
    
    // 운용사 담당자명
    private String opcmRsprNm;
    
    // 운용사 연락처
    private String opcmCnplCon;
    
    // 운용사 이메일
    private String opcmEad;
    
    // 공동운용사 여부
    private String jntOpcmYn;
    
    // 펀드명
    private String fundNm;
    
    // 출자사업 조합구분 코드
    private String fncnBsnsCprtDcd;
    
    // IBK 출자요청금액
    private float ibkFncnRqstAmt;
    
    // 펀드결성 예정금액
    private float fundOrgzScdlAmt;
    
    // 펀드 존속기간
    private int fundAsceTrm;
    
    // 출자금 납부방법 코드
    private String fnmnPmntMcd;
    
    // 기준 수익률
    private String baseEnrtCon;
    
    // 관리보수
    private String mnrmCon;

    // 성과보수
    private String otcmRmnrCon;
    
    // 비고
    private String rmrkCon;

    // 파일 고유 번호
    private String fileUnqNo;
    
    // 삭제 여부
    private String delYn;

    // 지원분야
    private String sprnFild;

    // 출자사업 1차 심의점수
    private int fncnBsnsTms1DlbtScr;
    
    // 출자사업 1차 통과여부
    private String fncnBsnsTms1PsngYn;
    
    // 출자사업 2차 심의점수
    private int fncnBsnsTms2DlbtScr;
    
    // 출자사업 2차 통과여부
    private String fncnBsnsTms2PsngYn;
    
    // 출자사업 최종점수
    private int fncnBsnsLastScr;
    
    // 출자사업 최종 통과여부
    private String fncnBsnsLastPsngYn;

    // 등록일시
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp iibsFrrgTs;

    // 등록ID
    private String iibsFrrgId;

    // 수정일시
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp iibsLsmdTs;

    // 수정ID
    private String iibsLsmdId;
    
    // 공동 GP 리스트
    List<FncnBsnsJntOpcmVO> fncnBsnsJntOpcm;

    // 펀드참여 리스트
    List<FncnBsnsInvvHmrsVO> fncnBsnsInvvHmrs;
    
    // 출자자 모집 리스트
    List<FncnEnlsVO> fncnEnls;

    // 주목적 추가항목 리스트
    List<FncnBsnsPmglItmVO> fncnBsnsPmglItm;

    // 선정우대 리스트
    List<FncnBsnsChcPrnlVO> fncnBsnsChcPrnl;

    // 파일 리스트
    List<ComFileInfoVO> fileList;

    // 출자사업공고 제목명
    private String fncnBsnsPbanTtlNm;

    // 공고년월일
    private String pbanYmd;
    
    // 지원분야명
    private String fncnBsnsEnlsFildUqnNm;
}
