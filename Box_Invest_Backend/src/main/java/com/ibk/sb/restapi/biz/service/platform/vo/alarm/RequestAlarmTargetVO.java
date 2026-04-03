package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.ibk.sb.restapi.biz.service.platform.vo.account.UsisUserVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestAlarmTargetVO {

    public RequestAlarmTargetVO(UsisUserVO usisUserVO) {
        this(usisUserVO.getUtlInsttId(), usisUserVO.getUserId());
    }

    // 이용기관ID
    private String usisId;

    // 개인회원ID
    private String idmbId;
}
