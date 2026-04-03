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
@Alias("FncnBsnsInvvHmrsVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FncnBsnsInvvHmrsVO extends BaseTableVO { // TB_BOX_IVT_IVB105_M
    
    // 출자사업 접수번호
    private String fncnBsnsRcipNo;
    
    // 등록순번
    private int rgsnSqn;
    
    // 운용사명
    private String opcmNm;
    
    // 운용사 인력구분코드
    private String opcmHmrsDcd;
    
    // 운용사 인력명
    private String opcmHmrsNm;
    
    // 운용사 인력 경력년수
    private int opcmHmrsCrrNyy;
    
    // 운용사 회사 전화번호
    private String opcmCmpnTpn;
    
    // 운용사 담당자 휴대폰번호
    private String opcmRsprCpn;
    
    // 운용사 이메일 주소
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
