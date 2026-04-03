package com.ibk.sb.restapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev") // default test profile을 dev로 잡음 -> prod, stage는 WAS의 datasource 설정을 JNDI로 잡아옴
class IbkBoxInvestApiApplicationTests {

    @Test
    void contextLoads() {
    }

}
