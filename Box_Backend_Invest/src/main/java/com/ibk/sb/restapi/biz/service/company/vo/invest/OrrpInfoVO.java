package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("OrrpInfoVO")
public class OrrpInfoVO extends BaseTableVO{

    @Builder.Default
    private String invtId = " ";        // 이용기관 ID
    @Builder.Default
    private String rptDsnc = " ";       // 보고서 구분
    @Builder.Default
    private String fileId = " ";        // 파일 ID
    @Builder.Default
    private String fileNm = " ";        // 파일 명

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private String lada;          // 최종제출일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;               // 등록일
}
