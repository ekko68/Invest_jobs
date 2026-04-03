package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminNoticeRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.NoticeFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.NoticeVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminNoticeService {

    private final AdminNoticeRepo repo;

    /**
     * 운영자 포탈 - 공지사항 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<NoticeVO> searchNoticeList(RequestSearchVO params) throws Exception  {

        // 공지사항 리스트 조회
        List<NoticeVO> noticeList = repo.selectNoticeList(params);
        noticeList = noticeList == null ? new ArrayList<>() : noticeList;

        return new PagingVO<>(params, noticeList);
    }

    /**
     * 운영자 포탈 - 공지사항 상세 조회
     * @param noticeId
     * @return
     * @throws Exception
     */
    public NoticeVO searchNotice(String noticeId) throws Exception {

        // 공지사항 조회
        NoticeVO noticeVO = repo.selectNotice(noticeId);

        if(noticeVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 공지사항 파일 리스트 조회
        List<NoticeFileVO> fileList = repo.selectNoticeFileList(noticeId);
        noticeVO.setAttachFileList(fileList == null ? new ArrayList<>() : fileList);

        return noticeVO;
    }

    /**
     * 운영자 포탈 - 공지사항 등록
     * @param requestBodyAdminVO
     * @return
     */
    public boolean saveNotice(RequestBodyAdminVO<NoticeVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        // 공시사항 정보 저장
        int insCnt = 0;

        // 관리자 아이디 설정
        requestBodyAdminVO.getParams().setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        requestBodyAdminVO.getParams().setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        if(StringUtils.hasLength(requestBodyAdminVO.getParams().getPbnsId())) {
           insCnt = repo.updateNoticeInfo(requestBodyAdminVO.getParams());
        } else {
            requestBodyAdminVO.getParams().setPbnsId(UUID.randomUUID().toString());
            insCnt = repo.insertNoticeInfo(requestBodyAdminVO.getParams());
        }

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);
        
        // 기존 첨부 파일 정보 삭제
        repo.deleteNoticeAttachFileMapping(requestBodyAdminVO.getParams().getPbnsId());

        // 첨부 파일 정보 저장
        if(requestBodyAdminVO.getParams().getAttachFileList() != null) {
            for(NoticeFileVO file : requestBodyAdminVO.getParams().getAttachFileList()) {
                file.setPbnsId(requestBodyAdminVO.getParams().getPbnsId());
                file.setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
                file.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
                int fileInsCnt = repo.insertNoticeAttachFileMapping(file);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);
            };
        }

        return true;
    }

    /**
     * 운영자 포탈 - 공지사항 삭제
     * @param requestListBodyAdminVO
     * @return
     */
    public boolean deleteNotice(RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestListBodyAdminVO.getAdminUser() != null && requestListBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        NoticeVO params = new NoticeVO();
        if(requestListBodyAdminVO.getList() != null && requestListBodyAdminVO.getList().size() > 0) {
            requestListBodyAdminVO.getList().forEach(id -> {
                params.setPbnsId(id);
                params.setAmnnUserId(requestListBodyAdminVO.getAdminUser().getAdminUserId());
                int delCnt = repo.deleteNoticeInfo(params);
                if (delCnt < 1) throw new BizException(StatusCode.MNB0007);
            });
        }
        return true;
    }

}
