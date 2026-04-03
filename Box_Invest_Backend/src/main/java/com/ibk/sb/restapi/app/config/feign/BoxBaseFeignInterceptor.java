package com.ibk.sb.restapi.app.config.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.Map;

public final class BoxBaseFeignInterceptor implements RequestInterceptor {

    private final String appKey;

    BoxBaseFeignInterceptor(String appKey) {
        this.appKey = appKey;
    }

    @Override
    public void apply(RequestTemplate template) {
        template.header("Content-Type", "application/json; charset=utf-8");
        template.header("Media-Type", "application/json; charset=utf-8");

        // appKey 우선순위
        // 1. feignClient interface 메서드에서 설정된 header appKey가 있을경우
        // 2. 해당 interceptor class 사용시 생성자 주입으로 설정된 appKey
        Map<String, Collection<String>> headerMap = template.headers();
        if(!(headerMap != null && headerMap.containsKey("appKey"))) {
            if(StringUtils.hasLength(appKey)) template.header("appKey", appKey);
        }
    }
}
