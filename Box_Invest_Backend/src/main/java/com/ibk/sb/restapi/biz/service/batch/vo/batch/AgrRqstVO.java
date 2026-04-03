package com.ibk.sb.restapi.biz.service.batch.vo.batch;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import lombok.Getter;
import lombok.Setter;

/**
 * 포괄적 동의 처리 기업 스크래핑 데이터 업데이트 VO
 */
@Getter
@Setter
public class AgrRqstVO {
    /*
     * 배치 서비스 타입
     * "search" : 업데이트 대상 리스트 조회
     * "update" : 인포텍 스크래핑 후, IR 데이터 업데이트
     */
    @JsonProperty("type")
    private String type;

    /*
     * update 대상 기업 정보
     */
    @JsonProperty("requestData")
    private CompanyBasicVO requestData;
}
