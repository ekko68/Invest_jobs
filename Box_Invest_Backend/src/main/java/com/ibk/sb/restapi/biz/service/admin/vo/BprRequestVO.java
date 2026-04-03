package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@Alias("BprRequestVO")
public class BprRequestVO extends BaseTableVO {

    @Nullable
    @ApiModelProperty( name="벤처대출추천id", notes="v", required=false, example="" )
    private String vnentrlonId;

    @Nullable
    @ApiModelProperty( name="file", notes="file", required=false, example="" )
    private List<BprItem> bprItems;

    @Data
    @Builder
    @AllArgsConstructor
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BprItem {
        @Nullable
        @ApiModelProperty( name="서식코드", notes="서식코드", required=false, example="" )
        private String docCd;

        @Nullable
        @ApiModelProperty( name="file", notes="file", required=false, example="" )
        private List<MultipartFile> files;
    }
}



