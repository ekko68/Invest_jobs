package com.ibk.sb.restapi.biz.service.admin.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisExcelVO.AdminAgisExcelVOBuilder;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;

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
@Alias("AdminVCmdExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminVCmdExcelVO extends BaseTableVO implements ExcelFormReflect  {
	
	// 식별번호
	@ExcelFieldProperty(fieldName = "NO", additionalWidth = 4096)
    private int agremVnentrSeq;
    
    // 회사명
	@ExcelFieldProperty(fieldName = "회사명", additionalWidth = 4096)
    private String etnm;
    
    // 제안기업 사업자번호
	@ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
    private String bznRes;
	
	private String rcmdEnprBzn;

    // 투자기관명
	@ExcelFieldProperty(fieldName = "추천투자기관", additionalWidth = 4096)
    private String invmEnprNm;

    // 등록일
	@ExcelFieldProperty(fieldName = "추천일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyyMMdd", timezone = "Asia/Seoul")
    private String rgsnDt;
    
    // 추천 진행 상태
    private String recomendSttus;
    
    // 추천상태명
	@ExcelFieldProperty(fieldName = "상태", additionalWidth = 4096)
    private String recomendSttusNm;
}
