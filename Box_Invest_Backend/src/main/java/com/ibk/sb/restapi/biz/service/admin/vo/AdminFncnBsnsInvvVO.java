package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("AdminFncnBsnsInvvVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class AdminFncnBsnsInvvVO  extends BaseTableVO {

    private String fncnBsnsRcipNo;

    private int rgsnSqn;

    private String opcmNm;

    private String opcmHmrsDcd;

    private String opcmHmrsNm;

    private int OpcmHmrsCrrNyy;

    private String opcmCmpnTpn;

    private String opcmRsprCpn;

    private String opcmEad;

    // 등록일시
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp iibsFrrgTs;

    // 등록ID
    private String iibsFrrgId;

    // 수정일시
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp iibsLsmdTs;

    // 수정ID
    private String iibsLsmdId;
}
