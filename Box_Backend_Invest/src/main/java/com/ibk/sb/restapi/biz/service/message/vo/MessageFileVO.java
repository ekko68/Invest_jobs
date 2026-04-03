package com.ibk.sb.restapi.biz.service.message.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("MessageFileVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rvsRnum", "rgsnUserNm", "amnnUserNm", "imgFileId",
        "athrUtlinsttId", "athrInvmCmpUtlinsttId", "athr"
})
public class MessageFileVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_MSG_ATCH_R
     * DESC : 메시지 첨부파일 정보
     */

    // 메시지 ID
    private String msgId;

    // 첨부파일 아이디
//    private String fileMngmNo;
    @JsonIgnore
    private String atchId; // 실제 테이블 컬럼
    private String fileId; // 프론트 공통화

   /** JOIN **/

    // 파일명
    private String fileNm;
}
