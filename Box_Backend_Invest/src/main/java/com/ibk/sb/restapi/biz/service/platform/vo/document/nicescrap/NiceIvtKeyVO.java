package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("NiceIvtKeyVO")
public class NiceIvtKeyVO {
    private String utlinsttId;
    private String simpDocRgsnId;

    private String rgsnUserId;
    private Timestamp rgsnTs;

    private String amnnUserId;
    private Timestamp amnnTs;
}
