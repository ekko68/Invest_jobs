package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(
        name = "box-open-api-login",
        url = "${feign.box-open-api.url}",
//        configuration = FeignBoxKeyConfig.MnbKeyConfig.class)
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenLoginFeign {

//    /**
//     * 메인BOX jwt 토큰 체크
//     * @param body
//     * @return
//     */
//    @PostMapping("/api/mb/v1/checkjwt.do")
//    MainJwtResponseVO getJwtTokenCheck(@RequestBody Map<String, String> body);
//
//    /**
//     * jwt 토큰 만료
//     * 해당 jwt토큰을 메인BOX에서 만료 및 무효화 처리
//     * @return
//     */
//    @PostMapping("/api/mb/v1/expirejwt.do")
//    Map<String, Object> logout(@RequestBody Map<String, String> body);

    /**
     * (공통 로그인) 메인BOX 사용자 세션 정보 확인
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/com001/selectUserSessionInfo")
    Map<String, Object> selectUserSessionInfo(@RequestBody Map<String, String> body);

    /**
     * (공통로그인) 메인BOX 사용자 세션 정보 확인
     * SI 토큰
     * @param BearerToken
     * @return
     */
    @PostMapping("/api/cm/v1/cms001/userSsnInfoInq")
    Map<String, Object> selectUserSessionInfo(@RequestHeader("Authorization")String BearerToken);

}
