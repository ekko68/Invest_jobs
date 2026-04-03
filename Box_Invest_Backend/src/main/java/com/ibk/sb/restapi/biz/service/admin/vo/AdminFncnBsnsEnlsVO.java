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
@Alias("AdminFncnBsnsEnlsVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class AdminFncnBsnsEnlsVO  extends BaseTableVO {
    
    // 출자사업 접수번호
    private String fncnBsnsRcipNo;

    // 등록순번
    private int rgsnSqn;

    // 운용사명
    private String opcmNm;

    // 발급기관명
    private String isncInttNm;

    // 진행상태 내용
    private String pgstCon;

    // 출자금액
    private float fncnAmt;

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
