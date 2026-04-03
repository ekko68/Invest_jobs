package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.DocumentFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.DocumentVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminDocumentRepo {

    // 운영자포탈 - 문서관리 목록 조회
    List<DocumentVO> selectDocumentList(RequestSearchVO params);

    // 운영자포탈 - 문서관리 상세 조회
    DocumentVO selectDocumentDetail(@Param("dcmnId") String dcmnId);

    // 운영자포탈 - 문서관리 파일 목록 조회
    List<DocumentFileVO> selectDocumentFileList(@Param("dcmnId") String dcmnId);

    // 운영자포탈 - 문서관리 등록
    int insertDocumentInfo(@Param("params") DocumentVO params);

    // 운영자포탈 - 문서관리 삭제
    int deleteDocument(@Param("params") DocumentVO params);

    // 운영자포탈 - 문서관리 수정
    int updateDocumentInfo(@Param("params") DocumentVO params);

    // 운영자포탈 - 문서관리 파일 매핑 등록
    int insertDocumentAttachFileMapping(@Param("params") DocumentFileVO file);

    // 운영자포탈 - 문서관리 파일 매핑 삭제
    void deleteDocumentAttachFileMapping(@Param("dcmnId") String dcmnId);


}
