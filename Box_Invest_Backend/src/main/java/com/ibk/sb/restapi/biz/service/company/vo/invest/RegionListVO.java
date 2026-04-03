package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
/**
 * 주요투자 업종
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("RegionListVO")
public class RegionListVO {

    private String id;              // 	업종 코드
    private String value;           //  업종명
    private String comCdId;         // 	업종 코드
    private String comCdNm;         // 	업종명
    private String status;          // 	선택상태
    private String other;           //  기타
}
