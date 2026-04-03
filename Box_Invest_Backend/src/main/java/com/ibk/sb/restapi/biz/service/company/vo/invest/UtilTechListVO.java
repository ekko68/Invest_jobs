package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
/**
 * 활용 기술
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("UtilTechListVO")
public class UtilTechListVO {

    private String id;              // 	이용기관(회사) ID
    private String value;           //  투자사 인력 정보 구분 코드(신규)
    private String comCdId;         // 	순번
    private String comCdNm;         // 	성명
    private String status;          // 	선택상태
    private String other;       //  기타

}
