package com.ibk.sb.restapi.app.config;

import com.ibk.sb.restapi.app.common.jwt.JwtAuthenticationEntryPoint;
import com.ibk.sb.restapi.app.common.login.LoginRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final LoginRequestFilter loginRequestFilter;

    @Value("${spring.profile.active:}")
    private String activeProfile;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Profile({"dev", "stage"})
    class SecurityConfigDev extends WebSecurityConfigurerAdapter {

        /**
         * cors 설정
         * */
        @Bean
        public CorsConfigurationSource devCorsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();

            if(activeProfile.equals("dev")) {
                configuration.addAllowedOriginPattern("http://localhost");
                configuration.addAllowedOriginPattern("https://localhost");
            }

            configuration.addAllowedOriginPattern("http://*.ibkbox.net");
            configuration.addAllowedOriginPattern("https://*.ibkbox.net");

            configuration.addAllowedMethod("*");
            configuration.addAllowedHeader("*");
            configuration.setAllowCredentials(true);
            configuration.addExposedHeader("Content-Disposition");
            configuration.setMaxAge(3600L);

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);

            return source;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {

            // authorizeRequest set
            // 총괄관리자 확인은 현재 프론트에서 처리하고 있음
            // -> todo 권한 확인이 api에서도 필요할 경우 해당 api 경로에 hasAuthority 체크를 할것
            http.authorizeRequests()
                    .requestMatchers(CorsUtils::isPreFlightRequest).permitAll() //preflight 인증 무시
                    .antMatchers(HttpMethod.GET, "/upload/**").permitAll()

                    .antMatchers(HttpMethod.GET, "/api/iv/v1/login").authenticated() // 로그인 정보 조회
                    .antMatchers(HttpMethod.GET, "/api/login").authenticated()

//                    .antMatchers("/api/iv/v1/file/upload/**").authenticated() // 파일 업로드, 다운로드 api 인증 확인
//                    .antMatchers("/api/file/upload/**").authenticated()
//                    .antMatchers("/api/iv/v1/file/download/**").authenticated()
//                    .antMatchers("/api/file/download/**").authenticated()

                    .antMatchers("/api/iv/v1/main/company/favorite/save").authenticated() // 즐겨찾기 수정 api 인증 확인
                    .antMatchers("/api/main/company/favorite/save").authenticated()

                    .antMatchers("/api/iv/v1/company/audit/**").authenticated() // 기업화면 투자심사신청 관련 api 인증 확인
                    .antMatchers("/api/company/audit/**").authenticated()

                    .antMatchers("/api/iv/v1/company/business/ask").authenticated() // 기업화면 사업문의 api 인증 확인
                    .antMatchers("/api/company/business/ask").authenticated()

//                    .antMatchers("/api/iv/v1/vc/audit/**").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode()) // 투자사화면 투자심사신청 관련 api 인증 확인
//                    .antMatchers("/api/vc/audit/**").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode())
                    .antMatchers("/api/iv/v1/vc/audit/**").authenticated() // 투자사화면 투자심사신청 관련 api 인증 확인
                    .antMatchers("/api/vc/audit/**").authenticated()

//                    .antMatchers("/api/iv/v1/consulting/save").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode()) // 컨설팅 의뢰 api 인증 확인
//                    .antMatchers("/api/consulting/save").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode())
                    .antMatchers("/api/iv/v1/consulting/save").authenticated() // 컨설팅 의뢰 api 인증 확인
                    .antMatchers("/api/consulting/save").authenticated()

//                    .antMatchers("/api/iv/v1/my/**").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode()) // 마이페이지 api 인증 확인
//                    .antMatchers("/api/my/**").hasAuthority(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode())
                    .antMatchers("/api/iv/v1/my/**").authenticated() // 마이페이지 api 인증 확인
                    .antMatchers("/api/my/**").authenticated()

                    /** 대출에서 호출하는 api/iv/v1/doc/nda/eform/contract/upload, api/iv/v1/doc/seal/infotech/cert 의 경우 permitAll 해야함(주의)
                     *  boxOpenApi로 통신시 현재 헤더가 제한되는지 Authorization 헤더를 사용하지 못하므로
                     *  토큰을 post requestbody에 넣고 컨트롤러 or 서비스에서 userDetail을 생성
                     */

                    .antMatchers("/**").permitAll();

            // cors and csrf set
            http.cors().configurationSource(devCorsConfigurationSource())
                    .and()
                    .csrf().disable();

            // 토큰이 존재하지 않을 때,
            http.exceptionHandling()
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint);

            // 투자박스 프론트에서 e-form iframe 호출처리를 위함
            // X-FRAME-OPTION : ALLOW-FROM의 경우 현 버전 브라우저 정책상 지양 or 안됨
            http.headers().frameOptions().disable()
                    .addHeaderWriter(
                            new StaticHeadersWriter(
                                    "Content-Security-Policy",
                                    "frame-ancestors https://devinvest.ibkbox.net:8001 https://devinvest.ibkbox.net"
                            )
                    );


            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

            // 스프링부트 자체 내부 필터보다 jwtRequestFilter를 우선 적용
