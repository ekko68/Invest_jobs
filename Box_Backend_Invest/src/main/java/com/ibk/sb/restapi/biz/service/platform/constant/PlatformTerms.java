package com.ibk.sb.restapi.biz.service.platform.constant;

import com.ibk.sb.restapi.app.annotation.PropertyComponent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;

@PropertyComponent
public class PlatformTerms {

    @AllArgsConstructor
    public enum PlatformTermsEnum {

        PERSONAL_INFO("BOX 개인정보 처리방침", "BOX 개인정보 처리방침"),
        BOX_SERVICE("BOX 서비스별 개인정보 제공", "BOX 서비스별 개인정보 제공"),

        AUTO_SCP_COLLECT("IBK BOX 고객정보 자동 수집 서비스", "(필수) 개인(신용)정보 수집, 이용, 제공 동의"),
        AUTO_SCP_TRADE_VIEW("IBK BOX 고객정보 자동 수집 서비스", "(필수) 거래정보 조회 위임 동의"),
        AUTO_SCP_COLLECT_CHOICE("IBK BOX 고객정보 자동 수집 서비스", "(선택) 개인(신용)정보 수집, 이용, 제공 동의");

        @Getter
        private final String manageNm;
        @Getter
        private final String detailFileNm;

        /**
         * 생성자에 직접적으로 넣는 경우, 파일 위치 및 최초 호출 시점에 따라
         * static 영역에 메모리 로드 시점이 꼬일 수 있으므로
         * get 메서드를 이용
         */
        public String getTermsId() {
            switch (this) {
                case PERSONAL_INFO:
                    return PlatformTerms.personalInfoTermsId;
                case BOX_SERVICE:
                    return PlatformTerms.boxServiceTermsId;
                case AUTO_SCP_COLLECT:
                    return PlatformTerms.autoScpCollectTermsId;
                case AUTO_SCP_TRADE_VIEW:
                    return PlatformTerms.autoScpTradeViewTermsId;
                case AUTO_SCP_COLLECT_CHOICE:
                    return PlatformTerms.autoScpCollectChoiceTermsId;
                default:
                    return null;
            }
        }
    }

    private static String personalInfoTermsId;  // BOX 개인정보 처리
    private static String boxServiceTermsId;    // BOX 서비스 개인정보 제공

    // 고객정보 자동수집 (스크래핑) 관련 약관
    private static String autoScpCollectTermsId;    // BOX 고객정보 자동수집 (개인정보 수집 동의 - 필수)
    private static String autoScpTradeViewTermsId;    // BOX 고객정보 자동수집 (거래정보 조회 동의)
    private static String autoScpCollectChoiceTermsId;  // BOX 고객정보 자동수집 (개인정보 수집 동의 - 선택)

    @Value("${adp.terms.personal-info.id}")
    public void setPersonalInfoTermsId(String termsId) { PlatformTerms.personalInfoTermsId = termsId; }
    @Value("${adp.terms.box-service.id}")
    public void setBoxServiceTermsId(String termsId) { PlatformTerms.boxServiceTermsId = termsId; }
    @Value("${adp.terms.auto-scp-collect.id}")
    public void setAutoScpCollectTermsId(String termsId) { PlatformTerms.autoScpCollectTermsId = termsId; }
    @Value("${adp.terms.auto-scp-trade-view.id}")
    public void setAutoScpTradeViewTermsId(String termsId) { PlatformTerms.autoScpTradeViewTermsId = termsId; }
    @Value("${adp.terms.auto-scp-collect-choice.id}")
    public void setAutoScpCollectChoiceTermsId(String termsId) { PlatformTerms.autoScpCollectChoiceTermsId = termsId; }

}
