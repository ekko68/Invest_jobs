package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("AdminFncnPbanExcelVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminFncnPbanExcelVO extends BaseTableVO implements ExcelFormReflect  {

    @ExcelFieldProperty(fieldName = "순번", additionalWidth = 4096)
    private int seq;

    // 출자사업공고 번호
    @ExcelFieldProperty(fieldName = "공고코드", additionalWidth = 4096)
    private String fncnBsnsPbanNo;

    // 출자사업공고 제목명
    @ExcelFieldProperty(fieldName = "출자사업 제목", additionalWidth = 4096)
    private String fncnBsnsPbanTtlNm;

    // 출자사업공고 구분코드
    @ExcelFieldProperty(fieldName = "구분", additionalWidth = 4096)
    private String fncnBsnsPbanDcd;

    // 출자사업명
    @ExcelFieldProperty(fieldName = "출자사업명", additionalWidth = 4096)
    private String fncnBsnsNm;

    // 공고년월일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    @ExcelFieldProperty(fieldName = "공고일자", additionalWidth = 4096)
    private String pbanYmd;

    // 제안서 접수 마감 년월일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    @ExcelFieldProperty(fieldName = "제안서 접수 마감일", additionalWidth = 4096)
    private String prdoRccgYmd;

    // 담당 직원
    @ExcelFieldProperty(fieldName = "담당 직원", additionalWidth = 4096)
    private String rspbEmn;

    // 대표 연락처
    @ExcelFieldProperty(fieldName = "대표 연락처", additionalWidth = 4096)
    private String rprsCnplCon;

    // 공고상세 내용
    private String pbanDtlCon;

    // 파일고유번호
    private String fileUnqNo;

    // 삭제여부
    private String delYn;

    // 공고구분
    private String fncnBsnsDsnc;

    // 등록자
    @ExcelFieldProperty(fieldName = "등록자", additionalWidth = 4096)
    private String rgsrNm;

    // 등록일시
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    @ExcelFieldProperty(fieldName = "등록일", additionalWidth = 4096)
    private Timestamp iibsFrrgTs;

    // 등록ID
    private String iibsFrrgId;
}
