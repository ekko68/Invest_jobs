package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestMessageVO")
@NoArgsConstructor
public class RequestMessageVO extends PageVO {

    // 로그인한 이용기관 아이디
    private String utlinsttId;

    // 검색어
    private String searchStr;

    /* mapper list select 구분 */
    @JsonIgnore
    private String listType;

    @JsonIgnore
    private final String RECEIVE_LIST = IvtCode.TransmitTypeEnum.RECEIVE.name();
    @JsonIgnore
    private final String SEND_LIST = IvtCode.TransmitTypeEnum.SEND.name();

}
