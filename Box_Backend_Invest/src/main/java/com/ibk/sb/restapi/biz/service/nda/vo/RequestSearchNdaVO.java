package com.ibk.sb.restapi.biz.service.nda.vo;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchNdaVO")
@NoArgsConstructor
public class RequestSearchNdaVO extends PageVO {

    // 조회타입 코드
    private final String RECEIVE_CODE = IvtCode.TransmitTypeEnum.RECEIVE.name();
    private final String SEND_CODE = IvtCode.TransmitTypeEnum.SEND.name();

    // 조회 타입
    private String searchType;

    // 발신 기관 ID
    private String dsmsInttId;

    // 수신 기관 ID
    private String rcvInttId;

    // 진행 상태 코드
    private String pgrsSttsCd;

}
