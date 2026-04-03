package com.ibk.sb.restapi.biz.service.vc.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;


@Getter
@Setter
@Alias("RequestVcOperationReportVO")
public class RequestVcOperationReportVO extends PageVO {

    // 투자사ID
    private String invtId;
}
