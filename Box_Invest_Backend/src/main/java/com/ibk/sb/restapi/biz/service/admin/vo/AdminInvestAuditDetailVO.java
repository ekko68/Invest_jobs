package com.ibk.sb.restapi.biz.service.admin.vo;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("AdminInvestAuditDetailVO")
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({
		"delYn", "imgFileId", "imgUrl",
		"totalCnt", "rnum", "rvsRnum", "rsprNm", "rgsnUserNm", "rgsnTs",
		"amnnUserNm"
})
public class AdminInvestAuditDetailVO extends BaseTableVO {

	// 이용기관ID
	private String utlinsttId;

	// 기업명
	private String bnnm;

	// 업종코드
	private String mainBizCd;

	// 업종명
	private String mainBizCdNm;

	// 사업자등록번호
	private String bzn;

	// 주소
	private String adr;

	// 홈페이지
	private String hmpgUrlAdr;

	// 직원 수
	private String empCnt;

	// 총 발행 주식수
	private String ttisStcnt;

	// 자본금 총계
	private String cpfnAmt;

	// 기업소개
	private String enprInrdCon;

	// 투자 단계
	private String invmHopeStgNm;

	// 투자 금액
	private String invmHopeAmtNm;

	// 주주정보
	private List<IrStockHolderVO> irStchList;

	// 비즈니스 분야
	private List<CompanyInvestFieldVO> bsinList;

	// 활용기술
	private List<CompanyUtilTechVO> techUtilList;

	// 기존 투자 유치
	private List<VncmLoanVO> investList;

	// 담당자 명
	private String rsprNm;

	// 연락처
	private String cnpl;

	// 추천 영업점코드
	private String brcd;

	// 추천 영업점명
	private String brcdNm;

	// 추천 직원 코드
	private String emn;

	// 추천 직원명
	private String emm;

	// INFOTECH 간편서류 리스트
	private List<ComFileInfoVO> infotechDoc;

	// 발표자료 파일 ID
	private String anncDatFileId;

	// 추가서류 파일 ID
	private String addtDocFileId;

	// 발표 파일 리스트
	private ComFileInfoVO annc;

	// 발표 파일 리스트
	private ComFileInfoVO addt;

	// 투자 심사 요청 ID
	private String invmExntRqstId;

	// 투자 심사 결과 코드
	private String exntRsltCd;

	// 투자 심사 진행단계 코드
	private String invmExntPgsgCd;

	// 투자 심사 진행단계명
	private String invmExntPgsgNm;

	// 투자심사 수정 날짜
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Timestamp amnnTs;

	// 휴대폰 번호
	private String moblphonNo;

	// 담당자 명
	private String userNm;

	// 심사담당자ID
	private String exntRsprId;

	// 심사의견
	private String exntMsgCon;

	// 투자 예상액
	private String invmPrfrScdlAmt;

	// 비고
	private String exntRsltRmrk;
}
