package com.ibk.sb.restapi.biz.service.batch.vo.transfer.result;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Alias("TransferMappingVO")
public class TransferMappingVO {

    /** TB_BOX_IVT_EXNT_TRCT_R : 투자심사 이관 매핑 정보 */

    // ASIS 투자 신청 관리번호
    private String asiInvmaplcMnno;

    // ASIS 이용기관 ID
    private String asiUtlinsttId;

    // TOBE 투자 심사 요청 ID
    private String tobeInvmExntRqstId;

    // 기업 정보 이관 기준 여부
    private String enprInfoTrctBaseYn;

    // 등록 사용자 ID
    private String rgsnUserId;

    // 등록 일시
    private Timestamp rgsnTs;

    // 수정 사용자 ID
    private String amnnUserId;

    // 수정 일시
    private Timestamp amnnTs;

    /* join */
    private String invmExntPgsgCd;
}
