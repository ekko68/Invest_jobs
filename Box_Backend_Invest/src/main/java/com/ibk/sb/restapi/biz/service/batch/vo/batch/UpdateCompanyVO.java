package com.ibk.sb.restapi.biz.service.batch.vo.batch;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;
import java.time.LocalDate;

@Getter
@Setter
@Alias("UpdateCompanyVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class UpdateCompanyVO extends BaseTableVO {

    // 이용기관 ID
    private String utlinsttId;

    // 이용기관 명
    private String bplcNm;

    // 이용기관의 설립일자
    private String fondDe;


    /** 2023.03 배치 추가 필드 */

    // 이용기관 로고 이미지
    private String cmpnyLogoImageFile;

    // 이용기관 로고 기본 이미지 파일
    private String cmpnyLogoBassImageFile;

    // 이용기관 소재 우편번호
    private String postNo;

    // 이용기관 소재 주소
    private String adres;

    // 이용기관 소재 상세주소
    private String detailAdres;

    // 이용기관 소재 도로명주소
    private String nwAdres;

    // 이용기관 소재 도로명주소 상세
    private String nwAdresDetail;

    // 도로명 주소 사용여부
    private String nwAdresAt;


    /** 2023.05 배치 추가 필드 */

    // 사업자등록 번호
    private String bizrno;

    // 이용기관 활동 여부
    private String actAt;

    // 기업 가입 날짜
    private String registDt;

    // 기업 가입 날짜(DB)
    private Date enprJnngDt;
}
