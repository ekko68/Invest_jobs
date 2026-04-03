package com.ibk.sb.restapi.app.config.feign;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class FeignBoxKeyConfig {

    public static class NoKeyConfig {
        @Bean
        public RequestInterceptor requestInterceptor() {
            return new BoxBaseFeignInterceptor(null);
        }
    }

//    public static class MnbKeyConfig {
//        @Bean
//        public RequestInterceptor requestInterceptor(@Value("${feign.mnb-api.key}") String mainBoxApiServiceKey) {
//            return new BoxBaseFeignInterceptor(mainBoxApiServiceKey);
//        }
//    }

    public static class IvtKeyConfig {
        @Bean
        public RequestInterceptor requestInterceptor(@Value("${feign.ivt-api.key}") String investBoxApiServiceKey) {
            return new BoxBaseFeignInterceptor(investBoxApiServiceKey);
        }
    }

//    public static class MktKeyConfig {
//        @Bean
//        public RequestInterceptor requestInterceptor(@Value("${feign.mkt-api.key}") String commerceBoxApiServiceKey) {
//            return new BoxBaseFeignInterceptor(commerceBoxApiServiceKey);
//        }
//    }
}
