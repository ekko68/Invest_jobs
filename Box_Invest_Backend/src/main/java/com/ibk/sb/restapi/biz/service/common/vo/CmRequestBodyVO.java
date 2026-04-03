package com.ibk.sb.restapi.biz.service.common.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class CmRequestBodyVO {

    @Getter
    @Setter
    public static class SearchBrncEmp {
        private String brcd;
        private String empNm;
    }
}
