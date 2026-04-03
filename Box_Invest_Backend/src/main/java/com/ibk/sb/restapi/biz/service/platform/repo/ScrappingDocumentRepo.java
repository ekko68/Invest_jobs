package com.ibk.sb.restapi.biz.service.platform.repo;

import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceIvtKeyVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScrappingDocumentRepo {

    // 기업 간편서류 키 등록
    public Integer insertNiceSimpleDocKey(NiceIvtKeyVO niceIvtKeyVO);

    // 투자박스에서 제출한 NICE 간편서류 키 조회
    List<String> selectNiceSimpleDocKey(@Param("utlinsttId") String utlinsttId);

    // 간편서류 키 논리삭제
    public Integer deleteNiceSimpleDocKey(@Param("simpDocRgsnId") String simpDocRgsnId,
                                          @Param("amnnUserId") String amnnUserId);
}
