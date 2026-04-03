package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("NoticeFileVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId",  "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class NoticeFileVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_PBNS_ATCH_R
     * DESC : 투자박스 공지사항 첨부파일 맵핑 정보
     */

    // 공지사항 ID
    private String pbnsId;

    @JsonIgnore
    private String atchId; // 실제 테이블 컬럼
    private String fileId; // 프론트 공통화

    /** JOIN **/
    // 파일명
    private String fileNm;
}
