package com.ibk.sb.restapi.app.aop;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.interceptor.*;

import java.util.Collections;
import java.util.HashMap;

@Slf4j
@Aspect
@Configuration
@RequiredArgsConstructor
public class TxAspect {

    /** 트랜잭션 AOP 처리시 사용 **/

    private final PlatformTransactionManager transactionManager;

    // 포인트컷 : 모든 서비스의 메서드
    private static final String EXPRESSION = "execution(* com.ibk.sb.restapi.biz.service..*.*Service.*(..)) && !@annotation(com.ibk.sb.restapi.app.annotation.SkipCheckTxAspect)";

    @Bean
    public TransactionInterceptor transactionAdvice() { // Tx 구현 객체

        log.debug("transactionAdvice()");

        TransactionInterceptor txAdvice = new TransactionInterceptor();
        RuleBasedTransactionAttribute txAttribute = new RuleBasedTransactionAttribute(); // Tx 속성 규칙 정의
        NameMatchTransactionAttributeSource txAttributeSource = new NameMatchTransactionAttributeSource(); // 이름으로 Tx 속성을 일치시키기 위한 구현

        /** Tx 속성 규칙 정의 **/
        // 롤백 규칙 : Exception에 대해 롤백처리 (기존 디폴트 옵션 : RuntimeException, Error 등 Unchecked 영역)
        txAttribute.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
        // @Transactional 디폴트 전파속성 (Tx 존재 시 그 상황에서 실행 없으면 새 Tx 실행)
        txAttribute.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

        /** Tx 속성 적용 **/
        HashMap<String, TransactionAttribute> txMethods = new HashMap<>();
        txMethods.put("*", txAttribute);
        txAttributeSource.setNameMap(txMethods);

        // Tx 인터셉터 세팅
        txAdvice.setTransactionAttributeSource(txAttributeSource);
        txAdvice.setTransactionManager(transactionManager);

        return txAdvice;
    }

    @Bean
    public Advisor transactionAdvisor() { // 포인트컷(서비스)에 Tx Advice 적용

        log.debug("transactionAdvisor()");

        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression(EXPRESSION); // 포인트컷 : 모든 서비스 빈의 메서드

        return new DefaultPointcutAdvisor(pointcut, transactionAdvice());
    }

}
