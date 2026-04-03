package com.ibk.sb.restapi.biz.service.audit.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("InvestAuditStageVO")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({
        "delYn", "rnum", "imgUrl", "rgsnUserId", "amnnUserId", "amnnTs",
        "totalCnt", "rgsnUserNm", "amnnUserNm", "rvsRnum", "imgFileId"
})
public class InvestAuditStageVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_EXNT_PGSG_R
     * DESC : 투자심사 진행단계 목록
     */

    // 투자심사 요청 ID
    private String invmExntRqstId;

    // 투자심사 진행단계 코드
    private String invmExntPgsgCd;

    // 투자심사 진행단계명
    private String invmExntPgsgNm;

    // 등록 사용자 ID
    private String rgsnUserId;

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

}
