package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyFavoriteVO")
public class CompanyFavoriteVO extends BaseTableVO {

    // 이용기관 아이디
    private String utlinsttId;

    // 즐겨찾기 이용기관 ID
    private String fvryUsisId;

    // front에서 넘겨받는 필드
    private String fvryYn;
}
