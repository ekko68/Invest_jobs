package com.ibk.sb.restapi.biz.service.kipris.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestSearchKiprisVO extends PageVO {

    private String applicantNumber;

    private String bizNum;
}
