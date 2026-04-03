package com.ibk.sb.restapi.biz.service.consult;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.consult.repo.ConsultRepo;
import com.ibk.sb.restapi.biz.service.consult.vo.ConsultingSummaryVO;
import com.ibk.sb.restapi.biz.service.consult.vo.RequestSearchConsultingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConsultService {

    private final ConsultRepo consultRepo;

    /** ================================ CRUD ================================ **/

    /** 컨설팅 **/

    /**
     * 컨설팅 신청하기
     */
    public void saveConsultingApply(ConsultingVO consultingVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 컨설팅 등록
        consultingVO.setCnsgReqsId(UUID.randomUUID().toString());   // 컨설팅 아이디
        consultingVO.setReqsInttId(user.getUserGroupId());  // 의뢰기관
        consultingVO.setCnsgSttsCd(ComCode.CONSULT_STANDBY.getCode()); // 컨설팅 상태 : 대기
        consultingVO.setRgsnUserId(user.getUsername()); // 등록 및 수정 사용자 정보
        consultingVO.setAmnnUserId(user.getUsername());
        consultingVO.setRgsnUserNm(user.getUserNm());

        consultRepo.insertConsultingRequest(consultingVO);
    }

    /** 마이페이지 **/

    /**
     * 컨설팅 목록 조회
     * @param requestVO
     * @return
     * @throws Exception
     */
    public PagingVO<ConsultingSummaryVO> searchCompanyConsultingList(RequestSearchConsultingVO requestVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 리스트 목록 조회
        requestVO.setReqsInttId(user.getUserGroupId());
        List<ConsultingSummaryVO> consultingList = consultRepo.selectCompanyConsultingList(requestVO);

        return new PagingVO<>(requestVO, consultingList == null ? new ArrayList<>() : consultingList);
    }

    /**
     * 컨설팅 상세 정보 조회
     * @param consultingId
     * @return
     */
    public ConsultingVO searchCompanyConsulting(String consultingId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 컨설팅 정보 조회
        ConsultingVO consultingVO = consultRepo.selectCompanyConsulting(consultingId);

        // 유효성 검사
        if(consultingVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }
        if(!consultingVO.getReqsInttId().equals(user.getUserGroupId())) {
            throw new BizException(StatusCode.COM0005);
        }

        return consultingVO;
    }

    /**
     * 사용자 컨설팅 정보 수정
     * 사용자가 수정할 수 있는 컨설팅은 '대기'상태에 국한됨
     * @param consultingVO
     * @throws Exception
     */
    public void updateConsulting(ConsultingVO consultingVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기존 컨설팅 정보 조회 및 유효성 검사
        if(!StringUtils.hasLength(consultingVO.getCnsgReqsId())) {
            throw new BizException(StatusCode.COM0005);
        }

        ConsultingVO beforeData = consultRepo.selectCompanyConsulting(consultingVO.getCnsgReqsId());

        if(beforeData == null) {
            throw new BizException(StatusCode.MNB0003);
        }
        if(!beforeData.getReqsInttId().equals(user.getUserGroupId())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 대기 상태인지 확인
        if(!beforeData.getCnsgSttsCd().equals(ComCode.CONSULT_STANDBY.getCode())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 컨설팅 정보 업데이트
        consultingVO.setReqsInttId(user.getUserGroupId());
        consultingVO.setAmnnUserId(user.getUsername());
        consultRepo.updateConsultingRequest(consultingVO);
    }

    /**
     * 컨설팅 취소
     * 사용자 단위에서 취소 또한 대기상태에서만 가능
     * @param consultingId
     * @throws Exception
     */
    public void cancelConsulting(String consultingId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기존 컨설팅 정보 조회 및 유효성 검사
        ConsultingVO beforeData = consultRepo.selectCompanyConsulting(consultingId);

        if(beforeData == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 대기 상태인지 확인
        if(!beforeData.getCnsgSttsCd().equals(ComCode.CONSULT_STANDBY.getCode())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 컨설팅 상태 취소로 변경
        consultRepo.updateConsultingStatus(consultingId, user.getUserGroupId(), ComCode.CONSULT_CANCEL.getCode(), user.getUsername());
    }
}
