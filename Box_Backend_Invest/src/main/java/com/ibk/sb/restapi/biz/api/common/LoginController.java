package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.jwt.JwtTokenUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.user.UserService;
import com.ibk.sb.restapi.biz.service.user.vo.LoginUserVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.ibkbox.api.common.session.BoxApiSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Api(tags = {"투자박스 로그인 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/login", "/api/iv/v1/login"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class LoginController {

    private final UserService userService;

    private final PlatformAccountService platformAccountService;

    private final JwtTokenUtil jwtTokenUtil;

    private final BoxApiSession boxApiSession;


    /** ================================ Get Method Mapping ================================ **/

    @ApiOperation(value = "로그인한 유저정보 조회")
    @GetMapping
    @ResponseBody
    public ResponseData searchLoginUserInfo(HttpServletRequest request) throws Exception {

        /**
         * jwt 로그인 후 userDetail 에서 유저정보 획득
         */
        log.info("boxApiSession:= " + boxApiSession.getUsisId());
        log.info("boxApiSession:= " + boxApiSession.getLgnMnbrId());
        log.info("boxApiSession:= " + boxApiSession.getEdpsCsn());

        LoginUserVO loginUserVO = userService.searchLoginUserInfo();
        String token = StringUtils.hasLength(request.getHeader("Authorization"))
                ? StringUtil.splitSimpleResult(request.getHeader("Authorization"), " ", 1) : "";

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(loginUserVO)
                .token(token)
                .build();
    }

    @ApiOperation(value = "JWT 유효성 검사 (필터 통과 확인) 및 토큰 갱신")
    @GetMapping("/jwt/check")
    @ResponseBody
    public ResponseData jwtCheck() throws Exception {

        String refreshToken = null;

        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CustomUser) {
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(StringUtils.hasLength(user.getUsername()) && StringUtils.hasLength(user.getUserGroupId())) {
                refreshToken = jwtTokenUtil.makeJwt(user.getUsername(), user.getUserGroupId());
            }
        }

        if(!StringUtils.hasLength(refreshToken)) throw new BizException(StatusCode.COM0001);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .token(refreshToken)
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

//    /**
//     * (공통 로그인) 로그인 JWT 발급
//     * 2023.02.24
//     * @param loginMap
//     * @return
//     * @throws Exception
//     */
//    @ApiOperation(value = "(공통 로그인) 로그인 JWT 발급")
//    @ApiImplicitParam(name = "loginMap", value = "type, auth")
//    @PostMapping
//    public ResponseData login(@RequestBody Map<String, String> loginMap) throws Exception {
//
//
//        String type = loginMap.get("type");
//        String auth = loginMap.get("auth");
//
//        if (!StringUtils.hasLength(type) || !StringUtils.hasLength(auth)) {
//            throw new Exception("필수입력값을 확인해주세요");
//        }
//
//        // 메인박스 로그인 세션 정보 조회
//        if ("2".equals(type)) {
//            HashMap<String, String> reqJson = new HashMap<>();
//            reqJson.put("ssnUuid", auth);
//
//            // 세션관리 테이블에서 정보 취득
//            Map<String, Object> res = platformAccountService.selectUserSessionInfo(reqJson);
//
//            String lgnMnbrId = (String) res.get("lgnMnbrId");
//            String usisId = (String) res.get("usisId");
//
//            String jwt = jwtTokenUtil.makeJwt(lgnMnbrId, usisId);
//
//            return ResponseData.builder()
//                    .code(HttpStatus.OK.value())
//                    .token(jwt)
//                    .message(HttpStatus.OK.getReasonPhrase())
//                    .build();
//        }
//
//        // 로그인 타입이 올바르지 않을 경우
//        else {
//            return ResponseData.builder().code(HttpStatus.BAD_REQUEST.value()).message(HttpStatus.BAD_REQUEST.getReasonPhrase()).build();
//        }
//    }

//    @ApiOperation(value = "로그아웃")
//    @PostMapping("/logout")
//    public ResponseData logout(HttpServletRequest request) throws Exception {
//
//        String requestTokenHeader = request.getHeader("Authorization");
//        String jwtToken = "";
//
//        // 토큰 존재 체크
//        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
//            jwtToken = requestTokenHeader.substring(7);
//        }
//
//        // 토큰이 없거나 올바른 형식으로 토큰을 받을 수 없는 경우, 에러로 리턴
//        else {
//            return ResponseData.builder().code(HttpStatus.BAD_REQUEST.value()).message(StatusCode.COM0000.getMessage()).build();
//        }
//
//        Map<String, Object> resultMap = platformAccountService.logout(jwtToken);
//
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .data(resultMap)
//                .build();
//    }
}
