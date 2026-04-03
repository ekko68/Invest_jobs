package com.ibk.sb.restapi.biz.service.company.vo.base;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyPreferenceVO")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyPreferenceVO {

    // 이용기관(회사) ID
    private String utlinsttId;
    // 선호 이용기관(회사) ID
    private String prfnUsisId;
    // 등록 사용자 ID
    private String rgsnUserId;
    // 등록 일시
    private String rgsnTs;
}
