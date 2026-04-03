package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.FncnInfoVO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestBodyAdminVO<T> {

//    private List<T> list;

    private T params;

    private AdminUserVO adminUser;

}
