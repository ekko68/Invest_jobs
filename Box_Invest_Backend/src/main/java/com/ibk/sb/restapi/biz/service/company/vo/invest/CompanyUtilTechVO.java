package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("CompanyUtilTechVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyUtilTechVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_ENPR_TCHN_R
     * DESC : 기업별 활용 기술
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 활용기술 ID
    private String utlzTchnCd;

    // 활용기술명
    private String utlzTchnNm;

    // 활용기술시퀀스
    private Integer utlzTchnSqn;

    /* Builder 처리를 위함 */
    // 등록 사용자
    private String rgsnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
}
