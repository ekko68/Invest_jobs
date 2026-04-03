package com.ibk.sb.restapi.biz.service.vncmloan.repo;

import java.util.List;

import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcCountVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.VncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcVO;

@Mapper
public interface VncmLoanRepo {
    
	// 벤처대출 추천 내역 조회
    List<VncmLoanVO> searchVncmLoanList(RequestVncmLoanVO vo);

    // 나의 벤처대출 추천 내역 조회
    List<VncmLoanVO> searchVncmLoanMyList(RequestVncmLoanVO vo);

	//마이페이지(기업) 벤처대출 신청 내역 조회
    List<VncmLoanAplcVO> searchVncmLoanAplcList(RequestVncmLoanVO vo);

    //마이페이지(기업)벤처대출 추천 여부 및 자료요청 확인
    VncmLoanAplcCountVO countVncmLoanAplcByRecommendStatus(@Param("bzn") String bzn,@Param("recomendSttusCm") String recomendSttusCm);

	//마이페이지(기업) 벤처대출 신청 상세 조회
    VncmLoanAplcVO searchVncmLoanAplc(String vnentrlonId);

	//벤처대출추천 접수
    boolean insertVncmLoanRequest(VncmLoanVO vncmLoanVO);

	//벤처대출추천 접수
    boolean updateVncmLoanRequest(VncmLoanVO vncmLoanVO);

    //마이페이지(기업) 벤처대출 신청
    public Integer insertVncmLoanAplc(VncmLoanAplcVO vncmLoanAplcVO);

    //마이페이지(기업) 벤처대출 수정
    public Integer updateVncmLoanAplc(VncmLoanAplcVO vncmLoanAplcVO);
    
    //간접투자 첨부파일 맵핑 조회
    public List<BoxIvtFileVO> searchVncmLoanFileMapping(@Param("invtId") String invtId);
    
     //간접투자 첨부파일 맵핑 등록
    public int insertVncmLoanFileMapping(BoxIvtFileVO boxIvtFileVO);
    
    //간접투자 첨부파일 맵핑 삭제
    public int deleteVncmLoanFileMapping(@Param("invtId") String invtId);
    
    //마이페이지(기업) 벤처대출취소
    public Integer updateVncmLoanAplcSts(VncmLoanAplcVO vncmLoanAplcVO);

    //협약벤처기관 관리에 해당 사업자번호로 데이터 check
    public Integer selectAgisChk(String bzn);

    // 벤처대출천접수 개별 조회
    String searchVncmLoanAuthority(@Param("bzn") String bzn);

    // 벤처대출천접수 개별 조회
    VncmLoanVO searchVncmLoanDetail(@Param("vnentrlonId") String vnentrlonId);
    
    // 벤처대출 추천 파일 리스트 조회
    List<BoxIvtFileVO> selectVncmLoanFileList(@Param("invtId") String invtId, @Param("atchDsnc") String atchDsnc, @Param("bsdsCd") String bsdsCd);
    
    // 벤처대출 추천 투자 유치 명세 내역 조회
    List<VncmLoanVO> searchVncmLoanInvestList(RequestVncmLoanVO vo);

}
