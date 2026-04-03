package com.ibk.sb.restapi.biz.service.prplcm.vo;

import org.apache.ibatis.type.Alias;

import com.ibk.sb.restapi.app.common.vo.PageVO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Alias("RequestPropsalCompanyPageVo")
@NoArgsConstructor
public class RequestPropsalCompanyPageVo extends PageVO {
	
	private String userGroupId;
	private String cmpnNm;
	private String bizNum;
	
}
