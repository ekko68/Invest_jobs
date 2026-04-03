package com.ibk.sb.restapi.biz.service.common.repo;

import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommonFileRepo {

    // 파일 조회
    public ComFileInfoVO selectFileInfo(@Param("fileId") String fileId);

    // 파일 정보 저장
    public Integer insertFileInfo(ComFileInfoVO fileInfoVO);

    // 파일 권한 정보 업데이트
//    public Integer updateFileAuth(FileInfoVO fileInfoVO);

    // 파일 논리 삭제
    public Integer deleteFileInfo(@Param("fileId") String fileId,
                                  @Param("amnnUserId") String amnnUserId);

    // 파일 레코드 물리 삭제
    public Integer deleteFilePhysical(@Param("fileId") String fileId);
    
    // 파일 임시이름으로 infotech 간편서류 조회
    public List<ComFileInfoVO> selectInfotechFileInfo(@Param("fileNm") String fileNm);
    
}
