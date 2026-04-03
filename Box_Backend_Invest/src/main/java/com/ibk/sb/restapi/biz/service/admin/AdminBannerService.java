package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminBannerRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBannerService {

    private final CommonFileService fileService;

    private final AdminBannerRepo bannerRepo;

    /**
     * 운영자 포탈 - 배너 목록 조회
     * @param bannerTypeCodeId
     * @return
     */
    public List<BannerVO> searchBannerList(String bannerTypeCodeId) throws Exception {
        List<BannerVO> result = bannerRepo.selectBannerList(bannerTypeCodeId, false);
        for(BannerVO vo : result) {
            vo.setFileInfo(StringUtils.hasLength(vo.getFileId()) ? fileService.searchFile(vo.getFileId()) : null);
        }
        return result;
    }

    /**
     * 운영자 포탈 - 배너 저장
     * @param requestListBodyAdminVO
     * @return
     * @throws Exception
     */
    public boolean saveBanner(ComCode bannerType, RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestListBodyAdminVO.getAdminUser() != null && requestListBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        List<BannerVO> list = requestListBodyAdminVO.getList() != null ? requestListBodyAdminVO.getList() : new ArrayList<>();

        int idx = 1;
        for (BannerVO bannerVO : list) {

            bannerVO.setRgsnUserId(requestListBodyAdminVO.getAdminUser().getAdminUserId());
            bannerVO.setAmnnUserId(requestListBodyAdminVO.getAdminUser().getAdminUserId());

            if(bannerVO.getFileInfo() != null) bannerVO.setBnnrImgFileId(bannerVO.getFileInfo().getFileId());

            BannerVO bannerInfo = bannerRepo.selectBannerInfo(bannerType.getCode(), idx);
            if(bannerInfo != null) {
                if (bannerRepo.updateBannerInfo(bannerType.getCode(), idx, bannerVO) < 1) {
                    throw new Exception(bannerType.getName() + bannerType.getName() + " 정보 수정 오류 발생");
                }
            } else {
                if (bannerRepo.insertBannerInfo(bannerType.getCode(), idx, bannerVO) < 1) {
                    throw new Exception("배너 정보 입력 오류 발생");
                }
            }
            idx++;
        }
        return true;
    }

    /**
     * 운영자 포탈 - 배너 사용 여부 갱신
     * @param requestBodyAdminVO
     * @return
     */
    public boolean updateDisplay(RequestBodyAdminVO<BannerVO> requestBodyAdminVO) {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        BannerVO params = requestBodyAdminVO.getParams();
        params.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        return bannerRepo.updateDisplay(params) > 0 ? true : false;
    }

}
