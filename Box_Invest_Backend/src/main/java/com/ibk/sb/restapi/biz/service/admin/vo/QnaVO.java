package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("QnaVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "amnnUserId", "amnnTs",
        "totalCnt"
})
public class QnaVO extends BaseTableVO {

    // 문의사항 ID
    private String inqrSbjcId;

    // 문의사항 제목
    private String inqrSbjcTtl;

    // 문의사항 내용
    private String inqrSbjcCon;

    // 문의사항 답변 내용
    private String inqrSbjcRplyCon;

    // 진행상태 코드
    private String pgstCd;

    // 문의 구분 코드
    private String inqrDsncCd;

    // 등록 이용기관 ID
    private String rgsrUsisId;

    // 답변 관리자 ID
    private String rplyMngrId;

    // 답변 일시
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rplyTs;

    /** JOIN */
    // 진행상태 코드명
    private String pgstNm;

    // 문의구분 코드명
    private String inqrDsncNm;

    // 투자박스 사용자 프론트에서 비공개 접근 판별을 위한 필드
    private String rightYn = IvtCode.YnTypeEnum.Y.name();
}
