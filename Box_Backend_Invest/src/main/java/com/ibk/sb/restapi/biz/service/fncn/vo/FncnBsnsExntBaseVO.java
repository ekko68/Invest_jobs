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
@Alias("FncnBsnsExntBaseVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FncnBsnsExntBaseVO extends BaseTableVO { // TB_BOX_IVT_IVB002_M
    
    // 출자사업공고 번호
    private String fncnBsnsPbanNo;
    
    // 출자사업 모집분야 고유번호
    private String fncnBsnsEnlsFildUqn;
    
    // 출자사업 1차 심사 점수 비율
    private float fncnBsnsTms1ExntScrRto;
    
    // 출자사업 1차 통과 기준 점수
    private int fncnBsnsTms1PsngBaseScr;
    
    // 출자사업 2차 심사 점수 비율
    private float fncnBsnsTms2ExntScrRto;
    
    // 출자사업 2차 통과 기준 점수
    private int fncnBsnsTms2PsngBaseScr;
        
    // 출자사업 결성 관리번호
    private String fncnBsnsOrgzMngmNo;

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
