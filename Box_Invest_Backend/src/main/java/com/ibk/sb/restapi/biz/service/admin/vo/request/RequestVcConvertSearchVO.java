package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestVcConvertSearchVO")
public class RequestVcConvertSearchVO extends PageVO {

    // 회사명
    private String bplcNm;

    // 기업 아이디
    private String utlinsttId;

    // 상태
//    private String cnvsRqstSttsCdId;
}
