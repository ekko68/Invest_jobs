package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.ProductListGroupVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanyProductSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.CommerceSellerProductVO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyDetailVO {

    // 기업 기본 정보
    private CompanyBasicVO basicData;

    // 기업 투자 관련 정보
    private CompanyInvestVO investData;

    // 소개영상 리스트
    private List<CompanyIntroMediaVO> mediaList;

    // 팀원 정보 수, 리스트
    private Integer memberCnt;
    private List<CompanyMemberVO> memberList;

    // 제품 정보 리스트
    // 기능 추가 : 커머스 판매자 스토어 목록이 있는 경우 연동 정보 제공
    private ProductListGroupVO productListGroup;
}
