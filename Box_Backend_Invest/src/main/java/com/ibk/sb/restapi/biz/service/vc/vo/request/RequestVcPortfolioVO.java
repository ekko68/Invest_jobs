package com.ibk.sb.restapi.biz.service.vc.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@Alias("RequestVcPortfolioVO")
public class RequestVcPortfolioVO extends PageVO {

    private String utlinsttId;

    private String oppbYn;

    public RequestVcPortfolioVO(PageVO pageVO) {
        super(pageVO.getPage(), pageVO.getRecord(), pageVO.getPageSize());
    }

}
