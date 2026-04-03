package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.UsisUserVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("InvestAlarmTargetVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserNm", "amnnUserNm", "totalCnt", "rvsRnum", "imgFileId", "imgUrl"
})
public class InvestAlarmTargetVO extends BaseTableVO {

    /**
     *  알림 수신 대상 목록
     *  TB_BOX_IVT_ALRT_RCV_L
     */
    public InvestAlarmTargetVO(UsisUserVO targetVO, String sndgAlrtId, String rgsnUserId) {
        this(
                sndgAlrtId
                , targetVO.getUtlInsttId()
                , targetVO.getUserId()
        );
        super.setRgsnUserId(rgsnUserId);
    }

    // 발송 알림 ID
    private String sndgAlrtId;

    // 이용기관ID
    private String usisId;

    // 개인회원ID
    private String idmbId;

}
