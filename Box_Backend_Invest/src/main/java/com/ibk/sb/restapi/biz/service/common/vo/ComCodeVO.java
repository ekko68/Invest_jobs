package com.ibk.sb.restapi.biz.service.common.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseCodeTableVO;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("ComCodeVO")
@JsonIgnoreProperties({
        "delYn", "useYn", "imgFileId", "imgUrl", "rgsnTs", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class ComCodeVO extends BaseCodeTableVO {

    /**
     * Table : TB_BOX_IVT_COM_CD_D
     * DESC : 공통 코드 상세 정보
     */

    // 공통 코드 ID
    private String comCdId;

    // 그룹 코드 ID
    @JsonIgnore
    private String grpCdId;

    @JsonIgnore
    private String grpCdNm;

    // 공통 코드명
    private String comCdNm;

    // 공통 코드 설명
    @JsonIgnore
    private String comCdDesc;

    // 정렬순번
    @JsonIgnore
    private String lnpSqn;

    // 등록자
    private String rgsnUserId;

    // 수정자
    private String amnnUserId;

}
