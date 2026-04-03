package com.ibk.sb.restapi.app.config.httpentity;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * BOX간 file 전송시 FeignClient에서 에러가 발생할 경우
 * RestTemplate 사용
 */

public class RestTemplateConfig {

    private static final RestTemplate REST_TEMPLATE;

    static {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(3000);
        factory.setBufferRequestBody(false);

        REST_TEMPLATE = new RestTemplate(factory);
    }

    public static RestTemplate getRestTemplate() {
        return REST_TEMPLATE;
    }
}
