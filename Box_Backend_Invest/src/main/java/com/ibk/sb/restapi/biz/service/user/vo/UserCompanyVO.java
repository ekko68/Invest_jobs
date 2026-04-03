package com.ibk.sb.restapi.biz.service.user.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("UserCompanyVO")
public class UserCompanyVO {

    /**
     * Table : FFPC_UTLINSTT_USER_MAPNG
     * DESC : 사업장과 개인회원의 연관데이터 관리
     */

    // 메인BOX 사용자의 ID
    private String userId;

    // 이용기관(회사)에 부여되는 ID
    private String utlinsttId;

    // 권한코드, 총괄관리자 :C, 관리자:M, 직원:U
    private String authorCode;

    // 초대사용권한
    private String ivtAuthorAt;

    // 스토어구매사용권한
    private String purchsAuthorAt;

    // 디폴트여부
    private String dfltAt;

    // 대표사업장여부
    private String reprsntBplcAt;

    // 최초 등록한 이용기관ID
    private String registUtlinstt;

    // 최초 등록한 등록자ID
    private String registId;

    // 최초 등록할 때의 일시
    private String registDt;

    // 최초의 등록이용기관 이후 수정한 기관
    private String updtUtlinstt;

    // 등록자 이후 수정시 해당 수정자의 ID
    private String updtId;

    // 등록 이후 수정할 때의 일시
    private String updtDt;

    /** JOIN **/
    // 투자박스 기업, 투자사 구분 필드
    private String utlinsttType;
    
    // 이용기관명
    private String bplcNm;

    // 이용기관 사업자번호
    private String bizrno;

    // 이용기관 로고 파일
    @JsonIgnore
    private String logoImageFile;
    private String logoImageUrl;

}
