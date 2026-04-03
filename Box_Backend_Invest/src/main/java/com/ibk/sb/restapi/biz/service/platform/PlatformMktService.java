package com.ibk.sb.restapi.biz.service.platform;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenMktFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.product.CommerceSellerProductVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.RequestSellerProductVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformMktService {

    private final BoxOpenMktFeign boxOpenMktFeign;

    /**
     * 커머스박스 판매자 스토어 목록 조회
     * @param request
     * @return
     * @throws Exception
     */
    public PagingVO<CommerceSellerProductVO> searchCommerceSellerProductList(RequestSellerProductVO request) throws Exception {

        // 이용기관 아이디 확인
        if(!StringUtils.hasLength(request.getSelrUsisId())) throw new BizException(StatusCode.COM0005);

        // 커머스 판매자 스토어 개별상품목록 조회
        ResponseData<PagingVO<CommerceSellerProductVO>> response = boxOpenMktFeign.searchCommerceSellerProductList(request);

        // 오류 확인
        if (!(response != null && response.getCode().equals(Integer.toString(HttpStatus.OK.value())))) {
            throw new BizException(StatusCode.MNB0001);
        }

        // 조회 결과 반환
        return response.getData();
    }

    /**
     * 커머스박스 인감정보 조회
     *
     * @return
     * @throws Exception
     */
    public CommerceSealVO searchCommerceSealInfo() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 커머스 박스 인감 정보 조회
        ResponseData<CommerceSealVO> responseData = boxOpenMktFeign.searchCommerceSealInfo(user.getUserGroupId());

        // 오류 확인
        if (!(responseData != null && responseData.getCode().equals(Integer.toString(HttpStatus.OK.value())))) {
            throw new BizException(StatusCode.MNB0001);
        }

        // 조회 결과 반환
        return responseData.getData();
    }

    /**
     * 커머스박스 인감정보 등록
     *
     * @return
     * @throws Exception
     */
    public CommerceSealVO saveCommerceSealInfo(CommerceSealVO commerceSealVO) throws Exception {

        // 로그인 정보 조회 및 설정
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        commerceSealVO.setRgsnUserId(user.getUsername());
        commerceSealVO.setAmnnUserId(user.getUsername());
        commerceSealVO.setUtlinsttId(user.getUserGroupId());

        // 커머스박스 인감정보 등록
        ResponseData<CommerceSealVO> responseData = boxOpenMktFeign.saveCommerceSealInfo(commerceSealVO);

        // 오류 확인
        if (!(responseData != null && responseData.getCode().equals(Integer.toString(HttpStatus.OK.value())))) {
            throw new BizException(StatusCode.MNB0001);
        }

        // 등록 결과 반환
        return responseData.getData();
    }

    /**
     * 커머스박스 인감정보 삭제
     * 인감 파일 아이디의 경우 호출 서비스에서 기존 인감정보 확인 후 입력
     * @throws Exception
     */
    public void deleteCommerceSealInfo(CommerceSealVO commerceSealVO) throws Exception {

        // 인감 파일 아이디 검사
        if(!StringUtils.hasLength(commerceSealVO.getRgslImgFileId())) throw new BizException(StatusCode.COM0005);

        // 로그인정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        commerceSealVO.setAmnnUserId(user.getUsername());
        commerceSealVO.setUtlinsttId(user.getUserGroupId());

        // 커머스박스 인감정보 삭제
        ResponseData responseData = boxOpenMktFeign.deleteCommerceSealInfo(commerceSealVO);

        // 오류 확인
        if (!(responseData != null && responseData.getCode().equals(Integer.toString(HttpStatus.OK.value())))) {
            throw new BizException(StatusCode.MNB0001);
        }
    }

}
