package com.ibk.sb.restapi.biz.service.company.vo.invest;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("CompanyInvestVO")
public class CompanyInvestVO {

    private CompanyInvestHopeVO investHope;

    private List<CompanyInvestFieldVO> investFieldList;

    private List<CompanyUtilTechVO> utilTechList;

}
