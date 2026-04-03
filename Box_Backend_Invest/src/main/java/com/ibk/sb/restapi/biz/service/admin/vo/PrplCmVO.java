package com.ibk.sb.restapi.biz.service.admin.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("PrplCmVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class PrplCmVO extends BaseTableVO {

	private String utlinsttId; //이용기관 ID
	private String rcmdEnprBzn; //추천 기업 사업자번호
	private String rcmdId; //추천 ID - 순번
	private String prnNm; //운용사명
	private String chrgAudofir; //담당 심사역
	private String cnpl; //연락처
	private String ead; //이메일
	private String rcmdEnprNm; //추천 기업명
	private String mainBiz; //주요사업
	private String leadInvstrPrnNm; //리드투자자_운용사명
	private Integer leadInvstrAmount; //리드투자자_금액
	private String leadInvstrStep; //리드투자자_단계
	private String invmRndEndPnttm; //투자 라운드 종료시점
	private String totInvmCnfmnAmt; //총 투자 유치금액
	private Integer totInvmCnfmnAmtTo; //총 투자 유치금액2
	private String progrsValue; //진행밸류
	private Integer progrsValueTo; //진행밸류2
	private String recomendOpinion; //추천 의견
	private String oprtrCnfaYn; //운영자 읽음 여부
	private String sbmsStts; //취소여부
	private String sprnFild; //메모
	
//	private List<MultipartFile> atchmnfl;
	
	private List<ComFileInfoVO> atchmnfl2;
	
    private String atchmnfl;
}
