package com.ibk.sb.restapi.app.aop;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ControllerLogAspect {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Around("execution(* com.ibk.sb.restapi.biz.api..*.*Controller.*(..)) " +
            "&& !@annotation(com.ibk.sb.restapi.app.annotation.SkipCheckAspect)")
    public ResponseData controllerLogAspect(ProceedingJoinPoint joinPoint) {

        // process return 값
        Object processResult = null;

        // 동작 서비스, 매퍼 클래스 이름
        String controllerName = joinPoint.getSignature().getDeclaringTypeName();

        // 동작 서비스, 매퍼 메서드 이름
        String methodName = ((MethodSignature)joinPoint.getSignature()).getMethod().getName();

        try {
            // 컨트롤러 시작
            logger.info("[Controller : {}.{}] started.", controllerName, methodName);

            processResult = joinPoint.proceed();

            return (ResponseData) processResult;

        } catch (BizException bx) {
            logger.error("Fail Business Exception Trace : ", bx);
            
            // TODO : 로그 트레이스 방식 협의
//            logger.error("Fail Business Exception Trace : ", bx.getErrorMsg());
//            for(StackTraceElement trace : bx.getStackTrace()) {
//                if(trace.getClassName().indexOf("com.ibk.sb.restapi") != -1) {
//                    logger.error("[{}.{}] : line = {}", trace.getClassName(), trace.getMethodName(), trace.getLineNumber());
//                }
//            }

            return ResponseData.builder()
                    .code(bx.getErrorCode())
                    .message(bx.getErrorMsg())
                    .build();

        } catch (Exception e) {
            logger.error("Fail Exception Trace : ", e);
            return ResponseData.builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(StatusCode.COM0000.getMessage())
                    .build();

        } catch (Throwable t) {
            logger.error("Fail Trace : ", t);
            return ResponseData.builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(StatusCode.COM0000.getMessage())
                    .build();

        } finally {
            logger.info("[Controller : {}.{}] ended.", controllerName, methodName);
        }
    }

}
