package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("AdminFncnRcipExcelVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminFncnRcipExcelVO  extends BaseTableVO implements ExcelFormReflect {

    @ExcelFieldProperty(fieldName = "순번", additionalWidth = 4096)
    private int seq;

    @ExcelFieldProperty(fieldName = "출자사업접수번호", additionalWidth = 4096)
    private String fncnBsnsRcipNo;

    @ExcelFieldProperty(fieldName = "출자사업공고번호", additionalWidth = 4096)
    private String fncnBsnsPbanNo;

    // 출자사업 모집분야 고유번호
    @ExcelFieldProperty(fieldName = "모집분야", additionalWidth = 4096)
    private String fncnBsnsEnlsFildUqnNm;

    @ExcelFieldProperty(fieldName = "진행상태", additionalWidth = 4096)
    private String fncnBsnsPgrsScd;

    @ExcelFieldProperty(fieldName = "운용사명", additionalWidth = 4096)
    private String opcmNm;

    @ExcelFieldProperty(fieldName = "제목", additionalWidth = 4096)
    private String fncnBsnsPbanTtlNm;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    @ExcelFieldProperty(fieldName = "접수일", additionalWidth = 4096)
    private Timestamp iibsFrrgTs;

    private String iibsFrrgId;

}
