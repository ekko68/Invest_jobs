package com.ibk.sb.restapi.biz.service.kipris.vo.response;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * <response>
 * <header>
 * <requestMsgID/>
 * <responseTime>2018-04-25 09:00:03.03</responseTime>
 * <responseMsgID/>
 * <successYN>Y</successYN>
 * <resultCode>00</resultCode>
 * <resultMsg>NORMAL SERVICE.</resultMsg>
 * </header>
 * <body>
 * <item>
 * <agentInfoArray/>
 * <applicantInfoArray>
 * <applicantInfo>
 * <applicantAddress>경기도 고양시 일산동구...</applicantAddress>
 * <applicantCode>419980496068</applicantCode>
 * <applicantCountry>대한민국</applicantCountry>
 * <applicantName>안준상</applicantName>
 * </applicantInfo>
 * </applicantInfoArray>
 *
 *
 * <biblioSummaryInfoArray>
 *
 *
 * <biblioInfoArray>
 *
 *
 * <biblioSummaryInfo>
 * <admstStat>소멸</admstStat>
 * <applicationDate>2011.05.31</applicationDate>
 * <applicationNumber>30-2011-0022388</applicationNumber>
 * <articleName>구두용 장식구</articleName>
 * <designBasicSimilarYn>기본디자인</designBasicSimilarYn>
 * <designCount>단독디자인</designCount>
 * <designCountNumber>1</designCountNumber>
 * <designNumber>M01</designNumber>
 * <designPriorityApplicationCountry></designPriorityApplicationCountry>
 * <designPriorityApplicationDate/>
 * <designPriorityApplicationNumber></designPriorityApplicationNumber>
 * <dsScgrtDmndYn>공개디자인</dsScgrtDmndYn>
 * <dsShpClssCd></dsShpClssCd>
 * <imgFg>Y</imgFg>
 * <lastDispositionCode>11251</lastDispositionCode>
 * <lastDispositionDate>2011.11.22</lastDispositionDate>
 * <lastDispositionDescription>등록결정(일반)</lastDispositionDescription>
 * <lastRetroDate>2011.05.31</lastRetroDate>
 * <lastRetroDescription></lastRetroDescription>
 * <lastRetroTpcd></lastRetroTpcd>
 * <openDate></openDate>
 * <openNumber></openNumber>
 * <originalApplicationDate/>
 * <originalApplicationNumber></originalApplicationNumber>
 * <partDesignFg>부분디자인</partDesignFg>
 * <pubFg>Y</pubFg>
 * <publicationDate>2012.01.17</publicationDate>
 * <publicationNumber></publicationNumber>
 * <regFg>Y</regFg>
 * <registrationDate>2012.01.06</registrationDate>
 * <registrationNumber>30-0628776-0000</registrationNumber>
 * <relationApplicationNumber></relationApplicationNumber>
 * <repubFg>N</repubFg>
 * <rgstTpcd>소멸 디자인</rgstTpcd>
 * <rgstTpcdDscr>등록료불납</rgstTpcdDscr>
 * </biblioSummaryInfo>
 *
 *
 * </biblioInfoArray>
 *
 *
 * <classificationCodeInfoArray>
 * <classificationCodeInfo>
 * <classificationCode>B915</classificationCode>
 * </classificationCodeInfo>
 * </classificationCodeInfoArray>
 *
 *
 * <designImageInfoArray>
 * <designImageInfo>
 * <applicationNumber>3020110022388</applicationNumber>
 * <designNumber>M01</designNumber>
 * <imagePath>
 * <imageName>000.jpg</imageName>
 * <largePath>http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=75a63eed5a4389985e80c60c4d1f17763467bb09347d178e58e5b68ce67d31330adbf6df1e1229771a2e8bb0d1e68c8c52f6ddc78c30025b42b8daf35d9e00e6</largePath>
 * <number>0</number>
 * <smallPath>http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=ed43a0609e94d6e29e0b68f68d514bb0bf26c31bed4db0fc76858ed61fdb91f11069ebfb03a1d9bc363821971891aafabf2522f83bb2cbed8ba518d13d6978d7</smallPath>
 * </imagePath>
 * <imagePath>
 * <imageName>000.jpg</imageName>
 * <largePath>
 * http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=75a63eed5a4389985e80c60c4d1f17763467bb09347d178e58e5b68ce67d31330adbf6df1e1229771a2e8bb0d1e68c8c52f6ddc78c30025b42b8daf35d9e00e6
 * </largePath>
 * <number>1</number>
 * <smallPath>
 * http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=ed43a0609e94d6e29e0b68f68d514bb0bf26c31bed4db0fc76858ed61fdb91f11069ebfb03a1d9bc363821971891aafabf2522f83bb2cbed8ba518d13d6978d7
 * </smallPath>
 * </imagePath>
 * </designImageInfo>
 * </designImageInfoArray>
 *
 *
 * <fullTextInfoArray>
 * <fullTextInfo>
 * <applicationNumber>3020110022388</applicationNumber>
 * <designNumber>M01</designNumber>
 * <fullTextFileKindCode>S10221</fullTextFileKindCode>
 * <fullTextFilePath>http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=30a1e03368e0d50d8f05b95fbbd884e45e16bb9c11e9189c26d1d5a20b97a08dac1e246b0cdfccd417327e73d39403377df04aa47c15defc</fullTextFilePath>
 * <pageCount>0</pageCount>
 * </fullTextInfo>
 * </fullTextInfoArray>
 *
 * </biblioSummaryInfoArray>
 *
 *
 * <creativeDescriptionInfoArray>
 * <creativeDescriptionInfo>
 * <designDescription>1. 재질은 금속재 및 유리재임.2. 본원 디자인은 구두의 전면 상부에 부착시켜 구두의 미감을 향상시키기 위한 장식구로 사용하는 것임.</designDescription>
 * <designNumber>M01</designNumber>
 * </creativeDescriptionInfo>
 * </creativeDescriptionInfoArray>
 *
 *
 * <creativeSummaryInfoArray>
 * <creativeSummaryInfo>
 * <designNumber>M01</designNumber>
 * <designSummary>"구두용 장식구"의 형상과 모양의 결합을 디자인 창작 내용의 요점으로 함.</designSummary>
 * </creativeSummaryInfo>
 * </creativeSummaryInfoArray>
 *
 *
 * <inventorInfoArray>
 * <inventorInfo>
 * <designNumber>M01</designNumber>
 * <inventorAddress>경기도 고양시 일산서구...</inventorAddress>
 * <inventorCode>419980496068</inventorCode>
 * <inventorCountry>대한민국</inventorCountry>
 * <inventorName>안준상</inventorName>
 * </inventorInfo>
 * </inventorInfoArray>
 *
 *
 * <legalStatusInfoArray>
 * <legalStatusInfo>
 * <procSTCD>수리</procSTCD>
 * <rsDate>2011.05.31</rsDate>
 * <rsDocumentName>[디자인심사등록출원]디자인등록출원서</rsDocumentName>
 * <rsDocumentNameEng>Application for Design Registration</rsDocumentNameEng>
 * <rsNo>112011041082764</rsNo>
 * </legalStatusInfo>
 * <legalStatusInfo>
 * <procSTCD>수리</procSTCD>
 * <rsDate>2017.08.22</rsDate>
 * <rsDocumentName>출원인정보변경(경정)신고서</rsDocumentName>
 * <rsDocumentNameEng>
 * Report on Change (Correction) of Information of Applicant
 * </rsDocumentNameEng>
 * <rsNo>412017513347097</rsNo>
 * </legalStatusInfo>
 * </legalStatusInfoArray>
 *
 * </item>
 * </body>
 * </response>
 */

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "response")
public class KiprisDesignDetailResponseVO {

