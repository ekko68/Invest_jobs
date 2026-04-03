package com.ibk.sb.restapi.biz.service.vncmloan.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VncmLoanSummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "amnnUserId",
        "totalCnt",
})
public class VncmLoanSummaryVO extends BaseTableVO {

    // 컨설팅 의뢰 ID
    private String cnsgReqsId;

    // 의뢰 이용기관 ID
    private String reqsInttId;

    // 컨설팅 의뢰 제목
    private String cnsgReqsTtl;

    // 컨설팅 유형 코드
    private String cnsgPtrnCd;

    // 컨설팅 상태 코드
    private String cnsgSttsCd;

    /** JOIN **/
    // 컨설팅 유형명
    private String cnsgPtrnNm;

    // 컨설팅 상태명
    private String cnsgSttsNm;

}
