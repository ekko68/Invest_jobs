package com.ibk.sb.restapi.biz.service.support;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.AdminNoticeService;
import com.ibk.sb.restapi.biz.service.admin.AdminQnaService;
import com.ibk.sb.restapi.biz.service.admin.vo.NoticeVO;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final AdminNoticeService noticeService;
    private final AdminQnaService qnaService;

    /**
     * 공지사항 페이징 리스트 조회
     * @param requestSearchVO
     * @return
     * @throws Exception
     */
    public PagingVO<NoticeVO> searchNoticeList(RequestSearchVO requestSearchVO) throws Exception  {
        return noticeService.searchNoticeList(requestSearchVO);
    }

    /**
     * 공지사항 상세 조회
     * @param noticeId
     * @return
     * @throws Exception
     */
    public NoticeVO searchNotice(String noticeId) throws Exception {
        return noticeService.searchNotice(noticeId);
    }

    /**
     * Q&A 페이징 리스트 조회
     * @param requestSearchVO
     * @return
     * @throws Exception
     */
    public PagingVO<QnaVO> searchQnaList(RequestSearchVO requestSearchVO) throws Exception {
        return qnaService.searchQnaList(requestSearchVO);
    }

    /**
     * Q&A 상세조회
     * @param qaId
     * @return
     * @throws Exception
     */
    public QnaVO searchQna(String qaId) throws Exception {

        // 로그인 사용자 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        QnaVO qnaVO = qnaService.searchQna(qaId);

        // 투자박스 프론트 비공개 접근 확인 여부를 위한 로직
        if(!(StringUtils.hasLength(qnaVO.getRgsrUsisId()) && qnaVO.getRgsrUsisId().equals(user.getUserGroupId()))) {
            qnaVO = new QnaVO();
            qnaVO.setRightYn(IvtCode.YnTypeEnum.N.name());
        } else {
            qnaVO.setRightYn(IvtCode.YnTypeEnum.Y.name());
        }

        return qnaVO;
    }

    /**
     * Q&A 등록/수정
     * @param qnaVO
     * @throws Exception
     */
    public boolean saveQna(QnaVO qnaVO) throws Exception {
        return qnaService.saveQna(qnaVO);
    }


    /**
     * Q&A 요청 취소
     * @param qnaVO
     * @return
     * @throws Exception
     */
    public boolean cancelQna(QnaVO qnaVO) throws Exception {
        return qnaService.cancelQna(qnaVO);
    }

}