    @XmlElement(name = "header")
    private Header header;

    @XmlElement(name = "body")
    private Body body;

    @Getter
    @Setter
    @XmlRootElement(name = "header")
    public static class Header {
        // 결과 코드
        private String resultCode;
        // 결과 메시지
        private String resultMsg;

        private String requestMsgID;
        private String responseTime;
        private String responseMsgID;
        private String successYN;
    }

    @Getter
    @Setter
    @XmlRootElement(name = "body")
    public static class Body {
        private Item item;
    }

    @Getter
    @Setter
    @XmlRootElement(name = "item")
    public static class Item {

        private AgentInfoArray agentInfoArray;

        private BiblioSummaryInfoArray biblioSummaryInfoArray;

        private CreativeSummaryInfoArray creativeSummaryInfoArray;

        private CreativeDescriptionInfoArray creativeDescriptionInfoArray;

        private InventorInfoArray inventorInfoArray;

        private LegalStatusInfoArray legalStatusInfoArray;

        @Getter
        @Setter
        @XmlRootElement(name = "applicantInfoArray")
        public static class AgentInfoArray {

            // 출원인 정보 결과
            List<ApplicantInfo> applicantInfo;

            @Getter
            @Setter
            @XmlRootElement(name = "applicantInfo")
            public static class ApplicantInfo {
                // 출원인 주소
                private String applicantAddress;
                // 특허고객번호
                private String applicantCode;
                // 출원인 국적
                private String applicantCountry;
                // 출원인 이름
                private String applicantName;
            }
        }

