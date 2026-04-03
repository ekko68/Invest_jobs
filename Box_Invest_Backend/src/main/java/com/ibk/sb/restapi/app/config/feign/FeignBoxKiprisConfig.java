package com.ibk.sb.restapi.app.config.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@Slf4j
public class FeignBoxKiprisConfig {

    @Bean
    public RequestInterceptor requestInterceptor(
            @Value("${feign.kipris-api.key}") String kiprisServiceKey,
            @Value("${feign.ivt-api.key}") String investBoxApiServiceKey
    ) {
        return new BoxKiprisFeignInterceptor(kiprisServiceKey, investBoxApiServiceKey);
    }

    /**
     * Feign 개별 Interceptor override
     */
    public final class BoxKiprisFeignInterceptor implements RequestInterceptor {

        private String kiprisServiceKey;
        private String ibkBoxAppKey;

        BoxKiprisFeignInterceptor(String kiprisServiceKey, String ibkBoxAppKey) {
            this.kiprisServiceKey = kiprisServiceKey;
            this.ibkBoxAppKey = ibkBoxAppKey;
        }

        @Override
        public void apply(RequestTemplate template) {

            // Box Platform 헤더 정보 세팅
            template.header("Content-Type", "application/json; charset=utf-8");
            template.header("Media-Type", "application/json; charset=utf-8");
            template.header("appKey", ibkBoxAppKey);

            // 서비스키 세팅 (출원인 정보 조회의 경우에는 파라미터명이 다름)
            if(template.path().equals("/openapi/rest/CorpBsApplicantService/corpBsApplicantInfoV3")) {
                template.query("accessKey", kiprisServiceKey);
            } else {
                template.query("ServiceKey", kiprisServiceKey);
            }

            // 상표 조회의 경우 세팅할 디폴트 파라미터 세팅
            if(template.path().equals("/kipo-api/kipi/trademarkInfoSearchService/getAdvancedSearch")) {
                template = setDefaultQuery(template, "TRADEMARK");
            }

            // 디자인 조회 경우 세팅할 디폴트 파라미터 세팅
            else if(template.path().equals("/kipo-api/kipi/designInfoSearchService/getAdvancedSearch")) {
                template = setDefaultQuery(template, "DESIGN");
            }
        }

        /**
         * KIPRIS 디폴트 쿼리 파라매터 세팅
         * @param template
         * @param type
         * @return
         */
        public RequestTemplate setDefaultQuery(RequestTemplate template, String type) {
            
            switch (type) {
                case "TRADEMARK":
                    template.query("application", "true");
                    template.query("registration", "true");
                    template.query("refused", "true");
                    template.query("expiration", "true");
                    template.query("withdrawal", "true");
                    template.query("publication", "true");
                    template.query("cancel", "true");
                    template.query("abandonment", "true");
                    template.query("trademark", "true");
                    template.query("serviceMark", "true");
                    template.query("businessEmblem", "true");
                    template.query("collectiveMark", "true");
                    template.query("geoOrgMark", "true");
                    template.query("trademarkServiceMark", "true");
                    template.query("certMark", "true");
                    template.query("geoCertMark", "true");
                    template.query("internationalMark", "true");
                    template.query("character", "true");
                    template.query("figure", "true");
                    template.query("compositionCharacter", "true");
                    template.query("figureComposition", "true");
                    template.query("fragrance", "true");
                    template.query("sound", "true");
                    template.query("color", "true");
                    template.query("colorMixed", "true");
                    template.query("dimension", "true");
                    template.query("hologram", "true");
                    template.query("invisible", "true");
                    template.query("motion", "true");
                    template.query("visual", "true");

                case "DESIGN":
                    template.query("etc", "true");
                    template.query("part", "true");
                    template.query("simi", "true");
                    template.query("open", "true");
                    template.query("rejection", "true");
                    template.query("rejection", "true");
                    template.query("destroy", "true");
                    template.query("cancle", "true");
                    template.query("notice", "true");
                    template.query("registration", "true");
                    template.query("invalid", "true");
                    template.query("abandonment", "true");
            }
            
            return template;
        }
    }
}
