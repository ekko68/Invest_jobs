package com.ibk.sb.restapi.biz.service.ir.vo.finance;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.ir.vo.IrTabMain;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("IrFinanceVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IrFinanceVO extends BaseTableVO implements IrTabMain {

    /**
     * Table : TB_BOX_IVT_IR_F_FNAM_M
     * DESC : 기업IR 재무상태 정보
     */

    // 이력 저장 시퀀스
    @JsonIgnore
    private Integer mdphSqn;

    // 이용기관(회사) ID
    private String utlinsttId;

    // 당좌자산 금액
    private Long qckasAmt;

    // 재고자산 금액
    private Long inasAmt;

    // 기타 유동자산 금액
    private Long etcFlasAmt;

    // 투자자산 금액
    private Long ivasAmt;

    // 유형자산 금액
    private Long tgasAmt;

    // 무형자산 금액
    private Long itasAmt;

    // 기타 비유동자산 금액
    private Long etcNoneFlasAmt;

    // 유동부채 금액
    private Long crlbAmt;

    // 비유동부채 금액
    private Long noneCrlbAmt;

    // 자본금 금액
    private Long cpfnAmt;

    // 자본잉여금 금액
    private Long cpspMnyAmt;

    // 자본조정 금액
    private Long cpcrAmt;

    // 기타포괄손익 누계액
    private Long etcInlvPlCtam;

    // 이익잉여금 금액
    private Long ernspAmt;

    // 매출액
    private Long amslAmt;

    // 매출원가 금액
    private Long ampmAmt;

    // 매출총이익 금액
    private Long sltpAmt;

    // 판매관리비 금액
    private Long sacstAmt;

    // 영업이익 금액
    private Long opprAmt;

    // 영업외수익 금액
    private Long nnoeAmt;

    // 영업외비용 금액
    private Long nonopExpAmt;

    // 경상이익 금액
    private Long orpfAmt;

    // 법인세 금액
    private Long crtxAmt;

    // 당기순이익 금액
    private Long ctnpAmt;

    /**추가된 필드**/
    // 유동자산
    private Long flasAmt;

    // 비유동자산
    private Long noneFlasAmt;

    // 부채총계
    private Long lbltTtsmAmt;

    // 자본총계
    private Long cptsTtsmAmt;

    //============================

    // 자산총계 (유동자산 + 비유동자산)
    private Long astTtsmAmt;

    // 부채와 자본총계
    private Long lbltCptsTtsm;


    /** 채무정보 **/
    private List<IrDebtVO> debtList;
    // 진행률 계산용
    @JsonIgnore
    private int calDebtList;


    //============================

    /** @Builder 사용을 위한 super 필드 */
    private String rgsnUserId;
    private String amnnUserId;

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;


    /** IR 재무정보 탭 진행률 비중 계산
     * 재무상태표 5%
     * 부채상태표 5%
     * 손익계산서 5%
     * 주요채무현황 (list) 5%
     */
    @Override
    public int calcIRTabProgress() {

        int sum = 0;

        // 재무 상태표
        Long[] financeTable = {
                // 유동자산
                this.flasAmt, this.qckasAmt, this.inasAmt, this.etcFlasAmt,
                // 비유동자산
                this.noneFlasAmt, this.ivasAmt, this.tgasAmt, this.itasAmt, this.etcNoneFlasAmt,
                // 자산총계
                this.astTtsmAmt
        };

        // 부채 상태표
        Long[] debtTable = {
                // 부채 총계
                this.lbltTtsmAmt, this.crlbAmt, this.noneCrlbAmt,
                // 자본 총계
                this.cpfnAmt, this.cpspMnyAmt, this.cpcrAmt, this.etcInlvPlCtam, this.ernspAmt,
                // 부채와 자본총계
                this.lbltCptsTtsm
        };

        // 손익계산서
        Long[] profitLoss = {
                this.amslAmt, this.ampmAmt, this.sltpAmt, this.sacstAmt, this.opprAmt, this.nnoeAmt, this.nonopExpAmt, this.orpfAmt, this.crtxAmt, this.ctnpAmt
        };

        Long[][] totalArr = {financeTable, debtTable, profitLoss};

        for(Long[] arrItem : totalArr) {
            boolean cntFlg = true;
            for(Long item : arrItem) {
                if(item == null) cntFlg = false;
            }
            sum = cntFlg ? ++sum : sum;
        }

        // 주요채무현황
        if(this.debtList != null && this.debtList.size() > 0 && this.calDebtList > 0) {
            sum = ++sum;
        }

        // 진행도 계산 (각 5%)
        return sum * 5;
    }
}
