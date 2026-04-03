package com.ibk.sb.restapi.biz.service.fncn.repo;

import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.fncn.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FncnRepo {

    // 출자사업 공고 목록 조회
    List<FncnBsnsPbanBasicVO> searchFncnPbanList(FncnBsnsEnlsPageVO params);

    // 출자사업 접수 목록 갯수 카운트
    int countFncnBsnsRcipTotal();

    // 출자사업 공고 상세
    FncnBsnsPbanBasicVO detailFncnBsnsPban(@Param("fncnId") String id);

    // 출자사업 모집분야 조회
    List<FncnBsnsEnlsFildVO> detailFncnBsnsEnlsFild(@Param("fncnId") String id);

    // 출자사업 접수 등록 및 수정
    void insertFncnBsnsRcip(FncnBsnsRcipVO params);

    // 출자사업 접수 공동 GP 등록 및 수정
    void insertFncnBsnsJntOpcm(FncnBsnsJntOpcmVO fncnBsnsJntOpcmVO);

    // 출자사업 접수 펀드참여 등록 및 수정
    void insertFncnBsnsInvvHmrs(FncnBsnsInvvHmrsVO fncnBsnsInvvHmrsVO);

    // 출자사업 접수 출자자 모집 등록 및 수정
    void insertFncnEnls(FncnEnlsVO fncnEnlsVO);

    // 출자사업 접수 주목적 등록 및 수정
    void insertFncnBsnsPmglItm(FncnBsnsPmglItmVO fncnBsnsPmglItmVO);

    // 출자사업 접수 선정우대 등록 및 수정
    void insertFncnBsnsChcPrnl(FncnBsnsChcPrnlVO fncnBsnsChcPrnlVO);

    // 출자사업 나의 신청 현황 목록 조회
    List<FncnBsnsRcipVO> searchFncnBsnsMyList(FncnBsnsEnlsPageVO fncnBsnsEnlsPageVO);

    // 출자사업 나의 신청현황 상세 조회
    FncnBsnsRcipVO detailMyFncnBsns(@Param("fncnId") String id);

    // 출자사업 나의 신청현황 공동운용사 상세 조회
    List<FncnBsnsJntOpcmVO> detailFncnBsnsJntOpcm(@Param("fncnId") String id);

    // 출자사업 나의 신청현황 펀드참여인력 상세 조회
    List<FncnBsnsInvvHmrsVO> detailFncnBsnsInvvHmrs(@Param("fncnId") String id);

    // 출자사업 나의 신청현황 출자자 모집 상세 조회
    List<FncnEnlsVO> detailFncnEnls(@Param("fncnId") String id);

    // 출자사업 나의 신청현황 주목적 상세 조회
    List<FncnBsnsPmglItmVO> detailFncnBsnsPmglItm(@Param("fncnId") String id);

    // 출자사업 나의 신청현황 주목적 상세 조회
    List<FncnBsnsChcPrnlVO> detailFncnBsnsChcPrnl(@Param("fncnId") String id);

    // 출자사업 접수 취소
    void fncnBsnsRcipCancel(FncnBsnsRcipVO fncnBsnsRcipVO);

    // 출자사업 공동GP정보 행 삭제
    void deleteFncnBsnsComGpInfo(@Param("fncnId") String id);

    // 출자사업 펀드참여인력 행 삭제
    void deleteFncnBsnsInvvHmrs(@Param("fncnId") String id);

    // 출자사업 출자자 모집현황 행 삭제
    void deleteFncnBsnsfncnEnls(@Param("fncnId") String id);

    // 출자사업 주목적 추가항목 행 삭제
    void deleteFncnBsnsPmglList(@Param("fncnId") String id);

    // 출자사업 주목적 추가항목 행 삭제
    void deleteFncnBsnsChcPrnl(@Param("fncnId") String id);
}
