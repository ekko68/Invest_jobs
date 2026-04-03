package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminQnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminQnaRepo {

    // Q&A 리스트 조회
    List<QnaVO> selectQnaList(RequestSearchVO vo);

    // Q&A 상세 조회
    QnaVO selectQna(@Param("inqrSbjcId") String inqrSbjcId);

    // Q&A 등록
    Integer insertQna(QnaVO qnaVO);

    // Q&A 취소
    Integer cancelQna(@Param("inqrSbjcId") String inqrSbjcId,
                      @Param("pgstCd") String pgstCd,
                      @Param("amnnUserId") String amnnUserId);

    // Q&A 답변 갱신
    boolean updateQnaAnswer(@Param("params") AdminQnaVO vo);

}
