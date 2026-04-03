package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestListBodyAdminVO<T> {

    private List<T> list;
    private String params;
    private AdminUserVO adminUser;
}
