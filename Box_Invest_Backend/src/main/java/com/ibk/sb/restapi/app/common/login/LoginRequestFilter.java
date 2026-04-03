//TODO 공통 로그인 작업하면서 주석처리 해제

package com.ibk.sb.restapi.app.common.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.user.UserService;
import com.ibk.sb.restapi.biz.service.user.vo.UserGroupMappingVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginRequestFilter extends OncePerRequestFilter {

    private final PlatformAccountService platformAccountService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        final String requestTokenHeader = request.getHeader("Authorization");

        // username = userId
        String username = null;
        String companyname = null;
        String auth = null;
        // String si = null;

        try {
            if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {

                auth = requestTokenHeader.substring(7);
                // si = requestTokenHeader.substring(7);

                // 세션관리 테이블에서 정보 취득
                HashMap<String, String> reqJson = new HashMap<>();
                reqJson.put("ssnUuid", auth);
                Map<String, Object> res = platformAccountService.selectUserSessionInfo(reqJson);

                username = (String) res.get("lgnMnbrId");
                companyname = (String) res.get("usisId");

                // 공통 로그인 용 accessToken 조회
                /*String base64Url = si.split("\\.")[1];
                String base64 = base64Url.replace('-', '+').replace('_', '/');
                byte[] decodedBytes = Base64.getDecoder().decode(base64);
                String tokenString = URLDecoder.decode(new String(decodedBytes), "UTF-8");

                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, String> requestBody = objectMapper.readValue(tokenString, Map.class);

                Map<String, Object> res = platformAccountService.selectUserSessionInfo(requestBody.get("accessToken"));

                username = (String) res.get("userId");
                companyname = (String) res.get("utlInsttId");*/
            }

            // 토큰에 들어 있는 아이디가 있고 스프링 컨텍스트에 인증이 되어 있지 않을 경우
//            if (username != null && companyname != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 검수 정보를 가지고 UserDetail 생성 및 Authentication
                UserDetails userDetails = this.loadUserDetail(username, companyname);

                if (username.equals(userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

        } catch (BizException bx) {
            logger.error("Fail Trace : ", bx);
        } catch (Exception e) {
            logger.error("Fail Trace", e);
        }

        filterChain.doFilter(request, response);
    }


    /**
     * Login filter 에서 UserDetail 작성
     *
     * @param userId
     * @return
     * @throws UsernameNotFoundException
     */

    @ResponseBody
    public UserDetails loadUserDetail(String userId, String companyname) throws RuntimeException {

        try {
            List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

            // 로그인 유저 이용기관 관련 정보 조회
            UserGroupMappingVO mappingVO = userService.getUserGroupMapping(userId, companyname);

            // 권한 설정
            authorities.add(new SimpleGrantedAuthority(mappingVO.getUserAuth()));

            // CustomUser로 UserDetails 설정
            CustomUser userDetails = new CustomUser(userId, authorities,
                    mappingVO.getUserNm(), companyname, mappingVO.getUserGroupName(), mappingVO.getUsisTypeEnum(),
                    mappingVO.getCprSe(), mappingVO.getUserGroupBizNum(), mappingVO.getUserProfileImgUrl(), mappingVO.getUserGroupLogoUrl(), mappingVO.getReprsntTelno());

            return userDetails;

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("catch exception =====> loadUserDetail");
        }
    }
}

