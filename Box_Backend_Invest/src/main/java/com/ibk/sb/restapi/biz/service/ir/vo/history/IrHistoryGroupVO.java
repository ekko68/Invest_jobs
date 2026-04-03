package com.ibk.sb.restapi.biz.service.ir.vo.history;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("IrHistoryGroupVO")
public class IrHistoryGroupVO {

    /** 연혁정보 연도별 그룹 VO **/

    // 연혁 그룹 연도
    private String year;
    
    // 연혁 정보 리스트
    private List<IrHistoryVO> historyList;

}
