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
 * <responseTime>2020-12-31 13:14:50.1450</responseTime>
 * <responseMsgID/>
 * <successYN>Y</successYN>
 * <resultCode>00</resultCode>
 * <resultMsg>NORMAL SERVICE.</resultMsg>
 * </header>
 * <body>
 * <items>
 *
 * <item>
 * <agentName>김영철</agentName>
 * <appReferenceNumber/>
 * <applicantName>(주)아모레퍼시픽</applicantName>
 * <applicationDate>20200508</applicationDate>
 * <applicationNumber>4020200076028</applicationNumber>
 * <applicationStatus>출원</applicationStatus>
 * <bigDrawing>http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=ad7a17eeeef6e4ea4b5e22ef00dd3e29df616987ef7331e90996dde5f848fea12beba5ce00ae38b56236b16fd1715187bcc1442c9b4ee9d0</bigDrawing>
 * <classificationCode>03</classificationCode>
 * <drawing>http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=ed43a0609e94d6e251697a9d72a91344f20ce8245b099a8af448e3e4ed57d1eb105a77553dff22eb34f1492ca9c37a9e06f72ab8067b0a40</drawing>
 * <fullText>N</fullText>
 * <indexNo>19</indexNo>
 * <internationalRegisterDate/>
 * <internationalRegisterNumber/>
 * <priorityDate/>
 * <priorityNumber/>
 * <publicationDate/>
 * <publicationNumber/>
 * <regPrivilegeName/>
 * <regReferenceNumber/>
 * <registrationDate/>
 * <registrationNumber/>
 * <registrationPublicDate/>
 * <registrationPublicNumber/>
 * <title>PEREWAY</title>
 * <viennaCode/>
 * </item>

 * </items>
 * </body>
 * <count>
 * <numOfRows>20</numOfRows>
 * <pageNo>1</pageNo>
 * <totalCount>33427</totalCount>
 * </count>
 * </response>
 */

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "response")
public class KiprisTradeMarkResponseVO {

    @XmlElement(name = "header")
    private Header header;

    @XmlElement(name = "body")
    private Body body;

    @XmlElement(name = "count")
    private Count count;

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
        private Items items;
    }

    @Getter
    @Setter
    @XmlRootElement(name = "count")
    public static class Count {
        // record
        private Integer numOfRows;
        // page
        private Integer pageNo;
        // totalCnt;
        private Integer totalCount;
    }

    @Getter
    @Setter
    @XmlRootElement(name = "items")
    public static class Items {

        private List<Item> item;

        @Getter
        @Setter
        @XmlRootElement(name = "item")
        public static class Item {

            // 일련번호
            private String indexNo;
            // 출원인 이름
            private String applicantName;
            // 출원일자
            private String applicationDate;
            // 출원번호
            private String applicationNumber;
            // 출원상태
            private String applicationStatus;
            // 등록일자
            private String registrationDate;
            // 등록번호
            private String registrationNumber;

            // 제목
            private String title;
            // 도형코드(비엔나)
            private String viennaCode;
            // 전문존재유무
            private String fullText;

            // 큰 이미지 경로
            private String bigDrawing;
            // 이미지 경로
            private String drawing;

            // 대리인 이름
            private String agentName;
            // 출원참조번호
            private String appReferenceNumber;

            // 우선권 주장일자
            private String priorityDate;
            // 우선권 주장번호
            private String priorityNumber;
            // 출원공고일자
            private String publicationDate;
            // 출원공고번호
            private String publicationNumber;
            // 등록권자(RG) 번호
            private String regPrivilegeName;
            // 등록참조번호
            private String regReferenceNumber;
            // 등록공고일자
            private String registrationPublicDate;
            // 등록공고번호
            private String registrationPublicNumber;

            private String classificationCode;
            private String internationalRegisterDate;
            private String internationalRegisterNumber;
        }
    }
}
