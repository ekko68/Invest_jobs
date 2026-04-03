package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Alias("AdminVcConvertRequestVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "amnnUserId", "amnnTs",
        "totalCnt", "imgFileId", "amnnUserNm"
})
public class AdminVcConvertRequestVO extends BaseTableVO {

    /** 투자사 전환 관리 VO */

    private String utlinsttId;       // 전환요청 이용기관(회사) ID

    private String bplcNm;              // 전환요청 이용기관명

    private String bzn;                 // 전환요청 이용기관 사업자번호

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

    private String cnvsRqstSttsCdNm	;   // 전환 요청 상태 코드명

    private String cnvsRqstSttsCdId	;   // 전환 요청 상태 코드 ID

    private Integer cnvsRqstSqn;        // 전환요청순번

    private String alrtCnfaYn;          // 클라이언트 결과 알림 체크 Yn

    @JsonIgnore
    private String invmCmpPtrnCd;       // 투자사 유형 코드

    private String brgcFileId;          // 사업자등록증 파일 ID

    private String rgsnUserNm;          // 등록 사용자 명
}
