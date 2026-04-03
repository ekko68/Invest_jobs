package com.ibk.sb.restapi.app.common.util;

import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;

public class HttpServletRequestUtil {


    /**
     * 클라이언트의 브라우저 정보 검색
     * @param request
     * @return
     */
    public static String getBrowserinfo(HttpServletRequest request) {

        String browserInfo = request.getHeader("User-Agent");

        if (browserInfo != null) {
            if (browserInfo.indexOf("Trident") > -1) {
                return "MSIE";
            } else if (browserInfo.indexOf("Chrome") > -1) {
                return "Chrome";
            } else if (browserInfo.indexOf("Opera") > -1) {
                return "Opera";
            } else if (browserInfo.indexOf("iPhone") > -1
                    && browserInfo.indexOf("Mobile") > -1) {
                return "iPhone";
            } else if (browserInfo.indexOf("Android") > -1
                    && browserInfo.indexOf("Mobile") > -1) {
                return "Android";
            }
        }

        return null;
    }

    /**
     * 클라이언트의 Ip Address 검색
     * @param request
     * @return
     */
//    public static String getIpAddress(HttpServletRequest request) {
//
//        String clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
//        String ip = request.getHeader("X-FORWARDED-FOR");
//        if (ip == null)
//            ip = request.getRemoteAddr();
//
//        return ip;
//    }

    /**
     * 클라이언트의 Ip Address 검색
     * @param request
     * @return
     */
    public static String getClientIP(HttpServletRequest request) {

        // HTTP 프록시나 로드밸런서를 통해 웹서버 접속하는 클라이언트 원IP 식별 표준 해더
        String ip = request.getHeader("X-Forwarded-For");

        if (!StringUtils.hasLength(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (!StringUtils.hasLength(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (!StringUtils.hasLength(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (!StringUtils.hasLength(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (!StringUtils.hasLength(ip)) {
            ip = request.getRemoteAddr();
        }

        return ip;
    }


}
