package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("InvestAlarmSendHistoryVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserNm", "amnnUserNm", "totalCnt", "rvsRnum", "imgFileId", "imgUrl"
})
public class InvestAlarmSendHistoryVO extends BaseTableVO {

    /**
     * 알림 발송 이력
     * TB_BOX_IVT_ALRT_SNDG_H
     */

    public InvestAlarmSendHistoryVO(RequestAlarmVO requestAlarmVO, String sndgAlrtId, String rgsnUserId) {
        this(   sndgAlrtId
                , requestAlarmVO.getAlrtId()
                , requestAlarmVO.getRcvrDcd()
                , requestAlarmVO.getAlrtTtlNm()
                , requestAlarmVO.getAlrtCon()
                , requestAlarmVO.getAlrtLrdvDcd()
                , requestAlarmVO.getAlrtMddvCd()
                , requestAlarmVO.getAlrtYn()
                , requestAlarmVO.getPushYn()
                , requestAlarmVO.getIbkboxSvcDcd()
                , requestAlarmVO.getPcLinkUrlCon()
                , null
        );
        super.setRgsnUserId(rgsnUserId);
    }

    // 발송 알림 ID
    private String sndgAlrtId;

    // 알림 ID
    private String alrtId;

    // 수신자구분코드
    private String rcvrDcd;

    // 알림제목명
    private String alrtTtlNm;

    // 알림 내용
    private String alrtCon;

    // 알림대분류구분코드
    private String alrtLrdvDcd;

    // 알림중분류코드
    private String alrtMddvCd;

    // 알림여부
    private String alrtYn;

    // 푸시여부
    private String pushYn;

    // IBKBOX서비스구분코드
    private String ibkboxSvcDcd;

    // PC링크URL내용
    private String pcLinkUrlCon;

    // 모바일링크URL내용
    private String mblLinkUrlCon;

}
