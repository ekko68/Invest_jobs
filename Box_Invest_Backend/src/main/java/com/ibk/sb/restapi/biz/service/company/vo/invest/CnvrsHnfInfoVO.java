package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("CnvrsHnfInfoVO")
public class CnvrsHnfInfoVO {
    @Builder.Default
    private String utlinsttId = " ";      // 	이용기관(회사) ID
    @Builder.Default
    private String invmHnfInfoCd = " ";   //  투자사 인력 정보 구분 코드(신규)
    @Builder.Default
    private String sqn = " ";             // 	순번
    @Builder.Default
    private String invmHnfNm = " ";       // 	성명
    @Builder.Default
    private String tpn = " ";             // 	전화번호
    @Builder.Default
    private String ead = " ";             // 	이메일

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;       // 	등록일
    @Builder.Default
    private String rgsrId = " ";          // 	동록자
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;       //  수정자
    @Builder.Default
    private String amnnId = " ";          // 	수정일

}
