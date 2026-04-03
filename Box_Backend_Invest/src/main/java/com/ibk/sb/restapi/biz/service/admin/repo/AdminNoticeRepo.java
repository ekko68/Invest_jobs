package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.NoticeFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.NoticeVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminNoticeRepo {

    // 공지사항 리스트 조회
    List<NoticeVO> selectNoticeList(RequestSearchVO vo);

    // 공지사항 개별 조회
    NoticeVO selectNotice(@Param("pbnsId") String pbnsId);

    // 공지사항 파일 리스트 조회
    List<NoticeFileVO> selectNoticeFileList(@Param("pbnsId") String pbnsId);

    // 공지사항 등록
    int insertNoticeInfo(@Param("params") NoticeVO vo);

    // 공지사항 수정
    int updateNoticeInfo(@Param("params") NoticeVO vo);

    // 공지사항 삭제
    int deleteNoticeInfo(@Param("params") NoticeVO vo);

    // 공지사항 파일 매핑 등록
    int insertNoticeAttachFileMapping(@Param("params") NoticeFileVO file);

    // 공지사항 파일 매핑 삭제
    int deleteNoticeAttachFileMapping(@Param("pbnsId") String pbnsId);

}
