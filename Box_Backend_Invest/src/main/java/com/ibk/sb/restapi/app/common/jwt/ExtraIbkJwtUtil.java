package com.ibk.sb.restapi.app.common.jwt;

import com.ibk.sb.restapi.app.common.login.LoginRequestFilter;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExtraIbkJwtUtil {

    private final LoginRequestFilter loginRequestFilter;
    private final PlatformAccountService platformAccountService;

    // 허용 api 리스트
//    private final List<String> ALLOWED_API_SERVLET_PATH = Arrays.asList(
//            "/api/iv/v1/doc/seal/infotech/cert"
//            , "/api/iv/v1/doc/nda/eform/contract/upload"
//    );

    // 허용 Method
//    private final List<String> ALLOWED_METHOD = Arrays.asList(
//            HttpMethod.POST.name()
//    );

    /**
     * Box Open Api간 헤더 제한으로 Authorization 송신 불가로 인해
     * Box 서버 사이 토큰 정보 전송 및 UserDetail 전송을 위함
     *
     * ->   filter에서 method와 api url에 따라 제한적으로 토큰이 없는 api요청에 대해 처리할 경우,
     *      inputStream에 담긴 body 정보를 읽은 후 Controller에서 해당 stream 이용을 못함
     *      Controller 혹은 Service 단에서 body에서 받은 토큰 정보로 토큰 검증 및 userDetail을 생성
     *      (interceptor로 모든 요청에서 stream을 복제하기 보단 util method를 따로 만듦)
     * @param authToken
     * @throws Exception
     */
    public void setUserDetailByJwtNextFilter (String authToken, HttpServletRequest request) throws Exception {

//        if(!(ALLOWED_API_SERVLET_PATH.contains(request.getServletPath()) && ALLOWED_METHOD.contains(request.getMethod()))) {
//            log.error("failed auth servlet path: {}", request.getServletPath());
//            log.error("failed auth method: {}", request.getMethod());
//            throw new BizException(StatusCode.COM0005);
//        }

        String username = null;
        String companyname = null;
//        String jwtToken = null;
        String auth = null;

        try {
            if (StringUtils.hasLength(authToken) && authToken.startsWith("Bearer ")) {
//                jwtToken = authToken.substring(7);
//
//                Map<String, String> jwtClaimsMap = jwtTokenUtil.getClaimFromToken(jwtToken);
//                username = jwtClaimsMap.get("USERID");
//                companyname = jwtClaimsMap.get("UTLINSTTID");

                auth = authToken.substring(7);

                // 세션관리 테이블에서 정보 취득
                HashMap<String, String> reqJson = new HashMap<>();
                reqJson.put("ssnUuid", auth);
                Map<String, Object> res = platformAccountService.selectUserSessionInfo(reqJson);

                username = (String) res.get("lgnMnbrId");
                companyname = (String) res.get("usisId");
            }

//            MainJwtResponseVO mainBoxJwt = platformAccountService.searchJwtTokenCheck(username, companyname);
//
//            // DB에 담겨있는 토큰값과 요청받은 토큰값이 다른 경우, 에러
//            if (mainBoxJwt.getJWT() == null) {
//                log.info(mainBoxJwt.getJWT());
//                throw new BizException(StatusCode.BIZ0000);
//            }
//
//            if(!jwtToken.equals(mainBoxJwt.getJWT())) {
//                throw new BizException(StatusCode.BIZ0000);
//            }

            // 검수 정보를 가지고 UserDetail 생성 및 Authentication
//            UserDetails userDetails = jwtRequestFilter.loadUserDetail(username, companyname, jwtToken);
            UserDetails userDetails = loginRequestFilter.loadUserDetail(username, companyname);
//            if (username.equals(userDetails.getUsername()) && !jwtRequestFilter.isTokenExpired(jwtToken)) {
            if (username.equals(userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

        } catch (IllegalArgumentException e) {
            log.error("Unable to get JWT Token");
            throw e;
        } catch (ExpiredJwtException e) {
            log.error("JWT Token has expired");
            throw e;
        }
    }
}
