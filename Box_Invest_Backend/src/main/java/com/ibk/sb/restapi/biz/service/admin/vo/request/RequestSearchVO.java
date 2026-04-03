package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchVO")
public class RequestSearchVO extends PageVO {

    private String searchContent;       // 조회 조건 (내용)
    private String searchUser;          // 조회 조건 (작성자)
}
