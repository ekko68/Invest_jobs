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
@Alias("AdminAgisExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminAgisExcelVO extends BaseTableVO implements ExcelFormReflect {
	
	@ExcelFieldProperty(fieldName = "NO", additionalWidth = 4096)
	private int agremVnentrSeq; //시퀀스번호
	
	@ExcelFieldProperty(fieldName = "투자기관명", additionalWidth = 4096)
    private String invmEnprNm; //투자기관명
	
	@ExcelFieldProperty(fieldName = "사업자번호", additionalWidth = 4096)
	private String bznRes;	//사업자번호
	
	private String bzn;	//사업자번호
	
	@ExcelFieldProperty(fieldName = "협약체결일", additionalWidth = 4096)
    private String agremCnclsde;	//협약체결일
	
	@ExcelFieldProperty(fieldName = "협약 만기일", additionalWidth = 4096)
    private String agremExprtnde;	//협약 만기일

	@ExcelFieldProperty(fieldName = "협약여부", additionalWidth = 4096)
	private String agremYnNm;	//협약여부
	
	private String agremYn;	//협약여부
	
	@ExcelFieldProperty(fieldName = "협약서", additionalWidth = 4096)
	private String agrmntAtchmnflYn;	//협약서
	
    private String agrmntAtchmnfl;	//협약서

}
