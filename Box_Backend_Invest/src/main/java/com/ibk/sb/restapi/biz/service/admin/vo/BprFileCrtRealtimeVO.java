package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.springframework.lang.Nullable;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@Alias("BprFileCrtRealtimeVO")
public class BprFileCrtRealtimeVO extends BaseTableVO {

    @Data
    @Builder
    @AllArgsConstructor
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BprVO {
        private static final long serialVersionUID = -74489430503632002L;

        @Nullable
        @ApiModelProperty( name="bpr인덱스키", notes="bpr인덱스키", required=false, example="" )
        private String indexKey;

        @Nullable
        @ApiModelProperty( name="사업자번호", notes="사업자번호", required=false, example="" )
        private String bizNo;

        @Nullable
        @ApiModelProperty( name="회사이름또는대표자명", notes="회사이름또는대표자명", required=false, example="" )
        private String csm;

        @Nullable
        @ApiModelProperty( name="전산고객번호", notes="전산고객번호", required=false, example="" )
        private String edpsCsn;

        @Nullable
        @ApiModelProperty( name="", notes="", required=false, example="" )
        private List<DocListItem> docList;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DocListItem {
        @Nullable
        @ApiModelProperty( name="서식코드", notes="서식코드", required=false, example="" )
        private String docCd;

        @Nullable
        @ApiModelProperty( name="hex값", notes="hex값", required=false, example="" )
        private List<String> pdfHex;
    }

}



