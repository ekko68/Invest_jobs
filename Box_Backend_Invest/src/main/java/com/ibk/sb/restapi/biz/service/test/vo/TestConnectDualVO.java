package com.ibk.sb.restapi.biz.service.test.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TestConnectDualVO")
public class TestConnectDualVO {

    private String testId, testContent;

}


