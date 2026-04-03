package com.ibk.sb.restapi.biz.service.vncmloan.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("VncmLoanAplcVO")
public class VncmLoanAplcVO extends BaseTableVO {

	private String vnentrlonId;   //벤처대출 ID 
	private String utlinsttId;   //이용기관(회사) ID 
	private String bizrno;   //사업자등록증 파일 
	private String etnm;   //기업명 
	private String rprnm;   //대표자명
	private String bzn;   //사업자번호 
	private String col;   //설립년월일 
	private String adr;   //본사 주소 
	private String rsprNm;   //기업 담당자명 
	private String rsprJbclNm;   //담당자 직책 
	private String rsprCnplTpn;   //담당자 연락처 
	private String rsprEad;   //담당자 이메일 
	private String recomendSttusCm;   //진행상태코드
	private String recomendSttusCmNm;   //진행상태코드명
	private String recomendSttusCmRm;   //비고 메시지
	
	private String vatStdtaxProof;   //부가세과세표준증명원 (최근 3개년도) 
	private String cprRgistMatterAllCrtf;   //법인등기사항전부증명서 
	private String stchInfoMngmNo;   //주주명부 
	private String cmpnyIntrcn;   //회사소개서(IR자료)
	private String innfInqCosn;   //개인(신용)정보 조회동의서
	private String innfClusCosn;   //개인(신용)정보수집 이용 동의서
	private String atcscAtchmnfl;   //정관 첨부파일
	private String gmtsckAnact;   //주주총회 또는 이사회 결의서
	private String invtCnfrmn;   //투자확인서
	private String cptalUsgpln;   //자금사용계획서
	private String sprnApfr;   //지원신청서
	private String invmEnprNm;   //추천투자기관명
	
	//기타파일
	private List<MultipartFile> reqBizrnoList;   //사업자등록증
	private List<MultipartFile> reqVatStdtaxProofList;   //부가세과세표준증명원 (최근 3개년도)
	private List<MultipartFile> reqCprRgistMatterAllCrtfList;   //법인등기사항전부증명서 
	private List<MultipartFile> reqStchInfoMngmNoList;   //주주명부 
	private List<MultipartFile> reqCmpnyIntrcnList;   //회사소개서(IR자료)
	private List<MultipartFile> reqInnfInqCosnList;   //개인(신용)정보 조회동의서
	private List<MultipartFile> reqInnfClusCosnList;   //개인(신용)정보수집 이용 동의서
	private List<MultipartFile> reqAtcscAtchmnflList;   //정관 첨부파일
	private List<MultipartFile> reqGmtsckAnactList;   //주주총회 또는 이사회 결의서
	private List<MultipartFile> reqInvtCnfrmnList;   //투자확인서
	private List<MultipartFile> reqCptalUsgplnList;   //자금사용계획서
	private List<MultipartFile> reqSprnApfrList;   //지원신청서
	private List<MultipartFile> reqGitaList;   //기타파일
	
	private List<BoxIvtFileVO> resBizrnoList;   			//사업자등록증
	private List<BoxIvtFileVO> resVatStdtaxProofList;   //부가세과세표준증명원 (최근 3개년도) 
	private List<BoxIvtFileVO> resCprRgistMatterAllCrtfList;   //법인등기사항전부증명서 
	private List<BoxIvtFileVO> resStchInfoMngmNoList;   //주주명부 
	private List<BoxIvtFileVO> resCmpnyIntrcnList;   //회사소개서(IR자료)
	private List<BoxIvtFileVO> resInnfInqCosnList;   //개인(신용)정보 조회동의서
	private List<BoxIvtFileVO> resInnfClusCosnList;   //개인(신용)정보수집 이용 동의서
	private List<BoxIvtFileVO> resAtcscAtchmnflList;   //정관 첨부파일
	private List<BoxIvtFileVO> resGmtsckAnactList;   //주주총회 또는 이사회 결의서
	private List<BoxIvtFileVO> resInvtCnfrmnList;   //투자확인서
	private List<BoxIvtFileVO> resCptalUsgplnList;   //자금사용계획서
	private List<BoxIvtFileVO> resSprnApfrList;   //지원신청서
	private List<BoxIvtFileVO> resGitaList;   //기타파일

    


}



