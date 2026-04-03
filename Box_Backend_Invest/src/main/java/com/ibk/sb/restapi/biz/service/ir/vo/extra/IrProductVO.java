package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Alias("IrProductVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrProductVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_PRDT_D
     * DESC : 기업IR 제품 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 제품 설명
    private String prdtDesc;

    // 제품 특징
    private String prdtChrc;

    /** 데이터 이관 서비스 작업시 @Builder 이용을 위함 */

    // 등록 사용자
    private String rgsnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

    // 등록 사용자
    private String amnnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;
}
