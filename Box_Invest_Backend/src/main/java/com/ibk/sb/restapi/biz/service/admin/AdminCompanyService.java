package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminCompanyRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanySummaryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCompanyService {

    private final AdminCompanyRepo adminCompanyRepo;

    private final CompanyService companyService;

    /**
     * 운영자 포탈 기업목록 조회
     * @param requestVO
     * @return
     * @throws Exception
     */
//    public PagingVO<CompanySummaryVO> searchCompanyList(RequestRcmdCompanySearchVO requestRcmdCompanySearchVO) throws Exception {
    public PagingVO<CompanySummaryVO> searchCompanyList(RequestSearchCompanyVO requestVO) throws Exception {

//        RequestSearchCompanyVO requestVO = new RequestSearchCompanyVO(requestRcmdCompanySearchVO);
        return companyService.searchCompanyList(requestVO);
    }

    /**
     * 운영자 포탈 추천 기업 등록
     * @param requestListBodyAdminVO
     * @throws Exception
     */
    public void saveCompanyRecommend(RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestListBodyAdminVO.getAdminUser() != null && requestListBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestListBodyAdminVO.getList() != null && requestListBodyAdminVO.getList().size() > 0) {
            requestListBodyAdminVO.getList().forEach(utlinsttId -> {
                adminCompanyRepo.mergeCompanyRecommend(utlinsttId, IvtCode.YnTypeEnum.Y.name(), requestListBodyAdminVO.getAdminUser().getAdminUserId(), requestListBodyAdminVO.getAdminUser().getAdminUserId());
            });
        }
    }

    /**
     * 운영자 포탈 추천 기업 삭제
     * @param requestListBodyAdminVO
     * @throws Exception
     */
    public void deleteCompanyRecommend(RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestListBodyAdminVO.getAdminUser() != null && requestListBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestListBodyAdminVO.getList() != null && requestListBodyAdminVO.getList().size() > 0) {
            requestListBodyAdminVO.getList().forEach(utlinsttId -> {
                adminCompanyRepo.mergeCompanyRecommend(utlinsttId, IvtCode.YnTypeEnum.N.name(), requestListBodyAdminVO.getAdminUser().getAdminUserId(), requestListBodyAdminVO.getAdminUser().getAdminUserId());
            });
        }
    }
}
