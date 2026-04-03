package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("MessageVO")
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({
        "usyn", "delYn", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "amnnUserNm", "rvsRnum", "imgFileId", "imgUrl"
})
public class MessageVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_MSG_M
     * DESC : 메시지 정보
     */

    // 메시지 ID
    private String msgId;

    // 발신기관 ID
    private String dsmsInttId;

    // 송신자 개인 ID = 등록자 ID
    private String rgsnUserId;

    // 수신기관 ID
    private String rcvInttId;

    // 메시지 유형
    private String msgPtrnCd;

    private String msgPtrnNm;

    // 메시지 제목
    private String msgTtl;

    // 메시지 내용
    private String msgCon;

    // 답변 메시지 부모 ID
    private String prnsMsgId;

    // 확인여부
    private String cnfaYn;

    // 송신자 이름 = 등록자명
    private String rgsnUserNm;

    /**
     * JOIN
     **/
    // 송신자 소속 이용기관명
    private String trntBplcNm;

    // 수신자 소속 이용기관명
    private String rcvrBplcNm;

    // 답변 메시지인지 확인 - 답변이면 "Y"
    @JsonIgnore
    private String replyYn;

    // 첨부파일 유무
    @JsonIgnore
    private String fileYn;

    // 첨부 파일 리스트
    private List<MessageFileVO> fileList;

    // 회신 가능 여부
    private String sendReplyYn;

    /***
     * 투자심사 메시지일 경우의 JOIN
     */
    // 투자심사 ID
    private String invmExntRqstId;
}