        @Getter
        @Setter
        @XmlRootElement(name = "biblioSummaryInfoArray")
        public static class BiblioSummaryInfoArray {

            private BiblioInfoArray biblioInfoArray;

            private ClassificationCodeInfoArray classificationCodeInfoArray;

            private DesignImageInfoArray designImageInfoArray;

            private FullTextInfoArray fullTextInfoArray;


            @Getter
            @Setter
            @XmlRootElement(name = "biblioInfoArray")
            public static class BiblioInfoArray {

                // 서지 요약 기본 결과
                List<BiblioSummaryInfo> biblioSummaryInfo;

                @Getter
                @Setter
                @XmlRootElement(name = "biblioSummaryInfo")
                public static class BiblioSummaryInfo {
                    // 법적 상태
                    private String admstStat;
                    // 출원일자
                    private String applicationDate;
                    // 출원번호
                    private String applicationNumber;
                    // 디자인물품명
                    private String articleName;
                    // 기본유사유무
                    private String designBasicSimilarYn;
                    // 의장의수
                    private String designCount;
                    // 의장의수(숫자)
                    private Integer designCountNumber;
                    // 디자인일련번호
                    private String designNumber;
                    // 디자인 우선권 주장 출원국가코드
                    private String designPriorityApplicationCountry;
                    // 디자인 우선권 주장 출원일자
                    private String designPriorityApplicationDate;
                    // 디자인 우선권 주장 출원번호
                    private String designPriorityApplicationNumber;
                    // 비밀의장여부
                    private String dsScgrtDmndYn;
                    // 디자인형태분류코드
                    private String dsShpClssCd;
                    // 견본이미지유무
                    private String imgFg;
                    // 심사진행상태코드
                    private String lastDispositionCode;
                    // 최종처분일자
                    private String lastDispositionDate;
                    // 등록결정(일반)
                    private String lastDispositionDescription;
                    // 최종소급일자
                    private String lastRetroDate;
                    // 최종소급구분설명
                    private String lastRetroDescription;
                    // 최종소급구분코드
                    private String lastRetroTpcd;
                    // 공개일자
                    private String openDate;
                    // 공개번호
                    private String openNumber;
                    // 원출원일자
                    private String originalApplicationDate;
                    // 원출원번호
                    private String originalApplicationNumber;
                    // 부분의장여부
                    private String partDesignFg;
                    // 공고공보유여부
                    private String pubFg;
                    // 공고일자
                    private String publicationDate;
                    // 공고번호
                    private String publicationNumber;
                    // 등록유무
                    private String regFg;
                    // 등록일자
                    private String registrationDate;
                    // 등록번호
                    private String registrationNumber;
                    // 관련 출원번호
                    private String relationApplicationNumber;
                    // 정정 공보 유무
                    private String repubFg;
                    // 등록 상태
                    private String rgstTpcd;
                    // 등록 상태 설명
                    private String rgstTpcdDscr;
                }
            }

            @Getter
            @Setter
            @XmlRootElement(name = "classificationCodeInfoArray")
            public static class ClassificationCodeInfoArray {

