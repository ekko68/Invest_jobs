package com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("ProFundPartcptnVO")
@ToString
@JsonIgnoreProperties({
    "delYn", "imgUrl", "imgFileId", "rnum", "rvsRnum"
})
public class ProFundPartcptnVO extends BaseTableVO{
	
	private String fundId;
	
	private Integer sqn;

	private String hmrsDsnc;
	
	private String partcptnNm;
	
	private Integer invtCareer;
	
	private Integer cnwkYyCnt;
	
	private Integer fiveFyerInvmAmt;
	
	private Integer tenFyerInvmRtrvlacrsInvt;
	
	private Integer tenFyerInvmRtrvlacrsRtrvl;
	
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp rgsnTs;
	
	private String rgsnUserId;
	
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp amnnTs;
	
	private String amnnUserId;

}
