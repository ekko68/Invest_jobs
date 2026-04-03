package com.ibk.sb.restapi.biz.service.admin.vo.request;

import org.apache.ibatis.type.Alias;

import com.ibk.sb.restapi.app.common.vo.PageVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("RequestPrplcmVO")
public class RequestPrplcmVO extends PageVO {

	private String searchContent;       // 조회 조건 (내용)
    private String searchUser;          // 조회 조건 (작성자)
    private String searchStatus;		// 조회 조건 (상태)
}
