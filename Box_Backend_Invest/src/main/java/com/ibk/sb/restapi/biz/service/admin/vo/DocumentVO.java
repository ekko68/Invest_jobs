package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("DocumentVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class DocumentVO extends BaseTableVO {

    public DocumentVO() {
        super();
    }
    public DocumentVO(String dcmnId) {
        this.dcmnId = dcmnId;
    }

    private String dcmnId;      // 문서 ID
    private String dcmnNm;      // 문서명
    private String dcmnCon;     // 문서 내용
    private String delYn;       // 삭제 여부

    private List<DocumentFileVO> attachFileList;    // 공지사항 첨부파일 리스트

}
