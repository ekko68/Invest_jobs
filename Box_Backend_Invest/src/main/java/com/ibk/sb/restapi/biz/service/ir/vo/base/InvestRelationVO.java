package com.ibk.sb.restapi.biz.service.ir.vo.base;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.ir.vo.IrTabMain;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.springframework.util.StringUtils;

import javax.validation.constraints.NotBlank;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("InvestRelationVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestRelationVO extends BaseTableVO implements IrTabMain {

    /**
     * Table : TB_BOX_IVT_IR_B_BSIN_M
     * DESC : 기업IR 기본 정보
     */

    // 이력 저장 시퀀스
    @JsonIgnore
    private Integer mdphSqn;

    // 이용기관(회사) ID
    private String utlinsttId;

    // 사업자명
    private String bnnm;

    // 기업 구분
    private String enprDsncCd;
    private String enprDsncNm;

    // 사업자등록번호
    private String bzn;

    // 설립일자
    private String col;

    // 대표자명
    private String rprnm;

    // 직원수
    private Integer empCnt;

    // 업종명
    private String btnm;

    // 법인등록번호
    private String cgn;

    // 연락처
    private String cnpl;

    // 홈페이지URL주소
    private String hmpgUrlAdr;

    // 주소
    private String adr;

    // 우편번호
    private String zpcd;

    // 자본금 금액
    private Long cpfnAmt;

    // 액면가 금액
    private Long pvprAmt;

    // 총발행 주식수
    private Long ttisStcnt;

    // 결산기
    private String acpr;

    // 기업가치금액
    private Long etvlAmt;

    // 투자금 사용용도
    private String invmMnyUsus;

    // 투자회수 계획 내용
    // private String planCon
    private String invmRtrvPlanCon;
    
    /** 투자유치, 기관지원금 정보 **/
    // 투자유치 정보
    private List<IrInvestVO> investList;
    // 진행률 계산용
    @JsonIgnore
    private int calInvestList;

    // 기관지원금 정보
    private List<IrSupportFundVO> supportList;
    // 진행률 계산용
    @JsonIgnore
    private int calSupportList;



    //============================

    /** @Builder 사용을 위한 super 필드 */
    private String rgsnUserId;
    private String amnnUserId;

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;

    /** IR 기본정보 탭 진행률 비중 계산
     * 자본금 5%
     * 투자금 사용용도 5%
     * EXIT 계획 5%
     */
    @Override
    public int calcIRTabProgress() {

        int sum = 0;

        // 자본금
        sum = this.cpfnAmt != null ? ++sum : sum;
        // 투자금 사용용도
        sum = StringUtils.hasLength(this.invmMnyUsus) ? ++sum : sum;
        // 투자회수 계획 내용
        sum = StringUtils.hasLength(this.invmRtrvPlanCon) ? ++sum : sum;

        // 투자유치
        // sum = calInvestList > 0 ? ++sum : sum;

        // 기관지원금
        // sum = calSupportList > 0 ? ++sum : sum;

        // 진행도 계산 (각 5%)
        return sum * 5;
    }
}
