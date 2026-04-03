package com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("FundOpcmInfoVO")
@ToString
public class FundOpcmInfoVO extends BaseTableVO{
		
	//	이용기관(회사)ID
	private String utlinsttId;
	
	//	펀드ID
	private String fundId;
	
	//	운용사명  
	private String prnNm;
	
	//	사업자번호
	private String bzn;
	
	//	대표이사명
	private String rprNm;

	//	화사소재지
	private String adres;
	
	//	설립년월일
	private String incrYmd;
	
	//	펀드운용시작일
	private String fundOprTs;

	//	자본총계
	private Long cptsTtsm;

	//	납입자본금
	private Long payCapl;

	//	징계여부
	private String dscplYn;

	//	자산총계
	private Long astTtsmAmt;

	//	부채총계
	private Long lbltCpstAmt;

	//	자본총계
	private Long cptsTtsmAmt;

	//	영업수익
	private Long bsnErn;

	//	영업비용
	private Long bsnCt;

	//	당기순이익
	private Long ctnpAmt;

	//	자산총계1Y
	private Long astTtsmAmt1y;

	//	자산총계2Y
	private Long astTtsmAmt2y;

	//	부채총계1Y
	private Long lbltCpstAmt1y;

	//	부채총계2Y
	private Long lbltCpstAmt2y;

	//	자본총계1Y
	private Long cptsTtsmAmt1y;

	//	자본총계2Y
	private Long cptsTtsmAmt2y;

	//	영업수익1Y
	private Long bsnErn1y;

	//	영업수익2Y
	private Long bsnErn2y;

	//	영업비용1Y
	private Long bsnCt1y;

	//	영업비용2Y
	private Long bsnCt2y;

	//	당기순이익1Y
	private Long ctnpAmt1y;

	//	당기순이익2Y
	private Long ctnpAmt2y;

	//	진행단계
	private String progrsStg;

	//	운용규모수
	private Integer opratnScaleCo;

	//	운용규모액
	private Integer opratnScaleAm;

	//	불라인드수
	private Integer blindCo;

	//	불라인드액
	private Integer blindAm;

	//	프로젝트수
	private Integer prjctCo;

	//	프로젝트액
	private Integer prjctAm;

	//	청산펀드수익률IRR(%)
	private String lqdFundErnrt;

	//	펀드소진율
	private String fundExhsRt;

	//	운용인력정보[총 운용인력수]
	private Integer opratnHnfInfoTotCo;

	//	운용인력정보[대표 펀드 매니저명]
	private String opratnHnfInfoMngrNm;

	//	운용인력정보[운용인력징계여부]
	private String opratnHnfInfoDscplYn;

	//	관리인력정보[총 운용인력수]
	private Integer manageHnfInfoTotCo;

	//	관리인력정보[전문자격증 보유인력]
	private Integer manageHnfInfoHnf;

	//	관리자료첨부파일
	private String managedtaAtchmnfl;

	//	CO-GP여부
	private String cogpYn;
	
	//	주 운용사명
	private String majorPrnNm;
	
	//	등록일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp rgsnTs;

	//	동록자ID
	private String rgsnUserId;

	//	수정일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp amnnTs;
	
	//	수정자ID
	private String amnnUserId;
    
	// 제안 펀드 참여 운용 인력
	private List<ProFundPartcptnVO> proFundPartcptn;
	
	// 운용인력 유지율
	private List<OpratnHnfMntncVO> opratnHmfMntnc;
	
	// 운용인력 징계여부
	private String manageHnfInfo; 
	
	// 주요 주주구성
	private List<FundStchCnfgVO> fundStchCnfgList;
	
	// 관리인력 운용인력 징계여부
	private List<OpratnHnfInfoDscplLVO> opratnHnfInfoDscplL;
		
	// Ir 재무정보
	private IrFinanceVO irInfo;
	
	//	관리자료첨부파일 리스트
	private List<ComFileInfoVO> managedtaAtchmnflList;
    
    // 심사단계
    private String auditStg;
    
    // 펀드명
    private String fundNm;
}
