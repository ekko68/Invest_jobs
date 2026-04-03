package com.ibk.sb.restapi.biz.service.vc.vo.pagelink;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VcPageDetailVO")
public class VcPageDetailVO {

    // 투자사전용 페이지 메인 + 투자사 + 투자지표 + 기타
    private VcPageMainVO pageMainData;

    // 투자사전용 페이지 진행 이벤트 리스트
    private List<VcPageEventVO> eventList;

    // 투자사전용 페이지 FAQ 리스트
    private List<VcPageFaqVO> faqList;

    // 투자사전용 페이지 배너 리스트
    private List<VcPageBannerVO> bannerList;

}
