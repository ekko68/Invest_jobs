package com.ibk.sb.restapi.biz.service.batch.vo.transfer.result;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultTransferVO {

    /* 이관 서비스 실행 결과 */

    // 이관 등록된 투자심사 개수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer registerInvmExntCnt = null;

    // 등록 투자심사 상태 목록 (요청 / 진행 / 심사완료 / 기간만료)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<TransferExntStatusVO> invmExntStatusCntList = null;

    // 등록 투자심사 심사완료 결과 상태 목록 (승인 / 거절 / 보류)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<TransferExntStatusVO> invmExntRsltCntList = null;

    // 기업정보 갱신이 이뤄진 이용기관 수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer updateEnprInfoUsisCnt = null;

    // 기업IR 갱신이 이뤄진 이용기관 수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer updateEnprIrUsisCnt = null;

    // 이관 등록된 Nice 스크래핑 키의 개수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer registerNiceScpKeyCnt = null;

    // 이관 서비스 실행일
    private String transferDate;

    private String message;
}
