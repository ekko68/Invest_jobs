package com.ibk.sb.restapi.biz.service.vc.vo.base;

import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcAuditExecuteChartVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcPreferenceChartVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("VentureCapitalVO")
public class VentureCapitalDetailVO {

    // 투자사 기본 정보
    private VentureCapitalBasicVO basicData;

    // 총 투자집행 건수
    private Integer invmPrfrCnt;

    // 투자 집행 금액
    private Long invmAmt;

    // 투자 집행 금액 (단위 처리)
    private String invmAmtStr;

    // 투자 집행 금액 공개여부
    private String oppbYn;

    // 선호 투자 유형 정보 -> 기획 정보 확인 필요
    private List<VcPreferenceChartVO> pfrcChartList;

    // 총 투자집행 그래프 정보
    private List<VcAuditExecuteChartVO> execChartList;

}
