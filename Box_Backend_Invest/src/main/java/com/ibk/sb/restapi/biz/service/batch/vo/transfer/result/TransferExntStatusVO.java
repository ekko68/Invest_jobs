package com.ibk.sb.restapi.biz.service.batch.vo.transfer.result;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TransferExntStatusVO")
public class TransferExntStatusVO {

    // 상태코드
    private String statusCd;

    // 상태명
    private String statusNm;

    // 등록개수
    private int registerCnt;
}