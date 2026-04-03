package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("NoticeVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class NoticeVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_PBNS_INFO_M
     * DESC : 투자박스 공지사항 정보
     */

    // 공지사항 ID
    private String pbnsId;

    // 공지사항 제목
    private String pbnsTtl;

    // 공지사항 내용
    private String pbnsCon;

    // 첨부파일 리스트
    private List<NoticeFileVO> attachFileList;

    // 프론트 공지사항 리스트 첨부파일 유무 확인용
    private String fileYn;

}
