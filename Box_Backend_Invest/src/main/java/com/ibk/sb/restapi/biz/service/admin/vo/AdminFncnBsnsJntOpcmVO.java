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
@Alias("AdminFncnBsnsJntOpcmVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class AdminFncnBsnsJntOpcmVO extends BaseTableVO {

    // 출자사업 접수번호
    private String fncnBsnsRcipNo;

    // 등록 순번
    private int rgsnSqn;

    // 운용사명
    private String opcmNm;

    // 운용사 대표자명
    private String opcmRpprNm;

    // 운용사 설립년월일
    private String opcmIncrYmd;

    // 운용사 사업자 등록번호
    private String opcmBzn;

    // 운용사 담당자명
    private String opcmRsprNm;

    // 연락처 내용
    private String cnplCon;

    // 이메일 내용
    private String emlCon;

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
