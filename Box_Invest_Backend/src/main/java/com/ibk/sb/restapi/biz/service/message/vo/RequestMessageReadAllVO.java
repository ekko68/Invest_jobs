package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Alias("RequestMessageReadAllVO")
public class RequestMessageReadAllVO {

    private String rcvInttId;
    private String amnnUserId;

    @JsonIgnore
    private String listType;
    @JsonIgnore
    private final String RECEIVE = IvtCode.TransmitTypeEnum.RECEIVE.name();
    @JsonIgnore
    private final String SEND = IvtCode.TransmitTypeEnum.SEND.name();
}
