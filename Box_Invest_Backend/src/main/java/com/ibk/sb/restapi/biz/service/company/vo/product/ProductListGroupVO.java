package com.ibk.sb.restapi.biz.service.company.vo.product;

import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanyProductSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.CommerceSellerProductVO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListGroupVO {
    // 기능 추가 : 커머스 판매자 스토어 목록이 있는 경우 연동 정보 제공
    private String commerceListYn;
    private List<CompanyProductSummaryVO> productList;
    private List<CommerceSellerProductVO> commerceProductList;
}
