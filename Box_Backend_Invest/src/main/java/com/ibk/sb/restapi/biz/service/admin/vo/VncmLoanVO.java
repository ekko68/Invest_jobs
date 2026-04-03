package com.ibk.sb.restapi.biz.service.admin.vo;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("VncmLoanVO")
public class VncmLoanVO extends BaseTableVO {

    private String vnentrlonId	            ; //식별번호
    private String utlinsttId	            ; //이용기관(회사) id
    private String rcmdEnprBzn	            ; //기업명
    private String etnm                     ; //대표자명
    private String rprnm	                ; //제안 기업 사업자번호
    private String col	                    ; //설립년월일
    private String adr	                    ; //본사 주소
    private String btnm                     ; //업종명(표준산업분류)
    private String invtIndutySe             ; //투자업종 구분
    private String mainProduct	            ; //주요제품
    private String rsprNm	                ; //기업 담당자명
    private String rsprJbclNm	            ; //담당자 직책
    private String rsprCnplTpn	            ; //담당자 연락처
    private String rsprEad	                ; //담당자 이메일
    private String entrprsCmptpw            ; //기업 경쟁력 또는성장가능성
    private String fllwinvtPosbltyExpectEra ; //후속투자 가능성 및예상시기
    private String invtDtlsInvtInstt	    ; //투자내_투자기관
    private String invtDtlsInvtPnttm	    ; //투자내역_투자라운드(직전)
    private String invtDtlsInvtAmount	    ; //투자내역_투자금액(원)
    private String invtDtlsInvtDe	        ; //투자내역_투자일자(직전)
    private String invtDtlsStkpc	        ; //투자내역_주당가격(원)
    private String invtDtlsEtvlAmt	        ; //투자내역_기업가치(원)
    private String invtDtlsInvtKnd	        ; //투자내역_투자종류
    private String invtDtlsRm	            ; //투자내역_비고
    private String chrgAudofirRsprNm	    ; //담당심사역_담당자이름
    private String chrgAudofirRsprJbclNm	; //담당심사역_담당자직책
    private String chrgAudofirRsprCnplTpn	; //담당심사역_담당자연락처
    private String chrgAudofirRsprEad	    ; //담당심사역_담당자이메일
    private String contactAudofirRsprNm     ; //연락담당자_담당자이름
    private String contactAudofirRsprJbclNm ; //연락담당자_담당자직책
    private String contactAudofirRsprCnplTpn; //연락담당자_담당자연락처
    private String contactAudofirRsprEad	; //연락담당자_담당자이메일
    private String recomendIbkBuzplc	    ; //추천 기업은행 영업점
    private String recomendSttus	        ; //추천 상태
    private String recomendSttusNm	        ; //추천 상태명
    private String invtInsttDlivMsg         ; //투자 기관에전달할 메시지 
    private List<String> deleteKeys         ; //삭제 파일 키

    private List<MultipartFile> invtFactPrufPapersAtch;
    private List<MultipartFile> invtAnalsReprtAtch;
    private List<MultipartFile> etcFileAtch;

    private List<BoxIvtFileVO> invtFactPrufPapersFileInfo;
    private List<BoxIvtFileVO> invtAnalsReprtFileInfo;
    private List<BoxIvtFileVO> etcFileFileInfo;

}



