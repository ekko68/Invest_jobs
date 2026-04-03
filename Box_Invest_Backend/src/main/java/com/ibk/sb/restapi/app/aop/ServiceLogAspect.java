package com.ibk.sb.restapi.app.aop;

import com.ibk.sb.restapi.app.common.exception.BizException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Service Logging AOP
 */
@Aspect
@Component
public class ServiceLogAspect {

    Logger logger = LoggerFactory.getLogger(this.getClass());


    @Around("(execution(* com.ibk.sb.restapi.biz.service..*.*Service.*(..)) " +
            "|| execution(* com.ibk.sb.restapi.biz.service..*.repo.*Repo.*(..)) " +
            "|| execution(* com.ibk.sb.restapi.biz.service..*.feign.*Feign.*(..))) " +
            "&& !@annotation(com.ibk.sb.restapi.app.annotation.SkipCheckAspect)")
    public Object serviceLogAspect(ProceedingJoinPoint joinPoint) throws Throwable {

        // process return 값
        Object processResult = null;

        // 동작 서비스, 매퍼 클래스 이름
        String serviceName = joinPoint.getSignature().getDeclaringTypeName();

        // 동작 서비스, 매퍼 메서드 이름
        String methodName = ((MethodSignature)joinPoint.getSignature()).getMethod().getName();

        if(serviceName.contains("Service")) { // @Service 로그 처리

            try {
                // 서비스 시작 로깅
                logger.info("[Service : {}.{}] started.", serviceName, methodName);

                processResult = joinPoint.proceed();

                logger.info("[Service : {}.{}] completed.", serviceName, methodName);

            } catch (BizException bx) {
                logger.error("[Service : {}.{}] business exception is occurred. (code : {}) : {}",
                        serviceName, methodName, bx.getErrorCode(), bx.getErrorMsg());

                throw bx;

            } catch (Exception e) {
                logger.error("[Service : {}.{}] exception is occurred. ======> throw to controller.", serviceName, methodName);
                throw e;
            } catch (Throwable t) {
                logger.error("[Service : {}.{}] error is occurred. ======> {}", serviceName, methodName, t.getMessage());
            } finally {
                logger.info("[Service : {}.{}] ended.", serviceName, methodName);
            }

        } else if(serviceName.contains("Repo")) { // @Mapper 로그 처리

            try {
                logger.info("[Mapper : {}.{}] started.", serviceName, methodName);

                processResult = joinPoint.proceed();

            } catch (Exception e) {
                logger.error("[Mapper : {}.{}] exception is occurred. ======> throw to service.", serviceName, methodName);
                throw e;
            } catch (Throwable t) {
                logger.error("[Mapper : {}.{}] error is occurred. ======> {}", serviceName, methodName, t.getMessage());
            } finally {
                logger.info("[Mapper : {}.{}] ended", serviceName, methodName);
            }

        } else if(serviceName.contains("Feign")) { // @FeignClient 로그 처리

            try {
                logger.info("[FeignClient : {}.{}] started.", serviceName, methodName);

                processResult = joinPoint.proceed();

            } catch (Exception e) {
                logger.error("[FeignClient : {}.{}] exception is occurred. ======> throw to service.", serviceName, methodName);
                throw e;
            } catch (Throwable t) {
                logger.error("[FeignClient : {}.{}] error is occurred. ======> {}", serviceName, methodName, t.getMessage());
            } finally {
                logger.info("[FeignClient : {}.{}] ended", serviceName, methodName);
            }

        }

        return processResult;
    }

}
