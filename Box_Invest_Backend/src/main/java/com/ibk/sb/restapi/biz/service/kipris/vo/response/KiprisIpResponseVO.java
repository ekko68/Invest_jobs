package com.ibk.sb.restapi.biz.service.kipris.vo.response;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * 특허·실용 공개·등록공보
 *
 * 항목별검색 -> 전체검색
 *
 *
 * <response>
 * <header>
 * <requestMsgID/>
 * <responseTime>2017-02-10 13:12:16.1216</responseTime>
 * <responseMsgID/>
 * <successYN>Y</successYN>
 * <resultCode>00</resultCode>
 * <resultMsg>NORMAL SERVICE.</resultMsg>
 * </header>
 * <body>
 * <items>
 * <item>
 * <applicantName>한동철 | 대한민국(관리부서 서울대학교(정밀기계설계공동연구소))</applicantName>
 * <applicationDate>19961230</applicationDate>
 * <applicationNumber>1019960077662</applicationNumber>
 * <astrtCont>
 * 본 발명은 공작기계의 축 회전 정밀도 측정을 위한 정전 용량형 센서 시스템에 관한 것으로서 보다 상세하게는 용도에 적합하도록 개발된 정정 용량형 센서와 이의 신호처리를 통한 초정밀 회전 정밀도 측정 시스템에 관한 것이다.본 발명은 상술한 바와 같이 일반적인 변위 측정 센서로 측정하기 곤란한 정밀 주축의 회전 정밀도 측정을 위해, 측정 대상물의 형상 오차를 제거한 축의 운동 성분 만을 측정하기 위한 시스템을 제공함에 있다.본 발명의 특징은 NT40 표준 척에 쉽게 장착할 수 있는 마스터 실린더와; 상기 마스터 실린더 원주면을 모두 감싸는 4조로 구성된 넓은 면적의 판형 정전 용량형 센서로 구성된 원통형 센서 시스템에 있다.본 발명의 다른 특징은 4쌍의 센서 및 가드 판이 원통형 센서 형상에 서로 전기적으로 분리되도록 제작하는 방법과; 상기 각 센서 및 가드 판에 센서 선 및 가드선을 연결하는 방법과 상기 센서로부터 나온 신호의 처리 회로로의 연결 선의 제작 단계와, 상기 센서를 원통형 틀에 고정하여 에폭시 몰딩의 과정으로 제작하는 단계와; 마지막 연삭 공정을 통하여 원통형 센서에서 센서 및 가드가 분리되며 필요한 형상 정밀도를 내는 단계로 이루어지는 원통형 센서의 제조 방법이 포함된다.
 * </astrtCont>
 * <bigDrawing>
 * http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=452306798ef1fd035bfb5ff666db4c9c6468d92a0531fdc4890876003a3ba7844b90afecaabda52d9feb54277dc57ca4
 * </bigDrawing>
 * <drawing>
 * http://plus.kipris.or.kr/kiprisplusws/fileToss.jsp?arg=ed43a0609e94d6e2d625a3dcb0746fe477b8e79b56045f07ce0d2c5a173f8fc847c387a11d2872999332c0e3dbcc4ba1
 * </drawing>
 * <indexNo>3</indexNo>
 * <inventionTitle>
 * 공작기계의 축 회전 정밀도 측정을 위한 정전 용량형 센서 시스 템과 원통형 센서의 제조방법(Capacitor type sensor system and cylindrical sensor manufacturing method for the shaft rotation precision measurement of machine tool)
 * </inventionTitle>
 * <ipcNumber>B23Q 17/00</ipcNumber>
 * <openDate>19980925</openDate>
 * <openNumber>1019980058338</openNumber>
 * <publicationDate>19990901</publicationDate>
 * <publicationNumber/>
 * <registerDate>19990602</registerDate>
 * <registerNumber>1002169870000</registerNumber>
 * <registerStatus>소멸</registerStatus>
 * </item>
 * </items>
 * </body>
 * <count>
 * <numOfRows>20</numOfRows>
 * <pageNo>1</pageNo>
 * <totalCount>22251</totalCount>
 * </count>
 * </response>
 */

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "response")
public class KiprisIpResponseVO {

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
            private Integer indexNo;
            // 출원인
            private String applicantName;
            // 발명의 명칭(한글)
            private String inventionTitle;
            // 출원일자
            private String applicationDate;
            // 출원번호
            private String applicationNumber;
            // 초록
            private String astrtCont;
            // 등록번호
            private String registerNumber;
            // 등록일자
            private String registerDate;
            // 등록상태
            private String registerStatus;

            // 큰 이미지 경로
            private String bigDrawing;
            // 이미지 경로
            private String drawing;

            // IPC 번호
            private String ipcNumber;
            // 공개일자
            private String openDate;
            // 공개번호
            private String openNumber;
            // 공고일자
            private String publicationDate;
            // 공고번호
            private String publicationNumber;
        }
    }


}
