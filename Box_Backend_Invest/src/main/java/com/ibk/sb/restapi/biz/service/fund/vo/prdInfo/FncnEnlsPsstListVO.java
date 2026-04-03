package com.ibk.sb.restapi.biz.service.fund.vo.prdInfo;

import java.sql.Timestamp;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Alias("FncnEnlsPsstListVO")
@JsonIgnoreProperties({
    "delYn", "imgUrl", "totalCnt", "rnum", "rvsRnum", "totalCnt",
    "amnnUserNm", "rgsnUserNm", "imgFileId"
})
@ToString
public class FncnEnlsPsstListVO extends BaseTableVO {
	
	// 펀드ID
	private String fundId;
	
	// 순번
	private int sqn;
	
	// 출자기관
	private String invstInst;
	
	// 출자금액
	private String invstMny;
	
	// 비율
	private float rate;
	
	// 진행단계
	private String progrsStg;
	
	// 등록일
	private Timestamp rgsnTs;
	
	// 등록자
	private String rgsnUserId;
	
	// 수정일
	private Timestamp amnnTs;
	
	// 수정자
	private String amnnUserId;

}
