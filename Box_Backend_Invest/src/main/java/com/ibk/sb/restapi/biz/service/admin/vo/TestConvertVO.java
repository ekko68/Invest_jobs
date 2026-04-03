package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestConvertVO {
    private String id;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TestInnerVO {
        @ExcelFieldProperty(fieldName = "회사명", additionalWidth = 4096)
        private String bplcNm;
        @ExcelFieldProperty(fieldName = "기업 ID", additionalWidth = 4096)
        private String utlinsttId;
        @ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
        private String bzn;

        @ExcelFieldProperty(fieldName = "최초승인일", additionalWidth = 4096)
        @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
        private Timestamp firstAcceptDate;

        @ExcelFieldProperty(fieldName = "수정일", additionalWidth = 4096)
        @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
        private Timestamp lastConvertDate;

        @ExcelFieldProperty(fieldName = "상태", additionalWidth = 4096)
        private String usisState;

        @ExcelFieldProperty(fieldName = "계정전환", additionalWidth = 4096)
        private String useYn;
    }
}
