package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;


import com.ibk.sb.restapi.app.common.constant.IvtCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class FnstBrkdDVO {

    /**
     * 법인사업자 표준대차대조표, 표준손익계산서
     * 공통 VO
     */

    // 계정과목 관련 필드
    private String oowiClusNmYn;
    private String frmlClusNm;
    private String rptrInptAcntSbjCntn;

    // 코드
    private String frmlClusRfrnNo;

    // 금액
    private String debAmt;

    // 계정과목명 조회 (스펙문서기준)
    public String getSubjectName() {
        return StringUtils.hasLength(this.oowiClusNmYn) && this.oowiClusNmYn.equals(IvtCode.YnTypeEnum.N.name())
                ? this.frmlClusNm : this.rptrInptAcntSbjCntn;
    }

    /**
     * 표준대차대조표 코드 (법인 / 개인)
     * 유동자산 : 001 / 01
     * 당좌자산 : 002 / 92
     * 재고자산 : 044 / 18
     * 기타유동자산 : 067 / ?
     * 비유동자산 : 080 / 29
     * 투자자산 : 081 / 30
     * 유형자산 : 110 / 38
     * 무형자산 : 169 / 50
     * 기타비유동자산 : 194 / 55
     * 자산총계 : 228 / 62
     * 부채총계 : 333 / 87
     * 유동부채 : 229 / 63
     * 비유동부채 : 284 / 73
     * 자본총계 : 382 / 90
     * 자본금 : 334 / 88
     * 자본잉여금 : 337 / ?
     * 자본조정 : 348 / ?
     * 기타포괄순익 누계액 :  361 / ?
     * 이익잉여금 : 372 / ?
     * 부채와 자본총계 : 383 / 91
     */

    /**
     * 표준손익계산서 코드 (법인/개인)
     * 매출액 : 001 / 01
     * 매출원가 : 035 / 09
     * 매출총이익 : 066 / 20
     * 판매관리비 : 067 / 21
     * 영업이익 : 129 / 62
     * 영업외수익 : 130 / 63
     * 영업외비용 : 179 / 81
     * 경상이익 : ?
     * 법인세 : 218 / ?
     * 당기순이익 : 219 / ?
     */
}
