package com.ibk.sb.restapi.biz.service.fund.vo.prdInfo;

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
@Alias("PrmrLpChcFildVO")
@JsonIgnoreProperties({
    "delYn", "imgUrl", "totalCnt", "rnum", "rvsRnum", "totalCnt",
    "amnnUserNm", "rgsnUserNm", "imgFileId"
})
@ToString
public class PrmrLpChcFildVO extends BaseTableVO {
	
	//펀드ID
	private String fundId;
	
	//순번
	private Integer sqn;
	
	//출자기관
	private String invstInst;
	
	//지원분야
	private String sprnFild;
	
	//지원금액
	private Integer sprnAmt;
	
	//진행단계
	private String progrsStg;
	
	//등록일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp rgsnTs;
	
	//등록자ID
	private String rgsnUserId;
	
	//수정일
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Timestamp amnnTs;
	
	//수정자ID
	private String amnnUserId;
}
