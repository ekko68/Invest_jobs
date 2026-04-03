package com.ibk.sb.restapi.biz.service.company.vo.invest;

import lombok.*;
import org.apache.ibatis.type.Alias;

/**
 * 관심 비즈니스 분야
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("InvestFieldListVO")
public class InvestFieldListVO {

    private String id;          // 	단계 코드
    private String value;       //  단계 코드 값
    private String comCdId;     // 	단계 코드
    private String comCdNm;     // 	단계 코드 값
    private String status;      // 	선택상태
    private String other;       //  기타

}
