package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TransferIrProgressVO")
@NoArgsConstructor
@AllArgsConstructor
public class TransferIrProgressVO {

    // 이용기관(회사) ID
    private String utlinsttId;

    private String userId;

    private Integer stkHldrTabRt = 0;

    private Integer prdtTabRt = 0;
}
