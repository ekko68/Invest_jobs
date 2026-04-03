package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("AdminQnaVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class AdminQnaVO extends BaseTableVO {

    public AdminQnaVO() {
        super();
    }

    public AdminQnaVO(String inqrSbjcId) {
        this.inqrSbjcId = inqrSbjcId;
    }

    private String inqrSbjcId	    ; // 문의사항 ID
    private String inqrSbjcTtl	    ; // 문의사항 제목
    private String inqrSbjcCon	    ; // 문의사항 내용
    private String inqrSbjcRplyCon	; // 문의사항 답변 내용
    private String pgstCd	        ; // 진행상태 코드

    private String pgstNm	        ; // 진행상태 코드명
    private String rplyMngrId	    ; // 답변 관리자 ID

}
