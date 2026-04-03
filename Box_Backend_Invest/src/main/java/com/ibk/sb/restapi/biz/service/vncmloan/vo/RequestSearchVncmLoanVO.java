package com.ibk.sb.restapi.biz.service.vncmloan.vo;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchVncmLoanVO")
public class RequestSearchVncmLoanVO extends PageVO {

    // 의뢰 이용기관 아이디
    private String reqsInttId;

}
