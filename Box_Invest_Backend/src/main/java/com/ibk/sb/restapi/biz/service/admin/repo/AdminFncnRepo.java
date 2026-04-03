package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.*;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.fncn.vo.FncnBsnsJntOpcmVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminFncnRepo {

    //운영자 포탈 출자사업 공고 목록
    List<AdminFncnBsnsPbanBasicVO> searchAdminFncnBsnsPbanList(AdminFncnBsnsPageVO adminFncnBsnsPageVO);

    // 운영자 포탈 출자사업 공고 엑셀 다운로드
    List<AdminFncnPbanExcelVO> excelDownloadFncnPban(AdminFncnBsnsPageVO adminFncnBsnsPageVO);
    
    // 운영자 포탈 출자사업 공고 상세화면 조회
    AdminFncnBsnsPbanBasicVO searchAdminFncnBsnsPbanDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 공고 등록
    void insertAdminFncnBsnsPban(AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO);

    // 운영자 포탈 출자사업 공고 모집분야 조회
    List<AdminFncnBsnsEnlsFildVO> searchFncnBsnsPbanEnlsFild(@Param("fncnId") String fncnId);

    // 운영자 포탈 모집분야 등록
    void insertAdminEnlsFild(AdminFncnBsnsEnlsFildVO adminFncnBsnsEnlsFildVO);

    // 운영자 포탈 출자사업 공고 목록 카운트
    int countAdminFncnBsnsPbanTotal();

    // 운영자 포탈 출자사업 접수 목록
    List<AdminFncnBsnsRcipVO> searchAdminFncnBsnsRcipList(AdminFncnBsnsPageVO adminFncnBsnsPageVO);

    // 운영자 포탈 출자사업 접수 상세조회
    AdminFncnBsnsRcipVO searchAdminFncnBsnsRcipDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 공동GP 정보 조회
    List<AdminFncnBsnsJntOpcmVO> searchAdminFncnBsnsJntOpcmDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 펀드참여인력 조회
    List<AdminFncnBsnsInvvVO> searchAdminFncnBsnsInvvDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 출자자모집 조회
    List<AdminFncnBsnsEnlsVO> searchAdminFncnBsnsEnlsDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 주목적 조회
    List<AdminFncnBsnsPmglVO> searchAdminFncnBsnsPmglDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 우대항목 접수 조회
    List<AdminFncnBsnsChcPrnlVO> searchAdminFncnBsnsChcPrnlDetail(@Param("fncnId") String fncnId);

    // 운영자 포탈 출자사업 접수 엑셀 다운로드
    List<AdminFncnRcipExcelVO> excelDownloadFncnRcip(AdminFncnBsnsPageVO adminFncnBsnsPageVO);

    // 운영자 포탈 출자사업 공고 상태 변경
    void updateAdminFncnBsnsPbanState(AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO);

    // 운영자 포탈 출자사업 접수 상태 변경
    void updateAdminFncnBsnsRcipState(AdminFncnBsnsRcipVO adminFncnBsnsRcipVO);

    // 운영자 포탈 출자사업 모집분야 항목 조회
    List<ComCodeVO> searchAdminFncnBsnsEnlsFildList(@Param("grpId") String grpId);

    // 운영자 포탈 출자사업 모집분야 항목 등록
    void saveAdminFncnBsnsEnlsFild(ComCodeVO comCodeVO);

    // 운영자 포탈 출자사업 모집분야 항목 삭제
    void deleteAdminFncnBsnsEnlsFild(ComCodeVO comCodeVO);

    // 운영자 포탈 출자사업 모집분야 등록건수 카운트
    int countAdminFncnBsnsEnlsFildTotal(@Param("grpId") String grpId);

    // 운영자 포탈 출자사업 공고 모집분야 삭제
    void deleteAdminFncnBsnsEnlsFildList(@Param("fncnId") String id);
}
