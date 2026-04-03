package com.ibk.sb.restapi.biz.service.vncmloan.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VncmLoanAplcCountVO")
public class VncmLoanAplcCountVO {
    private String rowCountAll; // 모든 데이터 갯수
    private String rowCountByStatus; // status에 해당하는 데이터 갯수
}
