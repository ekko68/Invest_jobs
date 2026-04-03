package com.ibk.sb.restapi.biz.service.admin.repo;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminRCmdExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVCmdExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanAplcVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;

@Mapper
public interface AdminVncmLoanRepo {

    // 벤처대출추천접수 리스트 조회
    List<AdminVncmLoanVO> searchVncmLoanList(RequestVncmLoanVO vo);

    // 벤처대출천접수 개별 조회
    AdminVncmLoanVO searchVncmLoan(@Param("vnentrlonId") String vnentrlonId, @Param("rcmdEnprBzn") String rcmdEnprBzn);
    
    // 벤처대출천접수 추천 상세 등록
    int insertVncmLoanAplc(@Param("params") AdminVncmLoanVO vo);

    
    // 벤처대출천접수 추천 상태 수정
    int updateVncmLoanInfo(@Param("params") AdminVncmLoanVO vo);
    
	// (포털)벤처대출 신청 내역 조회
    List<AdminVncmLoanAplcVO> searchVncmLoanAplcList(RequestVncmLoanVO vo);
    
    // (포털)벤처대출천접수 개별 조회
    AdminVncmLoanAplcVO searchVncmLoanAplc(@Param("vnentrlonId") String vnentrlonId, @Param("bzn") String bzn);
    
    // (포털) 벤처대출 상태 수정
    public Integer updateVncmLoanAplc(@Param("params") AdminVncmLoanAplcVO vncmLoanAplcVO);
    
    //협약벤처기관 관리에 해당 사업자번호로 데이터 check
    public Integer selectAgisChk(@Param("bzn") String bzn);
    
    // 협약 벤처 투자 기관 목록 조회
    List<AdminAgisVO> searchAgisList(RequestVncmLoanVO vo);

    // 협약 벤처 투자 기관 상세 조회
    AdminAgisVO searchAgisDetail(@Param("agremVnentrSeq") int agremVnentrSeq);
    
    // 협약 벤처 투자 기관 등록/수정
    int updateAgisInfo(AdminAgisVO vo);
    
    // 벤처대출천접수 추천 상세 등록
    int insertVncmLoanBprIdxNo(@Param("params") AdminVncmLoanVO vo);
    
    // 벤처대출 추천 파일 리스트 조회
    List<BoxIvtFileVO> selectVncmLoanFileList(@Param("invtId") String invtId, @Param("atchDsnc") String atchDsnc, @Param("bsdsCd") String bsdsCd);
    
    public Integer selectAgisSeqInfo();
    
    //협약 벤처투자기관 관리 협약서 Y합계
    Integer searchAgremY();
    
    //협약 벤처투자기관 관리 협약서 N합계
    Integer searchAgremN();
    
    // 사업자 번호로 투자사 협약기관 조회
    AdminAgisVO searchAgisBzn(@Param("bzn") String bzn);
    
    String selectEnrpInfo(@Param("bzn") String bzn);
    
    // 협약 벤처 투자 기관 엑셀 목록 조회
    List<AdminAgisExcelVO> searchExcelAgisList(RequestVncmLoanVO vo);
    
    // ibk 벤처대출 추천접수(VC) 엑셀 목록 조회
    List<AdminVCmdExcelVO> searchVncmLoanExcelList(RequestVncmLoanVO vo);
    
    List<AdminRCmdExcelVO> searchVncmLoanAplcExcelList(RequestVncmLoanVO vo);

}
