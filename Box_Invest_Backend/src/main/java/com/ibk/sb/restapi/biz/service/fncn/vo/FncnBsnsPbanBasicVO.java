package com.ibk.sb.restapi.biz.service.fncn.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("FncnBsnsPbanBasicVO")
@ToString
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnUserNm", "rgsnTs", "amnnUserId", "amnnUserNm",
        "amnnTs", "totalCnt", "rnum", "rvsRnum", "imgFileId", "imgUrl"
})
public class FncnBsnsPbanBasicVO extends BaseTableVO { // TB_BOX_IVT_IVB001_M

    // 출자사업공고 번호
    private String fncnBsnsPbanNo;

    // 출자사업공고 제목명
    private String fncnBsnsPbanTtlNm;

    // 출자사업공고 구분코드
    private String fncnBsnsPbanDcd;

    // 출자사업명
    private String fncnBsnsNm;

    // 공고년월일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private String pbanYmd;

    // 제안서 접수 마감 년월일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private String prdoRccgYmd;

    // 담당 직원 번호
    private String rspbEmn;

    // 대표 연락처
    private String rprsCnplCon;

    // 공고상세 내용
    private String pbanDtlCon;

    // 파일고유번호
    private String fileUnqNo;

    // 삭제여부
    private String delYn;
    
    // 등록자
    private String rgsrNm;

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
    
    // 모집분야 리스트
    List<FncnBsnsEnlsFildVO> fncnBsnsEnlsFild;

    // 파일 리스트
    List<ComFileInfoVO> fileList;

}