//            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            http.addFilterBefore(loginRequestFilter, UsernamePasswordAuthenticationFilter.class);
        }
    }

    @Profile("prod")
    class SecurityConfigProd extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {

            //authorizeRequest set
            http.authorizeRequests()
                    .requestMatchers(CorsUtils::isPreFlightRequest).permitAll() //preflight 인증 무시
                    .antMatchers(HttpMethod.GET, "/upload/**").permitAll()

                    .antMatchers(HttpMethod.GET, "/api/iv/v1/login").authenticated() // 로그인 정보 조회
                    .antMatchers(HttpMethod.GET, "/api/login").authenticated()

//                    .antMatchers("/api/iv/v1/file/upload/**").authenticated() // 파일 업로드, 다운로드 api 인증 확인
//                    .antMatchers("/api/file/upload/**").authenticated()
//                    .antMatchers("/api/iv/v1/file/download/**").authenticated()
//                    .antMatchers("/api/file/download/**").authenticated()

                    .antMatchers("/api/iv/v1/main/company/favorite/save").authenticated() // 즐겨찾기 수정 api 인증 확인
                    .antMatchers("/api/main/company/favorite/save").authenticated()

                    .antMatchers("/api/iv/v1/company/audit/**").authenticated() // 기업화면 투자심사신청 관련 api 인증 확인
                    .antMatchers("/api/company/audit/**").authenticated()

                    .antMatchers("/api/iv/v1/company/business/ask").authenticated() // 기업화면 사업문의 api 인증 확인
                    .antMatchers("/api/company/business/ask").authenticated()

                    .antMatchers("/api/iv/v1/vc/audit/**").authenticated() // 투자사화면 투자심사신청 관련 api 인증 확인
                    .antMatchers("/api/vc/audit/**").authenticated()

                    .antMatchers("/api/iv/v1/consulting/save").authenticated() // 컨설팅 의뢰 api 인증 확인
                    .antMatchers("/api/consulting/save").authenticated() // 컨설팅 의뢰 api 인증 확인

                    .antMatchers("/api/iv/v1/my/**").authenticated() // 마이페이지 api 인증 확인
//                    .antMatchers("/api/iv/v1/my/**").hasAuthority("C") // 마이페이지 api 인증 확인
                    .antMatchers("/api/my/**").authenticated()
//                    .antMatchers("/api/my/**").hasAuthority("C")

                    .antMatchers("/**").permitAll();

            // cors and csrf set
            http.cors().configurationSource(prodCorsConfigurationSource())
                    .and()
                    .csrf().disable();

            // X-FRAME-OPTION : ALLOW-FROM의 경우 현 버전 브라우저 정책상 지양 or 안됨
            http.headers().frameOptions().disable()
                    .addHeaderWriter(
                            new StaticHeadersWriter(
                                    "Content-Security-Policy",
                                    "frame-ancestors https://invest.ibkbox.net"
                            )
                    );

            // 토큰이 존재하지 않을 때,
            http.exceptionHandling()
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint);

            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

            // 스프링부트 자체 내부 필터보다 jwtRequestFilter를 우선 적용
//            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            http.addFilterBefore(loginRequestFilter, UsernamePasswordAuthenticationFilter.class);
        }

        /**
         * cors 설정
         * */
        @Bean
        public CorsConfigurationSource prodCorsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();

            configuration.addAllowedOriginPattern("http://*.ibkbox.net");
            configuration.addAllowedOriginPattern("https://*.ibkbox.net");

            configuration.addAllowedMethod("*");
            configuration.addAllowedHeader("*");
            configuration.setAllowCredentials(true);
            configuration.addExposedHeader("Content-Disposition");
            configuration.setMaxAge(3600L);
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }
    }
}
