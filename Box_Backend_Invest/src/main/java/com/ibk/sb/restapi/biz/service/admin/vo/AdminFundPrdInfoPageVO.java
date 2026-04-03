package com.ibk.sb.restapi.biz.service.admin.vo;

import org.apache.ibatis.type.Alias;

import com.ibk.sb.restapi.app.common.vo.PageVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("AdminFundPrdInfoPageVO")
public class AdminFundPrdInfoPageVO extends PageVO {

    private String searchFund;      // 조회 조건 (펀드명)
    private String searchPrn;		// 조회 조건 (운용사명)
    private String auditStg;		// 심사단계
}
