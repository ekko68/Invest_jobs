package com.ibk.sb.restapi.biz.service.kipris.vo.response;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * 출원번호 Response VO
 *
 * API URL : https://plus.kipris.or.kr/portal/data/service/DBII_000000000000247/view.do?menuNo=200100&kppBCode=&kppMCode=&kppSCode=&subTab=SC001&entYn=N&clasKeyword=#soap_ADI_0000000000010076
 *
 * RequestParam : BusinessRegistrationNumber
 *
 * 출력 예시 :
 *
 * <response>
 *     <header>
 *         <resultCode></resultCode>
 *         <resultMsg></resultMsg>
 *     </header>
 *     <body>
 *         <items>
 *             <corpBsApplicantInfo>
 *                 <ApplicantNumber>119980018012</ApplicantNumber>
 *                 <ApplicantName>삼성카드 주식회사</ApplicantName>
 *                 <CorporationNumber>110111-0346901</CorporationNumber>
 *                 <BusinessRegistrationNumber>202-81-45602</BusinessRegistrationNumber>
 *             </corpBsApplicantInfo>
 *         </items>
 *     </body>
 * </response>
 */

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "response")
public class KiprisApplicantResponseVO {

    @XmlElement(name = "header")
    private Header header;

    @XmlElement(name = "body")
    private Body body;

    @Getter
    @Setter
    @XmlRootElement(name = "header")
    private static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Getter
    @Setter
    @XmlRootElement(name = "body")
    public static class Body {
        private Items items;
    }

    /**
     * 출원'인'번호 리스트
     */
    @Getter
    @Setter
    @XmlRootElement(name = "items")
    public static class Items {
        private List<CorpBsApplicantInfo> corpBsApplicantInfo;

        @Getter
        @Setter
        @XmlRootElement(name = "corpBsApplicantInfo")
        public static class CorpBsApplicantInfo {

            // 출원인번호
            private String applicantNumber;

            // 출원인명
            private String applicantName;

            // 법인번호
            private String corporationNumber;

            // 사업자등록번호
            private String businessRegistrationNumber;

            /*
            해당 필드들의 첫문자가 대문자로 되어 있어
            따로 클래스를 만들지 않고 @XmlID를 통해 각 String 변수에 매핑시킴
             */
            @XmlID
            @XmlElement(name = "ApplicantNumber")
            public String getApplicantNumber() {
                return applicantNumber;
            };

            @XmlID
            @XmlElement(name = "ApplicantName")
            public String getApplicantName() {
                return applicantName;
            };

            @XmlID
            @XmlElement(name = "CorporationNumber")
            public String getCorporationNumber() {
                return corporationNumber;
            };

            @XmlID
            @XmlElement(name = "BusinessRegistrationNumber")
            public String getBusinessRegistrationNumber() {
                return businessRegistrationNumber;
            };



        }
    }

}
