package com.ibk.sb.restapi.biz.service.ir.vo.progress;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Alias("IrProgressVO")
public class IrProgressVO {

    /** IR 등록 진행 정보 **/

    // 등록 진행도
    private Integer progress = 0;

    // IR 제목
    private String irTitle;

    // IR 팝업 제목
    private String irPopupTitle;

    // 최종 수정일
    @JsonFormat(pattern = "yyyyMMdd")
    private Timestamp lastModifiedDate;

    // 최종 수정일 (yyyyMMddHHmmss)
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp lastModifiedTimestamp;

}
