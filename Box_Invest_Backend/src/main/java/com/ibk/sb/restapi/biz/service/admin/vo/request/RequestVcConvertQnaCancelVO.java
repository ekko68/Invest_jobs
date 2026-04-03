package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("RequestVcConvertQnaCancelVO")
public class RequestVcConvertQnaCancelVO {

    @JsonIgnore
    private final String QA_STANDBY_CODE = ComCode.QA_STANDBY.getCode();
    @JsonIgnore
    private final String QA_COMPLETE_CODE = ComCode.QA_COMPLETE.getCode();
    @JsonIgnore
    private final String QA_CANCEL_CODE = ComCode.QA_CANCEL.getCode();

    // 등록 이용기관 ID
    private String rgsrUsisId;

    private String amnnUserId;

}
