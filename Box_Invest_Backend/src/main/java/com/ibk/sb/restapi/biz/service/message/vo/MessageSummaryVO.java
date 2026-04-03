package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("MessageSummaryVO")
@JsonIgnoreProperties({
        "imgUrl", "delYn", "amnnUserId", "amnnTs",
        "totalCnt", "amnnUserNm", "imgFileId"
})
public class MessageSummaryVO extends BaseTableVO {

    // 메시지 ID
    private String msgId;

    // 발신기관 ID
    private String dsmsInttId;

    // 수신기관 ID
    private String rcvInttId;

    // 송신자 개인 ID = 등록자 ID
    private String rgsnUserId;

    // 메시지 유형
    private String msgPtrnCd;
    private String msgPtrnNm;

    // 메시지 제목
    private String msgTtl;

    // 발송 일시
//    private String sndgTs;

    // 수신 이용기관명
    private String rcvrBplcNm;

    // 송신자 이름 = 등록자명
    private String rgsnUserNm;

    // 송신자 소속 이용기관명
    private String trntBplcNm;

    // 답변 메시지인지 확인 - 답변이면 "Y"
    private String replyYn;

    // 첨부파일 유무
    private String fileYn;

    // 확인여부
    private String cnfaYn;

    /**
     * 투자심사 메시지일 경우의 JOIN
     */
    // 투자심사 ID
    private String invmExntRqstId;

    /**
     * 추가 기능 사항
     */
    // 24시간 내 수신 여부
    private String rcvInOneDayYn;
}
