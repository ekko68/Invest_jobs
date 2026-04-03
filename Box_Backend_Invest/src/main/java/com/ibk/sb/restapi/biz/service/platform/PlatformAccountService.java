package com.ibk.sb.restapi.biz.service.platform;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenLoginFeign;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenAccountFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.account.*;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAccountService {

    private final BoxOpenAccountFeign boxOpenAccountFeign;
    private final BoxOpenLoginFeign boxOpenLoginFeign;

    /**
     * 권한별 이용기관 사용자 목록 조회
     * @param utlinsttId
     * @param authCodeEnum
     * @return
     * @throws Exception
     */
    public List<UsisUserVO> searchUsisUserListByAuth (String utlinsttId, IvtCode.MainBoxUserUsisAuthEnum authCodeEnum) throws Exception {

        // RequestBody 설정
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("appId", "");
        requestMap.put("utlinsttId", utlinsttId);
        requestMap.put("authorCode", authCodeEnum.getCode());

        // MNB 알림 대상 리스트 조회 API 호출
        BoxListResponseVO<UsisUserVO> responseVO = boxOpenAccountFeign.getUserListByUsisAndAuthor(requestMap);

        if(responseVO == null) throw new BizException(StatusCode.COM0001);
        if(responseVO.getSTATUS() == null || !responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", responseVO.getMESSAGE());
            throw new BizException(StatusCode.MNB0001);
        }

        // list return
        return responseVO.getRSLT_LIST() == null ? new ArrayList<>() : responseVO.getRSLT_LIST();
    }

    /**
     * 메인BOX 기업정보 조회 By 기업 ID
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public MainCompanyVO searchMainCompanyById(String utlinsttId) throws Exception {

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("utlinsttId", utlinsttId);

        return searchMainCompany(requestBody);
    }

    /**
     * 메인BOX 기업정보 조회 By 사업자번호
     * 사업자번호에 따른 이용기관은 중복되지 않는다는 전제하에 세팅
     * @param bizrno
     * @return
     * @throws Exception
     */
    public MainCompanyVO searchMainCompanyByBizNum(String bizrno) throws Exception {

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("bizrno", bizrno);

        return searchMainCompany(requestBody);
    }

    /**
     * 메인BOX 기업정보 조회
     * @param requestBody
     * @return
     * @throws Exception
     */
    public MainCompanyVO searchMainCompany(Map<String, String> requestBody) throws Exception {
        BoxListResponseVO<MainCompanyVO> responseVO = boxOpenAccountFeign.getMainBoxUtlinsttInfo(requestBody);

        if(responseVO == null) throw new BizException(StatusCode.COM0001);
        if(responseVO.getSTATUS() == null || !responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", responseVO.getMESSAGE());
            throw new BizException(StatusCode.COM9998,  responseVO.getMESSAGE());
        }

        // 통신은 되었지만 데이터가 없는 경우 null 전송
        // -> Exception 처리로 하는 경우 try-catch 처리를 하더라도 tx에 롤백마크가 터지기에 각 서비스에 대해 null 처리를 하는 것으로
        // (참여중인 트랜잭션에서 예외 발생 바로 잡지 않고 던지면 rollback only 마킹이 걸리기에)
        if(!(responseVO.getRSLT_LIST() != null && responseVO.getRSLT_LIST().size() > 0)) {
            return null;
        } else {
            // 로고 이미지 파일 세팅
            MainCompanyVO result = responseVO.getRSLT_LIST().get(0);
            result.setLogoImageFile(
                    StringUtil.hasLengthWithTrim(result.getCmpnyLogoImageFile())
                    ? result.getCmpnyLogoImageFile() : result.getCmpnyLogoBassImageFile()
            );
            return result;
        }
    }

    /**
     * 메인BOX 사용자 정보 조회
     * @param userId
     * @return
     * @throws Exception
     */
    public MainUserVO searchMainUser(String userId, String utlinsttId) throws Exception {

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);
        requestBody.put("utlinsttId", utlinsttId); // 기업 아이디와 함께 보내는 경우 매핑되는 기업정보 및 권한정보가 함께 옴

        BoxResponseVO<MainUserVO> responseVO = boxOpenAccountFeign.getMainBoxUserInfo(requestBody);

        if(responseVO == null) throw new BizException(StatusCode.COM0001);
        if(responseVO.getSTATUS() == null || !responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", responseVO.getMESSAGE());
            throw new BizException(StatusCode.COM9998, responseVO.getMESSAGE());
        }

        // 통신은 되었지만 데이터가 없는 경우 null 전송
        // -> Exception 처리로 하는 경우 try-catch 처리를 하더라도 tx에 롤백마크가 터지기에 각 서비스에 대해 null 처리를 하는 것으로
        // (참여중인 트랜잭션에서 예외 발생 바로 잡지 않고 던지면 rollback only 마킹이 걸리기에)
        return responseVO.getRSLT_DATA();
    }

    /**
     * 사용자 세션 정보 조회
     * 2023.02.24 추가
     * auth 코드 로그인
     * @param param
     * @return
     * @throws Exception
     */
    public Map<String, Object> selectUserSessionInfo(Map<String, String> param) throws Exception {

        Map<String, Object> resultMap = boxOpenLoginFeign.selectUserSessionInfo(param);
        if(resultMap == null) throw new BizException(StatusCode.COM0001);

        // 스테이터스가 올바르지 않을 경우 에러
        if(resultMap.get("STATUS") == null || !resultMap.get("STATUS").equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", resultMap.get("RSLT_MSG").toString());
            throw new Exception(StatusCode.COM9998.getMessage());
        }

        return (Map<String, Object>) resultMap.get("RSLT_LIST");
    }

    /**
     * (공통로그인) 사용자 세션 정보 조회
     * 2023.03.20 추가
     * SI 코드 로그인
     * @param accessToken
     * @return
     * @throws Exception
     */
//    public Map<String, Object> selectUserSessionInfo(String accessToken) throws Exception {
//
//        Map<String, Object> resultMap = boxOpenLoginFeign.selectUserSessionInfo("Bearer " + accessToken);
//        if(resultMap == null) throw new BizException(StatusCode.COM0001);
//
//        if(resultMap.get("userId") == null || resultMap.get("utlInsttId") == null) {
//            log.error("Box Platform Api Error Message : {}", resultMap.get("RSLT_MSG").toString());
//            throw new Exception(StatusCode.COM9998.getMessage());
//        }
//        return resultMap;
//    }
}