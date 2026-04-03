package com.ibk.sb.restapi.biz.service.test.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TestMainFundInvestSwiperVO")
public class TestMainFundInvestSwiperVO {

    private String img;

    private String intro;

    private String name;

    private String title;

    private String url;
}
