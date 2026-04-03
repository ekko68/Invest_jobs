package com.ibk.sb.restapi.biz.service.fund.repo;


import java.util.List;

import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FncnEnlsPsstListVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoPageVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.PrmrLpChcFildVO;

@Mapper
public interface FundRepo {
	
	// 펀드제안 목록 조회
	List<FundPrdtInfoVO> searchFundList(FundPrdtInfoPageVO params);

	// 펀드제안 목록 조회
	List<FundPrdtInfoVO> searchFundMyList(FundPrdtInfoPageVO params);
	
	// 펀드제안 목록 불러오기
	List<FundPrdtInfoVO> loadFundList(@Param("utlinsttId") String utlinsttId);
	
	// 펀드제안 제안펀드 등록 - step1
	int insertFundPrdtInfoStep1(FundPrdtInfoVO vo);

	// 펀드제안 제안펀드 등록 - step1 / 계속작성
	FundPrdtInfoVO searchFundPrdtInfo(@Param("fundId") String fundId);
	
	// 펀드제안 제안펀드 등록 - step1 / 계속작성 / 주요LP
	List<PrmrLpChcFildVO> searchPrmrLpChcFild(@Param("fundId") String fundId);
	
	// 펀드제안 제안펀드 등록 - step1 / 계속작성 / 출자기관
	List<FncnEnlsPsstListVO> searchFncnEnlsPsstList(@Param("fundId") String fundId);
		
	// 펀드제안 제안펀드 수정- step1 / 등록 후 저장 및 종료시
	int updateFundPrdtInfoStep1(FundPrdtInfoVO vo);
	
	// 주요LP 지원 및 선정분야 데이터 등록
	void insertPrmrLpChcFild(PrmrLpChcFildVO vo);
	
	// 주요LP 지원 및 선정분야 데이터 수정
	void updatePrmrLpChcFild(PrmrLpChcFildVO vo);
	
	// 출자자 모집현황 데이터 등록
	void insertFncnEnlsPsst(FncnEnlsPsstListVO vo);
	
	// 출자자 모집현황 데이터 수정
	void updateFncnEnlsPsst(FncnEnlsPsstListVO vo);
	
	// 펀드제안 제안펀드 조회 - step2
	FundOpcmInfoVO searchFundOpcmInfo(@Param("fundId") String fundId);
	
	// 펀드제안 제안펀드 등록 - step2
	void insertFundPrdtInfoStep2(FundOpcmInfoVO vo);
	
	// 펀드제안 제안펀드 수정 - step2 / 등록 후 저장 및 종료시
	void updateFundPrdtInfoStep2(FundOpcmInfoVO vo);
	
	// 제안 펀드 참여 운용인력 조회
	List<ProFundPartcptnVO> searchProFundPartcptn(@Param("fundId") String fundId);
	
	// 제안 펀드 참여 운용인력 등록
	void insertProFundPartcptn(ProFundPartcptnVO vo);
		
	// 제안 펀드 참여 운용인력 수정
	void updateProFundPartcptn(ProFundPartcptnVO vo);
	
	// 운용인력 유지율 매핑 조회
	List<OpratnHnfMntncVO> searchOpratnHnfMntnc(@Param("fundId") String fundId);
		
	// 운용인력 유지율 매핑 등록
	void insertOpratnHnfMntnc(OpratnHnfMntncVO vo);
		
	// 운용인력 유지율 매핑 수정
	void updateOpratnHnfMntnc(OpratnHnfMntncVO vo);
	
	// 관리인력 운용인력 징계여부 리스트 조회
	List<OpratnHnfInfoDscplLVO> searchopratnHnfInfoDscpl(@Param("fundId") String fundId);
		
	// 관리인력 운용인력 징계여부 리스트 등록
	void insertOpratnHnfInfoDscpl(OpratnHnfInfoDscplLVO vo);
		
	// 관리인력 운용인력 징계여부 리스트 수정
	void updateOpratnHnfInfoDscpl(OpratnHnfInfoDscplLVO vo);
	
	// 펀드제안 제안 취소 / TB_BOX_IVT_PRDT_FUND_INFO_M
	void fundPrdtInfoCancle(FundOpcmInfoVO vo);
	
	// 펀드제안 제안 취소 / TB_BOX_IVT_OPERTR_INFO_R
	void fundOpertrInfoCancle(FundOpcmInfoVO vo);
	
	// 펀드제안 최종 등록 시 진행단계 제출완료로 수정
	int updateFundAuditStg(@Param("fundId") String fundId);
	
	// 첨부된 파일 정보 불러오기
	ComFileInfoVO searchFileInfo(@Param("fileId") String managedtaAtchmnfl);

	// 펀드제안 id 카운트
	int countFundIdTotal();

	// 주요주주구성 등록
	List<FundStchCnfgVO> searchFundStchCnfg(@Param("fundId") String fundId);

	// 주요주주구성 등록
	void insertFundStchCnfg(FundStchCnfgVO vo);

	// 주요주주구성 수정
	void updateFundStchCnfg(FundStchCnfgVO vo);
	
}
