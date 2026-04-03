package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormReflect;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("EtcInptItmMngmVO")
public class EtcInptItmMngmVO extends BaseTableVO implements ExcelFormReflect {

    @Builder.Default
    private String utlinsttId= " ";

    @Builder.Default
    @ExcelFieldProperty(fieldName = "조회구분", additionalWidth = 4096)
    private String dsncNm = " ";
    
    private String dsnc= " ";
    @Builder.Default
    @ExcelFieldProperty(fieldName = "기타입력 값", additionalWidth = 4096)
    private String inpiItm= " ";

    @Builder.Default
    @ExcelFieldProperty(fieldName = "회사명", additionalWidth = 4096)
    private String cmpnNm= " ";
    @Builder.Default
    @ExcelFieldProperty(fieldName = "사업자등록번호", additionalWidth = 4096)
    private String bzn= " ";
    @ExcelFieldProperty(fieldName = "등록자명", additionalWidth = 4096)
    private String rgsrNm;

    @ExcelFieldProperty(fieldName = "등록일", additionalWidth = 4096)
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    
    private String rgsrId;

    private String amnnId;
    
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
    private Timestamp amnnTs;


}
