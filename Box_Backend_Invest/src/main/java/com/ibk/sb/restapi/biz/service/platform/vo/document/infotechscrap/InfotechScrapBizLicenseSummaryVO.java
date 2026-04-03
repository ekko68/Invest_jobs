package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class InfotechScrapBizLicenseSummaryVO {

    /**
     * 인포텍 스크래핑 사업자등록증명 데이터 중
     * 투자박스 IR 매핑에 해당하는 부분
     *
     * 그 외의 항목은 스펙문서 참조
     */

    // 오류여부
    private String errYn;

    // 오류메시지
    private String errMsg;

    // 발급번호
    private String cerCvaIsnNo;

    // 사업자구분
    private String bmanClNm;

    // 상호(법인명)
    private String txprNm;

    // 사업자등록번호
    private String txprDscmNoEncCntn;

    // 대표자수
    private String jntBmanCnt;

    // 대표자명
    private String rprsTxprNm;

    // 주민등록번호
    private String cvarRprsResno;

    // IBK API 문서는 주민번호가 crpno로 되어있음... <- 해당 사항에 대해서는 이전 시스템즈 담당자 분께 전달은 했었음
    // 인포텍 스펙문서상 샘플데이터는 법인번호가 crpno
    // 실제 조회 결과도 crpno가 법인번호
    // 사업자가 법인번호가 없는 경우에는 주민번호가 대신 들어가는 것 같음
    // 투자박스의 경우 법인만 이용이 가능하므로 우선 사용
    // 법인등록번호
    private String crpno;

    // 사업장소재지
    private String etcDadr;

    // 사업장소재지
    private String cvarRoadNmAdr;

    // 사업장소재지
    private String cvarLdAdr;

    // 사업장소재지코드
    private String bmanClCd;

    // 주소
    private String adr;

    // 개업일
    private String txprDscmDt;

    // 사업자등록일
    private String bmanRgtDt;

    // 업태
    private String bcNm;

    // 종목
    private String itmNm;
    // 공동사업자 관련 정보 (IBK API(INF-PS-205) 상 제외됨)
//    private CerIsnInqrSVO cerIsnInqrSVO;
    // 사업자등록증 정보
    private CerpBscInfrDVO cerpBscInfrDVO;
    // 사업자등록증 정보
    private BmanBscInfrInqrDVO bmanBscInfrInqrDVO;

    // 사업장 소재지 조회
    public String getScrapBizInfoAddr() {
        return this.bmanBscInfrInqrDVO.getBmanClCd().equals("08")
                ? this.bmanBscInfrInqrDVO.getEtcDadr()
                : StringUtils.hasLength(this.cerpBscInfrDVO.getCvarRoadNmAdr()) ? this.cerpBscInfrDVO.getCvarRoadNmAdr() : this.cerpBscInfrDVO.getCvarLdAdr();
    }

    // 대표자 성명 조회
    public String getScrapBizInfoRprsTxprNm() {
        return this.rprsTxprNm + (Integer.parseInt(this.jntBmanCnt) > 0 ? " 외 " + this.getJntBmanCnt() + "명" : "");
//        return this.bmanBscInfrInqrDVO.getRprsTxprNm() + (Integer.parseInt(this.cerIsnInqrSVO.getJntBmanCnt()) > 0 ? " 외 " + this.cerIsnInqrSVO.getJntBmanCnt() + "명" : "");
    }

    // 법인번호 조회
    // 개인사업자의 경우 IBK API를 거치며 crpno에 주민번호가 입력될 수 있으므로
    public String getScrapBizInfoCrpno() {
        return StringUtils.hasLength(this.bmanBscInfrInqrDVO.getCrpno()) ? this.bmanBscInfrInqrDVO.getCrpno() : "";
    }




    /**
     * 공동사업자 인원 판별 VO
     * 공동사업자 목록 정보는 jntBmanRprsCtlInqrOneDVOList 필드가 별도로 존재하지만
     * 현재 매핑 항목이 없으므로 제외
     * 추후 필요할 경우 해당 리스트는 내부 rows 필드가 상황에 따라 Array와 Object로 바뀌므로 주의
     *
     * 아래 해당 class 항목은 IBK API(INF-PS-205)상 수정되어 있음
     */
//    @Getter
//    @Setter
//    public class CerIsnInqrSVO {
//        // 공동사업자 수
//        private String jntBmanCnt;
//        private String tfbAddYn;
//        private String jntRprsList;
//    }


}
