package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("FncnInfoVO")
public class FncnInfoVO extends BaseTableVO{

    private String utlinsttId = " ";          // 이용기관 ID
    private Integer sqn = 0;                 // 순번
    private String rgyeDsnc = " ";            // 연도구분
    private String fncnAmt = " ";             // 금액
    private String memo = " ";                // 메모내
    private String fncnDsnc = " ";            // 코
    private String rgsrId = " ";              // 동록자
    private Integer key;
    private String amnnId = " ";              // 수정자
    private Timestamp amnnTs;              // 수정일

}
