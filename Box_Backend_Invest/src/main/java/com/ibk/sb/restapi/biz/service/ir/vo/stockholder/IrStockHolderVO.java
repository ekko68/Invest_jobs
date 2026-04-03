package com.ibk.sb.restapi.biz.service.ir.vo.stockholder;

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
@Alias("IrStockHolderVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrStockHolderVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_S_STCH_L
     * DESC : 기업IR 주주 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 주주 순번
    private Integer stchSqn;

    // 주주명
    private String stchNm;

    // 우선주 보유수
    private Long pfstHoldCnt;

    // 우선주 액면가
    private Long pfstPvpr;

    // 우선주 금액
    private Long pfstAmt;

    // 보통주 보유수
    private Long cmscHoldCnt;

    // 보통주 액면가
    private Long cmscPvpr;

    // 보통주 금액
    private Long cmscAmt;

    // 지분율
    private Double prra;

    // 비고
    private String rmrk;

    /** 데이터 이관 서비스 작업시 @Builder 이용을 위함 */

    // 등록 사용자
    private String rgsnUserId;

    // 등록 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
}
