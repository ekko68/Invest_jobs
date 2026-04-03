package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.annotation.SkipCheckAspect;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Slf4j
@Controller
public class CustomErrorController implements ErrorController {

    /**
     *  로컬이 아닌 개발, 운영에서 서버 설정으로
     *  정적 리소스 영역의 에러페이지가 아닌 에러 jsp로 바로 빠지므로
     *  Controller로 매핑을 잡음
     */

    @SkipCheckAspect
    @GetMapping("/error")
    public String handleError(HttpServletRequest request) {

        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if(status != null) {
            log.error("Server Error StatusCode : {}", status);
            int statusCode = Integer.valueOf(status.toString());
            if(statusCode == HttpStatus.NOT_FOUND.value()) return "404";
            if(statusCode == HttpStatus.FORBIDDEN.value()) return "404";
        } else {
            log.error("Server Extra Error");
        }
        return "error";
    }
}
