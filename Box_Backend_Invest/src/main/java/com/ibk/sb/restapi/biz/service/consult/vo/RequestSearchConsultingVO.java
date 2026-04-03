package com.ibk.sb.restapi.biz.service.consult.vo;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchConsultingVO")
public class RequestSearchConsultingVO extends PageVO {

    // 의뢰 이용기관 아이디
    private String reqsInttId;

}
