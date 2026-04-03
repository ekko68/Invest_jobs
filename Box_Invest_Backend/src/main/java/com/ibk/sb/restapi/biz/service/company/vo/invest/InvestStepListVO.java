package com.ibk.sb.restapi.biz.service.company.vo.invest;

import lombok.*;
import org.apache.ibatis.type.Alias;
/**
 * 주요투자단계
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("InvestStepListVO")
public class InvestStepListVO {

    private String id;              // 	단계 코드
    private String value;           //  단계 코드 값
    private String comCdId;         // 	단계 코드
    private String comCdNm;         // 	단계 코드 값
    private String status;          // 	선택상태
    private String other;           //  기타
}
