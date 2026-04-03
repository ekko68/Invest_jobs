package com.ibk.sb.restapi.biz.service.ir.vo;

import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.IrExtraVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryGroupVO;
import com.ibk.sb.restapi.biz.service.ir.vo.member.IrMemberVO;
import com.ibk.sb.restapi.biz.service.ir.vo.plan.IrPlanAndResultVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("IrPreviewVO")
public class IrPreviewVO {

    // 기본정보 탭
    private InvestRelationVO irBasicTab;

    // 연혁정보 탭
    private List<IrHistoryGroupVO> irHistoryTab;

    // 팀원정보 탭
    private List<IrMemberVO> irMemberTab;

    // 주주정보 탭
    private List<IrStockHolderVO> irStockHolderTab;

    // 재무정보 탭
    private IrFinanceVO irFinanceTab;

    // 제품/기술/시장 탭
    private IrExtraVO irExtraTab;

    // 성과/계획 탭
    private IrPlanAndResultVO irPlanAndResultTab;

}
