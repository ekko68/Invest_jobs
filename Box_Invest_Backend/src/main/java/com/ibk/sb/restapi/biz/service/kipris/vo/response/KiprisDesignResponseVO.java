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
 * <requestMsgID></requestMsgID>
 * <responseTime>2014-10-31 10:44:10.4410</responseTime>
 * <responseMsgID></responseMsgID>
 * <successYN></successYN>
 * <resultCode>00</resultCode>
 * <resultMsg>NORMAL SERVICE.</resultMsg></header>
 * <body>
 * <items>
 * <item>
 * <agentName>박종욱</agentName>
 * <applicantName>김민수</applicantName>
 * <applicationDate>20130814</applicationDate>
 * <applicationNumber>3020130041948</applicationNumber>
 * <applicationStatus>등록</applicationStatus>
 * <articleName>직물지</articleName>
 * <designMainClassification>M1110</designMainClassification>
 * <dsShpClssCd>M1110</dsShpClssCd>
 * <fullText>Y</fullText>
 * <inventorName></inventorName>
 * <number>1</number>
 * <openDate></openDate>
 * <openNumber></openNumber>
 * <priorityDate></priorityDate>
 * <priorityNumber></priorityNumber>
 * <publicationDate>20131205</publicationDate>
 * <publicationNumber></publicationNumber>
 * <registrationDate>20131126</registrationDate>
 * <registrationNumber>3007186540000</registrationNumber>
 * </item>
 * </items>
 * </body>
 * <count><numOfRows>10</numOfRows>
 * <pageNo>1</pageNo>
 * <totalCount>71</totalCount></count>
 * </response>
 */

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "response")
public class KiprisDesignResponseVO {

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

            // 번호
            private String number;
            // 출원인이름
            private String applicantName;
            // 출원날자
            private String applicationDate;
            // 출원번호
            private String applicationNumber;
            // 출원상태
            private String applicationStatus;
            // 등록일자
            private String registrationDate;
            // 등록번호
            private String registrationNumber;

            // 물품명칭
            private String articleName;
            // 디자인분류
            private String designMainClassification;
            // 형태분류
            private String dsShpClssCd;
            // 전문존재유무
            private String fullText;

            // 대리인 이름
            private String agentName;
            // 창작자명
            private String inventorName;
            // 공개일자
            private String openDate;
            // 공개번호
            private String openNumber;
            // 우선권 주장일자
            private String priorityDate;
            // 우선권 주장번호
            private String priorityNumber;
            // 공고일자
            private String publicationDate;
            // 공고번호
            private String publicationNumber;
        }
    }


}
