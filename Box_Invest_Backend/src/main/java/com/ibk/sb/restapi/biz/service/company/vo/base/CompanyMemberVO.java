package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyMemberVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyMemberVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_ENPR_TMMB_D
     * DESC : 기업 팀원
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 팀원 아이디
//    private Integer tmmbSqn;
    private String tmmbId;

    // 팀원명
    private String tmmbNm;

    // 팀원직급
    private String tmmbJbcl;

    // 경력 내용
    private String crrCon;

    // 팀원 이미지 파일 아이디
//    private String fileMngmNo;
    @JsonIgnore
    private String tmmbImgFileId;

    private String fileId; // 프론트 공통화

}
