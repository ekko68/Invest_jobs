package com.ibk.sb.restapi.biz.service.test.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TestDataVO")
public class TestDataVO extends BaseTableVO {
    private String utlinsttId;
}
