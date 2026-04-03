package com.ibk.sb.restapi.biz.service.batch.vo.batch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAgreementCompanyVO {

    // 이용기관(회사)에 부여되는 ID
    private String utlinsttId;

    // 사업자를 식별하는 고유번호
    private String bizrno;

    // 법인등록번호
    private String jurirno;

    // infotech 인증서 키
    private String clientCertKey;
}
