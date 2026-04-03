package com.ibk.sb.restapi.biz.service.audit.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("TargetCompanyVO")
public class TargetCompanyVO {

    // 이용기관(회사)에 부여되는 ID
    private String utlinsttId;

    // 이용기관의 사업자명
    private String bplcNm;

    // 프론트 selectBox 처리용
    private String id; // 이용기관 ID
    private String value; // 이용기관 사업자명


    /**
     * stream distinct 사용을 위한 equals, hashCode 재정의
     * @param obj
     * @return
     */
    @Override
    public boolean equals(Object obj) {
        if(obj instanceof TargetCompanyVO) {
            return this.utlinsttId.equals(((TargetCompanyVO) obj).utlinsttId);
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return this.utlinsttId.hashCode();
    }
}
