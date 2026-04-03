package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("AdminStatisticsSearchVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class AdminStatisticsSearchVO extends PageVO {

    private String searchFromDate;      // 조회 날짜 (from)
    private String searchToDate;        // 조회 날짜 (to)

    @ApiModelProperty(hidden = true)
    private String invmExntPgsgCd;      // 조회 (투자심사단계 공통 코드)
}