                // 디자인 분류 코드 결과
                List<ClassificationCodeInfo> classificationCodeInfo;

                @Getter
                @Setter
                @XmlRootElement(name = "classificationCodeInfo")
                public static class ClassificationCodeInfo {
                    // 디자인 분류 코드
                    private String classificationCode;
                }
            }

            @Getter
            @Setter
            @XmlRootElement(name = "designImageInfoArray")
            public static class DesignImageInfoArray {

                // 디자인 육면도 정보 결과
                List<DesignImageInfo> designImageInfo;

                @Getter
                @Setter
                @XmlRootElement(name = "designImageInfo")
                public static class DesignImageInfo {

                    // 출원 번호
                    private String applicationNumber;
                    // 디자인 일련번호
                    private String designNumber;
                    // 디자인 이미지
                    private List<ImagePath> imagePath;

                    @Getter
                    @Setter
                    @XmlRootElement(name = "imagePath")
                    public static class ImagePath {
                        // 이미지 번호
                        private String number;
                        // 디자인 이미지 파일 이름
                        private String imageName;
                        // 큰 이미지 경로
                        private String largePath;
                        // 작은 이미지 경로
                        private String smallPath;

                    }
                }
            }

            @Getter
            @Setter
            @XmlRootElement(name = "fullTextInfoArray")
            public static class FullTextInfoArray {

                // 정정 공보에 관한 정보 결과
                List<FullTextInfo> fullTextInfo;

                @Getter
                @Setter
                @XmlRootElement(name = "fullTextInfo")
                public static class FullTextInfo {

                    // 출원번호
                    private String applicationNumber;
                    // 디자인일련번호
                    private String designNumber;
                    // 전문파일 종류코드
                    private String fullTextFileKindCode;
                    // 전문파일 경로
                    private String fullTextFilePath;
                    // 페이지 수
                    private String pageCount;
                }
            }
        }

        @Getter
        @Setter
        @XmlRootElement(name = "creativeSummaryInfoArray")
        public static class CreativeSummaryInfoArray {

            // 창작의 요점 결과
            List<CreativeSummaryInfo> creativeSummaryInfo;

            @Getter
            @Setter
            @XmlRootElement(name = "creativeSummaryInfo")
            public static class CreativeSummaryInfo {
                // 디자인 일련번호
                private String designNumber;
                // 창작의 요점
                private String designSummary;
            }
        }

        @Getter
        @Setter
        @XmlRootElement(name = "creativeDescriptionInfoArray")
        public static class CreativeDescriptionInfoArray {

            // 창작의 내용 결과
            List<CreativeDescriptionInfo> creativeDescriptionInfo;

            @Getter
            @Setter
            @XmlRootElement(name = "creativeDescriptionInfo")
            public static class CreativeDescriptionInfo {
                // 디자인 일련번호
                private String designNumber;
                // 창작의 내용
                private String designDescription;
            }
        }

        @Getter
        @Setter
        @XmlRootElement(name = "inventorInfoArray")
        public static class InventorInfoArray {

            // 창작자 정보 결과
            List<InventorInfo> inventorInfo;

            @Getter
            @Setter
            @XmlRootElement(name = "inventorInfo")
            public static class InventorInfo {
                // 의장번호
                private String designNumber;
                // 창작자 주소
                private String inventorAddress;
                // 창작자 번호
                private String inventorCode;
                // 창작자 국적
                private String inventorCountry;
                // 창작자 이름
                private String inventorName;
            }
        }

        @Getter
        @Setter
        @XmlRootElement(name = "legalStatusInfoArray")
        public static class LegalStatusInfoArray {

            // 행정처리사항 결과
            List<LegalStatusInfo> legalStatusInfo;

            @Getter
            @Setter
            @XmlRootElement(name = "legalStatusInfo")
            public static class LegalStatusInfo {
                // 처리상태코드
                private String procSTCD;
                // 접수발송일자
                private String rsDate;
                // 접수발송서류명
                private String rsDocumentName;
                // 접수발송서류영문명
                private String rsDocumentNameEng;
                // 접수발송번호
                private String rsNo;
            }
        }

    }


}
