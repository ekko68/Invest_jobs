package com.ibk.sb.restapi.biz.service.vc.vo.pagelink;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("VcPageEventVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPageEventVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_PG_EVT_L
     * DESC : 투자사전용 페이지 이벤트 목록
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자사 전용 페이지 ID
    private String invmCmpExusPageId;

    // 이벤트 순번
    private Integer evntSqn;

    // 대표이미지 파일 ID
    @JsonIgnore
    private String rprsImgFileId;
    private String fileId;
    private String fileNm;

    // 이벤트 바로가기 URL
    private String evntBkmrUrl;

    // 이벤트 제목
    private String evntTtl;

    // 이벤트 내용
    private String evntCon;

    // 이벤트 시작일
    @JsonIgnore
    private Timestamp evntStdy;

    // 이벤트 종료일
    @JsonIgnore
    private Timestamp evntFnda;

    // 이벤트 시작일 (프론트 사용)
    private String evntStdt;

    // 이벤트 종료일 (프론트 사용)
    private String evntFndt;

    // 진행여부
    private String ongoingYn;

}
