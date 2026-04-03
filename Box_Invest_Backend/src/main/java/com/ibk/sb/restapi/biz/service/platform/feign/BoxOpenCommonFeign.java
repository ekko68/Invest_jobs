package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxpBprFileCrtRealtimeOutVo;
import com.ibk.sb.restapi.biz.service.admin.vo.BprFileCrtRealtimeVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.*;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxPageResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@FeignClient(
        name = "box-open-api-com",
        url = "${feign.box-open-api.url}",
        configuration = FeignBoxKeyConfig.NoKeyConfig.class)
public interface BoxOpenCommonFeign {

    /**
     * BOX 파일 정보 조회
     * 기존 투자박스 파일 이관시 사용
     * @param body
     * @return
     */
    @PostMapping(value = "/api/cm/v1/cms124/fileApndCtlgInq", headers = {"appKey=${feign.mnb-api.key}"})
    BoxFileResVO getBoxFileInfo(@RequestBody Map<String, String> body);


    /**
     * IBK 공통 코드 목록 조회
     * @param body
     * @return
     */
    @PostMapping(value = "/api/apt/v1/cmmmng/comCdCtlgInq", headers = {"appKey=${feign.ivt-api.key}"})   // api 사용 신청, 키는 메인박스 키 사용(기존)
    BoxPageResponseVO<IbkCodeVO> getIbkComCodeList(@RequestBody Map<String, String> body);

    /**
     * 계정계 기술등급에 따른 접수신청 제어
     * @param body
     * @return
     */
    @PostMapping(value = "/api/ibk/v1/ibkbox/cntlTchnGrdRcipAplc", headers = {"appKey=${feign.ivt-api.key}"})
    TcbResultVO getIbkCtrlRcipByTcb(@RequestBody Map<String, String> body);

    /**
     * IBK 영업점 검색 (담당 영업점명 조회)
     * response member 중 DATA의 경우 STATUS가 0000일 경우 Array로 반환되나 그 외의 경우 Object로 반환됨
     * -> VO를 사용하지 않고 STAUTS가 0000일 경우에만 ObjectMapper로 처리
     * @param body
     * @return
     */
    @PostMapping(value = "/api/cm/v1/cmi012/rspbBobNmDtlInq", headers = {"appKey=${feign.ivt-api.key}"})
    HashMap<String, Object> getIbkBrncInfo(@RequestBody Map<String, String> body);
//    BoxListResponseVO<IbkBranchVO> getIbkBrncInfo(@RequestBody Map<String, String> body);

    /**
     * IBK 영업점 직원 검색 (계정계 부점직원정보조회)
     * @param body
     * @return
     */
    @PostMapping(value = "/api/ibk/v1/ibkbox/inpBrncEmpInfo", headers = {"appKey=${feign.ivt-api.key}"})
    IbkBrncEmpResVO getIbkBrncEmpInfo(@RequestBody Map<String, String> body);


    /**
     * 이용약관 상세 조회 (return : fileMngmNo)
     * @param body
     * @return
     */
    @PostMapping(value = "/api/cm/v1/cps014/selDiffDetail", headers = {"appKey=${feign.ivt-api.key}"})
    BoxResponseVO<BoxFileResVO> getTermsFileNumber (@RequestBody Map<String, String> body);

    /**
     * 실시간 BPR 파일 전송 (return : BoxpBprFileCrtRealtimeOutVo)
     * @param bprVO
     * @return
     */
    @PostMapping(value = "/api/cm/v1/cmi014/bprFileCrtRealtime", headers = {"appKey=${feign.ivt-api.key}"})
    BoxpBprFileCrtRealtimeOutVo bprFileCrtRealtime (@RequestBody BprFileCrtRealtimeVO.BprVO bprVO);
}
