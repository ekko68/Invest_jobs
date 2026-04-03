package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("CompanyInvestFieldVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyInvestFieldVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_ENPR_IVFL_R
     * DESC : 기업별 비즈니스(투자) 분야
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자분야 코드
//    private String ivflId;
    private String invmFildCd;

    // 투자분야명
    private String invmFildNm;

    // 투자분야 시퀀스
    private Integer ivflSqn;

    /* Builder 처리를 위함 */
    // 등록 사용자
    private String rgsnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

}
