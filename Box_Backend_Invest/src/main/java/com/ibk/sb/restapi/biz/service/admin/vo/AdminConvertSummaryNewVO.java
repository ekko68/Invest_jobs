package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("AdminConvertSummaryNewVO")
@ToString
public class AdminConvertSummaryNewVO extends BaseTableVO implements ExcelFormReflect {
    @ExcelFieldProperty(fieldName = "회사명", additionalWidth = 4096)
    private String cmpnNm;
    @ExcelFieldProperty(fieldName = "기업 ID", additionalWidth = 4096)

    private String utlinsttId;

    @ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
    private String bzn;

    @ExcelFieldProperty(fieldName = "최초승인일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

    @ExcelFieldProperty(fieldName = "전환상태", additionalWidth = 4096)
    private String invmCnvsSttsNm;
    
    private String invmCnvsStts;

    @ExcelFieldProperty(fieldName = "출자여부", additionalWidth = 4096)
    private String fncnYn;

//    @ExcelFieldProperty(fieldName = "수정자", additionalWidth = 4096)
    private String amnnUserId;

//    @ExcelFieldProperty(fieldName = "최종수정일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
    private Timestamp amnnTs;
}
