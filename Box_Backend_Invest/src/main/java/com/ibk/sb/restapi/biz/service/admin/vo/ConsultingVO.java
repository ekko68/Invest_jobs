package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("ConsultingVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "amnnUserId",
        "totalCnt", "rnum"
})
public class ConsultingVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_CNSG_REQS_M
     * DESC : 컨설팅 의뢰 정보
     */

    // 컨설팅 의뢰 ID
    private String cnsgReqsId;

    // 의뢰 이용기관 ID
    private String reqsInttId;

    // 컨설팅 유형 코드
    private String cnsgPtrnCd;

    // 컨설팅 의뢰 제목
    private String cnsgReqsTtl;

    // 컨설팅 의뢰 내용
    private String cnsgReqsCon;

    // 컨설팅 답변 내용
    private String cnsgRplyCon;

    // 컨설팅 상태 코드
    private String cnsgSttsCd;

    /** 등록 / 수정일 -> rgsnTs, amnnTs **/
    /** 컨설팅 의뢰 수정 기능이 생기고 답변일 컬럼이 따로 있어 변경함 */
//    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
//    private Timestamp reqsDt;
//
//    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
//    private Timestamp cnsgDt;

    // 답변일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rplyTs;

    // 답변 관리자 ID
    private String rplyMngrId;

    // 답변 관리자명
    private String rplyMngrNm;

    /** JOIN **/
    // 컨설팅 유형명
    private String cnsgPtrnNm;

    // 컨설팅 상태명
    private String cnsgSttsNm;

    // 컨설팅 의뢰 이용기관 명
    private String reqsInttNm;

}
