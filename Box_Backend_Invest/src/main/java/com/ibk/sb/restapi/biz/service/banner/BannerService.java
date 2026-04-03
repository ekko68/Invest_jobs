package com.ibk.sb.restapi.biz.service.banner;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminBannerRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final AdminBannerRepo bannerRepo;

    private final FileUtil fileUtil;

    /** ================================ CRUD ================================ **/

    /**
     * 배너 목록 조회
     * @param bannerType
     * @return
     */
    public List<BannerVO> searchMainBannerList(ComCode bannerType) throws Exception {

        List<BannerVO> bannerList;

        // 메인 하단 배너, 마이페이지 배너의 경우 비활성화 배너 부분에 대해 비워두는게 아닌 no_image 처리
        if(bannerType != ComCode.MAIN_BANNER_BOTTOM && bannerType != ComCode.MYPAGE_BANNER_COMPANY && bannerType != ComCode.MYPAGE_BANNER_VC) {
            bannerList = bannerRepo.selectBannerList(bannerType.getCode(), true);
        } else {
            bannerList = bannerRepo.selectBannerList(bannerType.getCode(), false);
            bannerList = bannerList == null ? new ArrayList<>() : bannerList.stream().map(x -> {
                if(StringUtils.hasLength(x.getExpuYn()) && x.getExpuYn().equals(IvtCode.YnTypeEnum.Y.name())) {
                    return x;
                } else {
                    BannerVO banner = new BannerVO();
                    banner.setExpuYn(IvtCode.YnTypeEnum.N.name());
                    return banner;
                }
            }).collect(Collectors.toList());
        }

        return fileUtil.setImageUrlList(bannerList);
    }

    /** ================================ ETC ================================ **/
}
