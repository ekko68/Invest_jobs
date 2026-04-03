package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminDocumentRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.DocumentFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.DocumentVO;
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
public class AdminDocumentService {

    private final AdminDocumentRepo repo;

    /**
     * 운영자 포탈 - 문서관리 목록 조회
     * @return
     */
    public PagingVO<DocumentVO> searchDocumentList(RequestSearchVO params) throws Exception {
        List<DocumentVO> list = repo.selectDocumentList(params);
        list = list == null ? new ArrayList<>() : list;
        return new PagingVO<>(params, list);
    }

    /**
     * 운영자 포탈 - 문서관리 상세 조회
     * @param dcmnId
     * @return
     */
    public DocumentVO findDocumentDetail(String dcmnId) throws Exception {
        // 문서관리 조회
        DocumentVO detail = repo.selectDocumentDetail(dcmnId);

        if(detail == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 문서관리 파일 리스트 조회
        List<DocumentFileVO> fileList = repo.selectDocumentFileList(dcmnId);
        detail.setAttachFileList(fileList == null ? new ArrayList<>() : fileList);

        return detail;
    }

    /**
     * 운영자 포탈 - 문서관리 등록
     * @param requestBodyAdminVO
     * @return
     */
    public boolean saveDocument(RequestBodyAdminVO<DocumentVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        // 문서관리 정보 저장
        int insCnt = 0;

        // 작성자 아이디 세팅
        requestBodyAdminVO.getParams().setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        requestBodyAdminVO.getParams().setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        if(StringUtils.hasLength(requestBodyAdminVO.getParams().getDcmnId())) {
            insCnt = repo.updateDocumentInfo(requestBodyAdminVO.getParams());
        } else {
            requestBodyAdminVO.getParams().setDcmnId(UUID.randomUUID().toString());
            insCnt = repo.insertDocumentInfo(requestBodyAdminVO.getParams());
        }

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);

        // 기존 첨부 파일 정보 삭제
        repo.deleteDocumentAttachFileMapping(requestBodyAdminVO.getParams().getDcmnId());

        // 첨부 파일 정보 저장
        if(requestBodyAdminVO.getParams().getAttachFileList() != null) {
            for(DocumentFileVO file : requestBodyAdminVO.getParams().getAttachFileList()) {
                file.setDcmnId(requestBodyAdminVO.getParams().getDcmnId());
                file.setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
                file.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

                int fileInsCnt = repo.insertDocumentAttachFileMapping(file);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);
            };
        }

        return true;
    }

    /**
     * 운영자 포탈 - 문서관리 삭제
     * @param requestListBodyAdminVO
     * @return
     */
    public boolean deleteDocument(RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestListBodyAdminVO.getAdminUser() != null && requestListBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        DocumentVO params = new DocumentVO();
        if(requestListBodyAdminVO.getList() != null && requestListBodyAdminVO.getList().size() > 0) {
            requestListBodyAdminVO.getList().forEach(id -> {
                params.setDcmnId(id);
                params.setAmnnUserId(requestListBodyAdminVO.getAdminUser().getAdminUserId());
                int delCnt = repo.deleteDocument(params);
                if (delCnt < 1) throw new BizException(StatusCode.MNB0007);
            });
        }
        return true;
    }
}
