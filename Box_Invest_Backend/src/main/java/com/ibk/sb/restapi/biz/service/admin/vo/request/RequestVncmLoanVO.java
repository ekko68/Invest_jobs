package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestVncmLoanVO")
public class RequestVncmLoanVO extends PageVO {

    private String searchComNm;       		// 회사명
    private String searchRcmdEnrpBzn;       // 사업자번호
    private String searchRecomendSttus;     // 추천상태
    private String searchUtlinsttId;        // 이용기관 ID
    private String startDate;        		// 투자 유치 내역 조회 시작일
    private String endDate;        			// 투자 유치 내역 조회 마지막일
}
