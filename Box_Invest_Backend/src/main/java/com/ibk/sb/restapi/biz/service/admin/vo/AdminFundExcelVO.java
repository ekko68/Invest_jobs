package com.ibk.sb.restapi.biz.service.admin.vo;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminRCmdExcelVO.AdminRCmdExcelVOBuilder;

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
@Alias("AdminFundExcelVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminFundExcelVO extends BaseTableVO implements ExcelFormReflect{
	
	// 이용기관(회사) 
    private String utlinsttId;
    
    // 펀드ID
    private String fundId;
    
    // 펀드명 
    @ExcelFieldProperty(fieldName = "제안번호", additionalWidth = 4096)
    private int seq;
    
    // 펀드명 
    @ExcelFieldProperty(fieldName = "펀드명", additionalWidth = 4096)
    private String fundNm;
    
    // 운용사명  
    @ExcelFieldProperty(fieldName = "운용사명", additionalWidth = 4096)
    private String prnNm;

    // 작성일
    @ExcelFieldProperty(fieldName = "제안일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp wody;

    // 결성목표액 
    @ExcelFieldProperty(fieldName = "금액", additionalWidth = 4096)
    private String orgzTrgpftNm;
    
    private Integer orgzTrgpft;
    
    // 심사단계
    @ExcelFieldProperty(fieldName = "상태", additionalWidth = 4096)
    private String auditStgNm;
    
    private String auditStg;
    
    // 진행단계
    private String progrsStg;

    // 등록일
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    
    // 등록자 ID 
    private String rgsnUserId;
    
    // 수정일 
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp amnnTs;
    
    // 수정자 ID 
    private String amnnUserId;
    
}
