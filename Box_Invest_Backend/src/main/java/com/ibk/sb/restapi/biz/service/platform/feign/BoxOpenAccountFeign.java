package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.UsisUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(
        name = "box-open-api-account",
        url = "${feign.box-open-api.url}",
//        configuration = FeignBoxKeyConfig.MnbKeyConfig.class)
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenAccountFeign {

    /**
     * 이용기관 원장 조회
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/mnbcmpy/CmpyInq")
    BoxListResponseVO<MainCompanyVO> getMainBoxUtlinsttInfo(@RequestBody Map<String, String> body);

    /**
     * 사용자 상세정보 조회
     * @param body
     * @return
     */
    @PostMapping(value = "/api/mb/v1/mnbusr/plfUserLedgrDtlInq")
    BoxResponseVO<MainUserVO> getMainBoxUserInfo(@RequestBody Map<String, String> body);

    /**
     * 권한별 이용기관 사용자목록 조회 (pf)
     * RSLT_LIST 로 data가 들어오므로 주의해야한다.
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/mnbuser/authorUtlAppUserInq")
    BoxListResponseVO<UsisUserVO> getUserListByUsisAndAuthor(@RequestBody Map<String, String> body);
}
