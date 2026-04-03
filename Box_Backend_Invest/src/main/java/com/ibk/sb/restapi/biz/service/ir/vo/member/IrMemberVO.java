package com.ibk.sb.restapi.biz.service.ir.vo.member;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMemberVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMemberVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_T_TMMB_L
     * DESC : 기업IR 팀원 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;
    
    // 팀원 순번
    private Integer tmmbSqn;

    // 팀원명
    private String tmmbNm;

    // 팀원직급
    private String tmmbJbcl;
  
    // 경력 내용
    private String crrCon;

    // TODO : 파일 아이디 필드 추가 필요

    // 파일 아이디
    @JsonIgnore
    private String tmmbImgFileId;
    private String fileId; // 프론트 공통화

}
