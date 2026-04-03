package com.ibk.sb.restapi.biz.service.nda.vo;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormInttVO {

    // Eform 이용기관 설정 정보
    private String inttNm;      // 기관명
    private String inttAdr;     // 기관주소
    private String signData;    // 기관 서명 데이터
    private String signprsnNm;  // 기관 대표자명
}
