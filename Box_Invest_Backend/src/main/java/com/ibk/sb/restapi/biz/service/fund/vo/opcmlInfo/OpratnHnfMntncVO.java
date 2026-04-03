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
@Alias("OpratnHnfMntncVO")
@ToString
@JsonIgnoreProperties({
    "delYn", "imgUrl", "imgFileId", "rnum", "rvsRnum"
})
public class OpratnHnfMntncVO extends BaseTableVO{
	
	private String fundId;
	
	private Integer sqn;
	
	private String opratnHnfNm;
	
	private String nowHffcYn;
	
	private String rm;
	
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp rgsnTs;
	
	private String rgsnUserId;
	
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp amnnTs;
	
	private String amnnUserId;

}
