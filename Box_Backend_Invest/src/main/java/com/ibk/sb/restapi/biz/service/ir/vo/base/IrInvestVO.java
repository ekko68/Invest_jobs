package com.ibk.sb.restapi.biz.service.ir.vo.base;

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
@Alias("IrInvestVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrInvestVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_B_INVM_D
     * DESC : 기업IR 투자유치 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자 유치 순번
    private Integer invmEnmtSqn;

    // 투자 유치 년월
    private String invmEnmtYm;

    // 투자 유치 기업명
    private String invmEnmtEtnm;

    // 투자 유치 금액
    private Long invmEnmtAmt;

    /** 데이터 이관 서비스 작업시 @Builder 이용을 위함 */

    // 등록 사용자
    private String rgsnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
}
