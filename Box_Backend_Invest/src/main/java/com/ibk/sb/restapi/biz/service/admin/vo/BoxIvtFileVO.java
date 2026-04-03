package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BoxIvtFileVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId",  "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class BoxIvtFileVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IDIV_ATCH_R
     * DESC : 간접투자 첨부파일 맵핑 정보
     */

	private String invtId;   //업무 구분 ID
	private String atchDsnc;   //파일 구분
	private String fileId;   //파일ID
	private String bsdsCd;   //업무 구분 코드
    private String fileNm;	// 파일명
}
