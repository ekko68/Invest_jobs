package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("CompanyInvestHopeVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyInvestHopeVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_INVM_HOPE_D
     * DESC : 기업 투자희망 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자 단계 ID
//    private String invmStgId;
    private String invmStgCd;

    // 투자금액
    private Long invmAmt;
    private String invmAmtCd;

    // 투자단계 공개여부
//    private String invmStgOppbYn;
    private String oppbYn;

    /** JOIN **/
    // 투자단계명
    private String invmStgNm;

    // 투자단계코드명
    private String invmAmtNm;

    /** @Builder 사용을 위한 super 필드 */
    private String rgsnUserId;
    private String amnnUserId;

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;

    /** 투자박스 추가요건 사항 */
    // 해외투자희망여부
    private String osivHopeyn;
}
