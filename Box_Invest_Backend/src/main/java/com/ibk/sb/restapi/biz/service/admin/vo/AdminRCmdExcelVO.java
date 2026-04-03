package com.ibk.sb.restapi.biz.service.admin.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;

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
@Alias("AdminRCmdExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminRCmdExcelVO extends BaseTableVO implements ExcelFormReflect {
	
	@ExcelFieldProperty(fieldName = "NO", additionalWidth = 4096)
	private int seq;   //순번
	
	@ExcelFieldProperty(fieldName = "회사", additionalWidth = 4096)
	private String etnm;   //회사명 
	
	@ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
	private String bznRes;   //사업자번호
	
	private String bzn;   //사업자번호 
	
	@ExcelFieldProperty(fieldName = "재무담당자 명", additionalWidth = 4096)
	private String rsprNm;   //기업 담당자명 
	
	@ExcelFieldProperty(fieldName = "재무담당자 연락처", additionalWidth = 4096)
	private String rsprCnplTpn;   //담당자 연락처 
	
	@ExcelFieldProperty(fieldName = "추천투자기관", additionalWidth = 4096)
	private String invmEnprNm;  
	
	@ExcelFieldProperty(fieldName = "추천일", additionalWidth = 4096)
	private String rgsnDt;  
	
	@ExcelFieldProperty(fieldName = "상태", additionalWidth = 4096)
	private String recomendSttusCmNm;   //진행상태코드
	
	private String recomendSttusCm;   //진행상태코드
}
