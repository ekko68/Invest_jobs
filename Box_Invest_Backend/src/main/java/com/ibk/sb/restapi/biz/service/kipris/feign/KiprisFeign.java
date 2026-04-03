package com.ibk.sb.restapi.biz.service.kipris.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKiprisConfig;
import com.ibk.sb.restapi.biz.service.kipris.vo.response.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "box-kipris-api", url = "${feign.box-kipris-api.url}", configuration = FeignBoxKiprisConfig.class)
public interface KiprisFeign {

    /**
     * 출원인번호(특허고객번호) 조회 (by 사업자 번호) 조회
     *
     * ->   특허 실용 항목별 검색(전체검색) by 출원인번호
     *      + 상표 항목별검색(전체검색) by 출원인번호
     *      + 디자인 항목별 검색(전체검색) by 출원인번호
     *
     * -> 자바 페이징 처리
     *
     * -> 디자인 항목의 경우 상세가 가야할 경우  서지상세정보 필요
     *
     */


    /**
     * 출원인 법인
     * 출원인 법인 및 사업자 번호(사업자번호)
     * 사업자번호 -> 출원인번호 조회
     *
     * @param BusinessRegistrationNumber
     * @return
     */
    @GetMapping(value = "/openapi/rest/CorpBsApplicantService/corpBsApplicantInfoV3")
    KiprisApplicantResponseVO getApplicant(@RequestParam("BusinessRegistrationNumber") String BusinessRegistrationNumber);


    /**
     * 특허 실용 공개 등록 공보
     * 항목별검색 -> 전체검색 -> 출원인명 :출원인번호로 조회
     *
     * @param applicant
     * @return
     */
    @GetMapping(value = "/kipo-api/kipi/patUtiModInfoSearchSevice/getAdvancedSearch")
    KiprisIpResponseVO getIpListResponse(@RequestParam("applicant") String applicant,
                                         @RequestParam("pageNo") Integer pageNo,
                                         @RequestParam("numOfRows") Integer numOfRows);


    /**
     * 상표 출원 속보
     * 항목별 검색 -> 전체검색 -> 출원인명 : 출원인번호로 조회
     *
     * @param applicantName
     * @param pageNo
     * @param numOfRows
     * @return
     */
    @GetMapping(value = "/kipo-api/kipi/trademarkInfoSearchService/getAdvancedSearch")
    KiprisTradeMarkResponseVO getTradeMarkListResponse(@RequestParam("applicantName") String applicantName,
                                                       @RequestParam("pageNo") Integer pageNo,
                                                       @RequestParam("numOfRows") Integer numOfRows);

    /**
     * 디자인 공보
     * 항목별 검색 -> 전체검색 -> 출원인명 : 출원인번호로 조회
     *
     * @param applicantName
     * @param pageNo
     * @param numOfRows
     * @return
     */
    @GetMapping(value = "/kipo-api/kipi/designInfoSearchService/getAdvancedSearch")
    KiprisDesignResponseVO getDesignListResponse(@RequestParam("applicantName") String applicantName,
                                                 @RequestParam("pageNo") Integer pageNo,
                                                 @RequestParam("numOfRows") Integer numOfRows);


    /**
     * 디자인 공보
     * 서지정보 -> 서지상세정보 -> 출원번호검색
     *
     * @param applicationNumber
     * @return
     */
    @GetMapping(value = "/kipo-api/kipi/designInfoSearchService/getBibliographyDetailInfoSearch")
    KiprisDesignDetailResponseVO getDesignDetailResponse(@RequestParam("applicationNumber") String applicationNumber);
}
