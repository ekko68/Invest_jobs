package com.ibk.sb.restapi.biz.service.fncn.vo;

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
@Alias("FncnBsnsEnlsFildVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FncnBsnsEnlsFildVO extends BaseTableVO { // TB_BOX_IVT_IVB003_M
    
    // 출자사업공고 번호
    private String fncnBsnsPbanNo;

    // 출자사업 모집분야 고유번호
    private String fncnBsnsEnlsFildUqn;

    // 출자사업 모집분야 고유번호 이름
    private String fncnBsnsEnlsFildUqnNm;

    // 등록순번
    private int rgsnSqn;

    // 당사출자금액
    private float orcyFncnAmt;

    // 출자사업 선정 운용사 수
    private String fncnBsnsChcOpcmCnt;

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
