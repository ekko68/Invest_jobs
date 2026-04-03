package com.ibk.sb.restapi.biz.service.admin.vo;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("AdminConvertVcHistoryVO")
public class AdminConvertVcHistoryVO extends BaseTableVO {
    // 이용기관 ID
    private String utlinsttId;
    // 시퀀스
    private Integer mdphSqn;
    // 투자사 타입
    private String invmCmpPtrnCd;
    // 투자사 유무
    private String useYn;

    private String rgsnUserId;
    private String amnnUserId;


    // JOIN
    private String bzn;
    private String bplcNm;
}
