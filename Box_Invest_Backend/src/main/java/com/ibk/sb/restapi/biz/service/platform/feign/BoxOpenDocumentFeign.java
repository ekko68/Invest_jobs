package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechScpTemplateVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.InfotechClientKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.IntotechSaveCertResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceMnbKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceMnbSimpleDocVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestInfotechCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapBizLicenseSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapTxtnVatCerlsnVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceSimpleDocFileResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.RequestNiceMnbKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@FeignClient(
        name = "box-open-api-doc",
        url = "${feign.box-open-api.url}",
//        configuration = FeignBoxKeyConfig.MnbKeyConfig.class)
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenDocumentFeign {

    /*
    NICE SCRAPPING
     */

    /**
     * NICE 스크래핑 메인박스 인증키 조회
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/cms030/scpgRqstInq")
    NiceMnbKeyVO getMnbNiceSimpleDocKey(@RequestBody RequestNiceMnbKeyVO body);

    /**
     * NICE SCRAPPING 간편서류 목록 조회
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/invest/ffp/doc/list")
    BoxListResponseVO<NiceMnbSimpleDocVO> getNiceMnbSimpleDocList(@RequestBody Map<String, String> body);

    /**
     * NICE 파일 다운로드
     * @param pdfFilePth
     * @return
     */
    @GetMapping(value = "/api/nice/v1/ibkbox/orgPdf", headers = "appKey=${feign.mnb-api.key}") // 해당 부분은 mnb 키를 사용해야함
    NiceSimpleDocFileResponseVO getNiceSimpleDocFileInfo(@RequestParam("pdf_file_pth") String pdfFilePth);


    /*
    INFOTECH SCRAPPING
     */

    /**
     * 등록된 INFOTECH ClientKey 조회
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/kwf018/selectAtshInfo")
    BoxResponseVO<InfotechClientKeyVO> getInfotechClientKey(@RequestBody Map<String, String> body);

    /**
     * INFOTECH 사업자등록증 정보 조회
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/scp001/hometax/B0001")
    BoxResponseVO<InfotechScrapBizLicenseSummaryVO> getInfotechHometaxBizLicense(@RequestBody Map<String, String> body);

    /**
     * INFOTECH 표준재무제표증명 조회
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/scp001/hometax/B1003")
    BoxResponseVO<InfotechScrapFinanceSummaryVO> getInfotechHometaxFinancialStatements(@RequestBody Map<String, String> body);
    
    /**
     * INFOTECH 부가가치세 과세 표준증명서 조회
     * @param body
     * @return
     */
    @PostMapping(value="/api/cm/v1/scp001/hometax/B4009")
    BoxResponseVO<InfotechScrapTxtnVatCerlsnVO> getInfotechHometaxTxtnVatCerlsn(@RequestBody Map<String, String> body);

    /**
     * INFOTECH 인증서 등록
     * @param body
     * @return
     */
//    @PostMapping("/api/cm/v1/scp000/infotech/insert")
//    BoxResponseVO<IntotechSaveCertResultVO> postSaveInfotechCertificate(@RequestBody RequestInfotechCertVO body);

    /**
     * INFOTECH 인증서 등록 (MNB)
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/kwf018/insertAtshInfo")
    BoxResponseVO<IntotechSaveCertResultVO> postSaveInfotechCertificate(@RequestBody RequestInfotechCertVO body);

    /**
     * INFOTECH 인증서 수정 (MNB)
     * @param body
     * @return
     */
    @PostMapping("/api/mb/v1/kwf018/updateAtshInfo")
    BoxResponseVO<IntotechSaveCertResultVO> postUpdateInfotechCertificate(@RequestBody RequestInfotechCertVO body);

    /**
     * 메인박스 공통 스크래핑 (신규)
     * @param body
     * @return
     */
    @PostMapping(value = "/api/mb/v1/com006/scp")
    BoxListResponseVO<HashMap<String, Object>> getCmmScpData (@RequestBody Map<String, String> body);

    /**
     * VC추천딜 펀드제안 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/rgsnFundPrpl")
    Map<String, Object> postVcFundData(@RequestBody Map<String, Object> body);

    /**
     * VC추천딜 투자기업추천 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/rgsnEnprRcmd")
    Map<String, String> postVcPrplcmData(@RequestBody Map<String, String> body);

    /**
     * VC추천딜 펀드제안 취소 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/cnclFundPrpl")
    Map<String, Object> postVcFundCnclData(@RequestBody Map<String, Object> body);

    /**
     * VC추천딜 투자기업추천 취소 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/cnclEnprRcmd")
    Map<String, String> postVcPrplcmCnclData(@RequestBody Map<String, String> body);

    /**
     * 출자사업 공고 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/rgsnFncnBsnsPban")
    Map<String, Object> postFncnBsnsPbanData(@RequestBody Map<String, Object> body);

    /**
     * 출자사업 접수 정보 전송
     * @param body
     * @return
     */
    @PostMapping(value="/api/ibk/v1/ibkbox/rgsnFncnBsnsRcip")
    Map<String, Object> postFncnBsnsRcipData(@RequestBody Map<String, Object> body);
}
