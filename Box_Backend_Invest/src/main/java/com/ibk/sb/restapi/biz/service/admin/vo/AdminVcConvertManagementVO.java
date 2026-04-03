package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("AdminVcConvertManagementVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl",
        "totalCnt", "imgFileId"
})
public class AdminVcConvertManagementVO {
}
