package com.ibk.sb.restapi.biz.service.platform.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class BoxListResponseVO<T> {

    @JsonProperty("STATUS")
    private String STATUS;

    @JsonProperty("MESSAGE")
    private String MESSAGE;

    // 공통 스크래핑의 경우 RSLT_MSG로 떨어진다.
    @JsonProperty("RSLT_MSG")
    private String RSLT_MSG;

    /**
     * 문서상 API에 따라 리스트 객체가
     * RSLT_LIST 로 오는 경우가 있고 RSLT_DATA로 오는 경우가 있음
     *
     * RSLT_LIST : 기업정보 리스트 조회
     * RSLT_DATA : 알림 수신 리스트 조회, 알림 카운트 정보 리스트 조회, 공통 스크래핑
     *
     * DATA :
     * 알림 수신 유저정보 조회
     * 영업점 정보의 경우 STATUS에 따라 데이터 타입이 변하므로 Map으로 받고 ObjectMapper 처리를 한다.
     */

    @JsonProperty("RSLT_LIST")
    private List<T> RSLT_LIST;

    @JsonProperty("RSLT_DATA")
    private List<T> RSLT_DATA;

    @JsonProperty("DATA")
    private List<T> DATA;
}
