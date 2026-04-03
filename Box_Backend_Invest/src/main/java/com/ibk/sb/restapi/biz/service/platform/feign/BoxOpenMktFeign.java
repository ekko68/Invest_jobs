package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import com.ibk.sb.restapi.biz.service.platform.vo.product.CommerceSellerProductVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.RequestSellerProductVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

//@FeignClient(name = "box-open-api-stamp", url = "http://localhost:7401", configuration = FeignBoxMktKeyConfig.class)
@FeignClient(
        name = "box-open-api-stamp",
        url = "${feign.box-open-api.url}",
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenMktFeign {

    /**
     * 커머스박스 인감정보 조회
     * @param utlinsttId
     * @return
     */
    @GetMapping("/api/mk/v1/seal")
    ResponseData<CommerceSealVO> searchCommerceSealInfo(@RequestParam("utlinsttId") String utlinsttId);

    /**
     * 커머스박스 인감정보 등록
     * @param body
     * @return
     */
    @PostMapping("/api/mk/v1/seal/save")
    ResponseData<CommerceSealVO> saveCommerceSealInfo(@RequestBody CommerceSealVO body);

    /**
     * 커머스박스 인감정보 삭제
     * @param body
     * @return
     */
    @PostMapping("/api/mk/v1/seal/delete")
    ResponseData deleteCommerceSealInfo(@RequestBody CommerceSealVO body);


    /**
     * 판매자 스토어 개별상품 목록 조회
     * @param body
     * @return
     */
    @PostMapping("/api/mk/v1/product/seller/single/list")
    ResponseData<PagingVO<CommerceSellerProductVO>> searchCommerceSellerProductList(@RequestBody RequestSellerProductVO body);
}
