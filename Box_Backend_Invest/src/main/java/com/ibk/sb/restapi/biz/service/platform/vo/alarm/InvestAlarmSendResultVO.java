package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.RequestAlarmResponseVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("InvestAlarmSendResultVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserNm", "amnnUserNm", "totalCnt", "rvsRnum", "imgFileId", "imgUrl"
})
public class InvestAlarmSendResultVO extends BaseTableVO {

    /**
     * 알림 송수신 결과 목록
     * TB_BOX_IVT_ALRT_RSLT_H
     */

    public InvestAlarmSendResultVO(RequestAlarmResponseVO responseVO, String sndgAlrtId, String rgsnUserId) {
        this(
                sndgAlrtId
                , responseVO.getRegRslt()
                , responseVO.getAlrtSndgNo()
                , responseVO.getRegRsltMsg()
                , Integer.parseInt(responseVO.getAlrtRcvCnt())
                , Integer.parseInt(responseVO.getAlrtRcvRfslCnt())
        );
        super.setRgsnUserId(rgsnUserId);
    }

    // 발송 알림 ID
    private String sndgAlrtId;

    // 알림 발송 결과
    private String alrtSndgRslt;

    // 알림발송번호
    private String alrtSndgNo;

    // 등록 결과 메시지
    private String rgsnRsltMsg;

    // 수신 알림 수
    private Integer rcvAlrtCnt;

    // 수신 거부 알림 수
    private Integer rcvRfslAlrtCnt;

}
