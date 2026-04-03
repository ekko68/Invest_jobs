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
@Alias("RequestVcConvertConsultingCancelVO")
public class RequestVcConvertConsultingCancelVO {

    @JsonIgnore
    private final String CONSULT_STANDBY_CODE = ComCode.CONSULT_STANDBY.getCode();
    @JsonIgnore
    private final String CONSULT_COMPLETE_CODE = ComCode.CONSULT_COMPLETE.getCode();
    @JsonIgnore
    private final String CONSULT_CANCEL_CODE = ComCode.CONSULT_CANCEL.getCode();

    // 의뢰기관 기업 아이디
    private String reqsInttId;
    // 수정 사용자 아이디
    private String amnnUserId;

}
