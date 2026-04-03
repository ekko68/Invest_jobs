package com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("OpratnHnfInfoDscplLVO")
@ToString
public class OpratnHnfInfoDscplLVO extends BaseTableVO{
	
	// 펀드명
	private String fundId;
	
	// 일련번호
	private Integer sqn;
	
	// 이름
	private String name;
	
	// 리스크 관리경력
	private String rmdp;
	
	// 비고
	private String rmrk;
	
//	등록일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp rgsnTs;

	//	동록자ID
	private String rgsnUserId;

	//	수정일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp amnnTs;
	
	//	수정자ID
	private String amnnUserId;
}
