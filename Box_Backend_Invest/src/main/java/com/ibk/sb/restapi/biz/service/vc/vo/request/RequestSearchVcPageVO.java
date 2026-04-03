package com.ibk.sb.restapi.biz.service.vc.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchVcPageVO")
public class RequestSearchVcPageVO extends PageVO {

    // 투자사 아이디
    private String utlinsttId;

    // 진행여부 ( null or '' -> 전체검색)
    private String ongoingYn;
}
