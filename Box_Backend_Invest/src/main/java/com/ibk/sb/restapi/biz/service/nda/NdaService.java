package com.ibk.sb.restapi.biz.service.nda;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.TargetCompanyVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.nda.repo.NdaRepo;
import com.ibk.sb.restapi.biz.service.nda.vo.FormInttVO;
import com.ibk.sb.restapi.biz.service.nda.vo.NdaVO;
import com.ibk.sb.restapi.biz.service.nda.vo.RequestSearchNdaVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VentureCapitalBasicVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
@RequiredArgsConstructor
public class NdaService {

    private final NdaRepo ndaRepo;
    private final InvestAuditService auditService;
    private final VentureCapitalService ventureCapitalService;

    private final MessageSource messageSource;
    private final PlatformAlarmService platformAlarmService;

    /**
     * NDA 목록 조회
     *
     * @param requestSearchNdaVO
     * @param transmitTypeEnum
     * @return
     * @throws Exception
     */
    public BadgePagingVO<NdaVO> searchNdaList(RequestSearchNdaVO requestSearchNdaVO, IvtCode.TransmitTypeEnum transmitTypeEnum) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // NDA 리스트 조회
        if (transmitTypeEnum == IvtCode.TransmitTypeEnum.RECEIVE) {
            requestSearchNdaVO.setRcvInttId(user.getUserGroupId());
            requestSearchNdaVO.setSearchType(IvtCode.TransmitTypeEnum.RECEIVE.name());
        } else if (transmitTypeEnum == IvtCode.TransmitTypeEnum.SEND) {
            requestSearchNdaVO.setDsmsInttId(user.getUserGroupId());
            requestSearchNdaVO.setSearchType(IvtCode.TransmitTypeEnum.SEND.name());
        }

        // NDA 목록 조회
        List<NdaVO> ndaList = ndaRepo.selectNdaList(requestSearchNdaVO);
        ndaList = ndaList == null ? new ArrayList<>() : ndaList;

        // 카운트 조회용 Request set
        RequestSearchNdaVO searchCntRequest = new RequestSearchNdaVO();
        searchCntRequest.setPgrsSttsCd(ComCode.NDA_STANDBY.getCode());
        searchCntRequest.setDsmsInttId(user.getUserGroupId());
        searchCntRequest.setRcvInttId(user.getUserGroupId());

        // 뱃지 카운트 조회 및 설정
        Map<String, Integer> badgeCntMap = new HashMap<>();
        searchCntRequest.setSearchType(IvtCode.TransmitTypeEnum.RECEIVE.name());
        badgeCntMap.put(IvtCode.TransmitTypeEnum.RECEIVE.name(), ndaRepo.selectNdaListStatusCnt(searchCntRequest));
        searchCntRequest.setSearchType(IvtCode.TransmitTypeEnum.SEND.name());
        badgeCntMap.put(IvtCode.TransmitTypeEnum.SEND.name(), ndaRepo.selectNdaListStatusCnt(searchCntRequest));

        // 페이징 설정 및 리턴
        return new BadgePagingVO<>(requestSearchNdaVO, ndaList, badgeCntMap.get(transmitTypeEnum.name()), badgeCntMap);
    }

    /**
     * 로그인 이용기관 NDA Form 설정 정보 조회
     * @return
     * @throws Exception
     */
    public FormInttVO searchExsitNdaFormData() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업의 경우 IR 정보에서 조회
        if(user.getUserGroupType().equals(IvtCode.UsisTypeEnum.COMPANY.getType())) {
            InvestRelationVO enprIrData = ndaRepo.selectNdaFormEnprInitData(user.getUserGroupId());

            return FormInttVO.builder()
                    .inttNm(StringUtils.hasLength(enprIrData.getBnnm()) ? enprIrData.getBnnm() : "")
                    .signData("")
                    .signprsnNm(StringUtils.hasLength(enprIrData.getRprnm()) ? enprIrData.getRprnm() : "")
                    .inttAdr(StringUtils.hasLength(enprIrData.getAdr())
                            ? (enprIrData.getAdr() + (StringUtils.hasLength(enprIrData.getZpcd()) ? " (" + enprIrData.getZpcd() + ")" : ""))
                            : "")
                    .build();
        }
        // 투자사의 경우 메인박스 정보에서 조회
        else if(user.getUserGroupType().equals(IvtCode.UsisTypeEnum.VC.getType())) {
            VentureCapitalBasicVO invmData = ventureCapitalService.searchVcBasicData(user.getUserGroupId());
            invmData.setUtlinsttId(user.getUserGroupId());
            invmData = ventureCapitalService.setVCBasicPlatformInfo(invmData);

            return FormInttVO.builder()
                    .inttNm(StringUtil.hasLengthWithTrim(invmData.getBplcNm()) ? invmData.getBplcNm() : "")
                    .signData("")
                    .signprsnNm(StringUtil.hasLengthWithTrim(invmData.getRprsntvNm()) ? invmData.getRprsntvNm() : "")
                    .inttAdr(StringUtil.hasLengthWithTrim(invmData.getAddr())
                            ? (invmData.getAddr() + (StringUtil.hasLengthWithTrim(invmData.getPostNo()) ? " (" + invmData.getPostNo() + ")" : ""))
                            : "")
                    .build();
        }

        return null;
    }

    /**
     * NDA 상세 조회
     *
     * @param ndaCnttId
     * @return
     * @throws Exception
     */
    public NdaVO searchNda(String ndaCnttId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // NDA 정보 조회
        NdaVO ndaVO = ndaRepo.selectNda(ndaCnttId);
        if (ndaVO == null) throw new BizException(StatusCode.MNB0003);

        // 수신 혹은 발신 기관인지 확인
        if (!ndaVO.getDsmsInttId().equals(user.getUserGroupId()) && !ndaVO.getRcvInttId().equals(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);

        // 프론트 Eform 팝업을 위한 투자요청기업, 투자기관 매핑
        FormInttVO enprSetData = null;
        FormInttVO invmSetData = null;

        if(user.getUserGroupType().equals(IvtCode.UsisTypeEnum.COMPANY.getType())) {
            if(user.getUserGroupId().equals(ndaVO.getDsmsInttId())) {
                enprSetData = ndaVO.getDsmsSetFormInttData();
                invmSetData = ndaVO.getRcvSetFormInttData();
            } else {
                invmSetData = ndaVO.getDsmsSetFormInttData();

                // 대기상태 + 수신대상 기업일 경우 eform 조회를 위해 기업명, 대표자, 주소 정보 미리 설정
                if(ndaVO.getPgrsSttsCd().equals(ComCode.NDA_STANDBY.getCode())) {
                    enprSetData = searchExsitNdaFormData();
                } else {
                    enprSetData = ndaVO.getRcvSetFormInttData();
                }
            }
        }
        else if (user.getUserGroupType().equals(IvtCode.UsisTypeEnum.VC.getType())) {
            if(user.getUserGroupId().equals(ndaVO.getDsmsInttId())) {
                enprSetData = ndaVO.getRcvSetFormInttData();
                invmSetData = ndaVO.getDsmsSetFormInttData();
            } else {
                enprSetData = ndaVO.getDsmsSetFormInttData();

                // 대기상태 + 수신대상 기업일 경우 eform 조회를 위해 기업명, 대표자, 주소 정보 미리 설정
                if(ndaVO.getPgrsSttsCd().equals(ComCode.NDA_STANDBY.getCode())) {
                    invmSetData = searchExsitNdaFormData();
                } else {
                    invmSetData = ndaVO.getRcvSetFormInttData();
                }
            }
        }

        if(enprSetData != null) {
            ndaVO.setEnprNm(enprSetData.getInttNm());
            ndaVO.setEnprAdr(enprSetData.getInttAdr());
            ndaVO.setEnprSign(enprSetData.getSignData());
            ndaVO.setEnprSignprsnNm(enprSetData.getSignprsnNm());
        }

        if(invmSetData != null) {
            ndaVO.setInvmNm(invmSetData.getInttNm());
            ndaVO.setInvmAdr(invmSetData.getInttAdr());
            ndaVO.setInvmSign(invmSetData.getSignData());
            ndaVO.setInvmSignprsnNm(invmSetData.getSignprsnNm());
        }

        return ndaVO;
    }

    /**
     * NDA 서명 데이터 조회 (Base64)
     *
     * @param ndaCnttId
     * @return
     * @throws Exception
     */
//    public NdaVO searchNdaSignData(String ndaCnttId) throws Exception {
//
//        // 로그인 정보 조회
//        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//        // NDA Sign Data (Base64 Data) 조회
//        NdaVO ndaVO = ndaRepo.selectNdaSignData(ndaCnttId);
//
//        // 수신 혹은 발신 기관인지 확인
//        if (!ndaVO.getDsmsInttId().equals(user.getUserGroupId()) && !ndaVO.getRcvInttId().equals(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);
//
//        return ndaVO;
//    }

    /**
     * NDA 제출
     *
     * @param ndaVO
     * @throws Exception
     */
    public void requestNdaSign(NdaVO ndaVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 대상기관 유무 확인
        if (!StringUtils.hasLength(ndaVO.getRcvInttId())) throw new BizException(StatusCode.MNB0002);

        // 서명 확인
        if (!StringUtils.hasLength(ndaVO.getDsmsInttSignFile())) throw new BizException(StatusCode.MNB0002);

        // 대상기관이 NDA 가능 대상인지 확인 (심사중 혹은 심사완료 상태인 상대기관)
        List<TargetCompanyVO> targetCompanyList = auditService.searchAuditNdaTargetCompanyList();
        Optional<TargetCompanyVO> target = targetCompanyList.stream().filter(x -> x.getUtlinsttId().equals(ndaVO.getRcvInttId())).findAny();
        if (!target.isPresent()) throw new BizException(StatusCode.COM0005);

        // 등록 설정 정보 추가
        // NDA 아이디
        ndaVO.setNdaCnttId(UUID.randomUUID().toString());

        // 등록자 정보
        ndaVO.setDsmsInttId(user.getUserGroupId());
        ndaVO.setRgsnUserId(user.getUsername());
        ndaVO.setAmnnUserId(user.getUsername());

        // 상태코드
        ndaVO.setPgrsSttsCd(ComCode.NDA_STANDBY.getCode());

        // NDA 요청 정보 등록
        ndaRepo.insertRequestNdaSign(ndaVO);

        /*
         NDA 알림 전송
         */
        requestNdaAlarm(ndaVO.getNdaCnttId(), AlarmCode.AlarmCodeEnum.NDA_REQUEST,
                user.getUserGroupType().equals(IvtCode.UsisTypeEnum.COMPANY.getType()) ? IvtCode.UsisTypeEnum.VC : IvtCode.UsisTypeEnum.COMPANY);
    }

    /**
     * NDA 최종 서명 제출
     *
     * @param ndaVO
     * @throws Exception
     */
    public void acceptNdaSign(NdaVO ndaVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 서명정보, 서류 파일 확인
        if (!StringUtils.hasLength(ndaVO.getRcvInttSignFile())) throw new BizException(StatusCode.MNB0002);
        if (!StringUtils.hasLength(ndaVO.getNdaPtdfFileId())) throw new BizException(StatusCode.MNB0002);

        // 기존 정보 조회
        if (!StringUtils.hasLength(ndaVO.getNdaCnttId())) throw new BizException(StatusCode.MNB0003);
        NdaVO beforeData = ndaRepo.selectNda(ndaVO.getNdaCnttId());

        // 상태 조회 (대기 상태인지)
        if (!beforeData.getPgrsSttsCd().equals(ComCode.NDA_STANDBY.getCode())) throw new BizException(StatusCode.COM0005);

        // 기관 유효성 검사
        if (beforeData == null) throw new BizException(StatusCode.MNB0003);
        if (!beforeData.getRcvInttId().equals(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);

        // 추가 정보 설정
        ndaVO.setAmnnUserId(user.getUsername());
        ndaVO.setPgrsSttsCd(ComCode.NDA_COMPLETE.getCode());

        // 최종서명정보 갱신
        ndaRepo.updateAcceptNdaSign(ndaVO);

        /*
        NDA 알림 전송
         */
        requestNdaAlarm(ndaVO.getNdaCnttId(), AlarmCode.AlarmCodeEnum.NDA_CHANGE_STEP,
                user.getUserGroupType().equals(IvtCode.UsisTypeEnum.COMPANY.getType()) ? IvtCode.UsisTypeEnum.VC : IvtCode.UsisTypeEnum.COMPANY);
    }

    /**
     * NDA 미체결(반려) 처리
     *
     * @param ndaCnttId
     * @throws Exception
     */
    public void cancelNdaSign(String ndaCnttId) throws Exception {

        if (!StringUtils.hasLength(ndaCnttId)) throw new BizException(StatusCode.MNB0003);

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기존 정보 조회
        NdaVO beforeData = ndaRepo.selectNda(ndaCnttId);

        // 유효성 검사
        if (beforeData == null) throw new BizException(StatusCode.MNB0003);
        if (!beforeData.getPgrsSttsCd().equals(ComCode.NDA_STANDBY.getCode())) throw new BizException(StatusCode.COM0005);
        if (!beforeData.getRcvInttId().equals(user.getUserGroupId()) && !beforeData.getDsmsInttId().equals(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);

        // NDA 반려처리
        ndaRepo.cancelNdaRequest(ndaCnttId, ComCode.NDA_CANCEL.getCode(), user.getUsername());

        /*
        NDA 알림 전송
         */
        requestNdaAlarm(ndaCnttId, AlarmCode.AlarmCodeEnum.NDA_CHANGE_STEP,
                user.getUserGroupType().equals(IvtCode.UsisTypeEnum.COMPANY.getType()) ? IvtCode.UsisTypeEnum.VC : IvtCode.UsisTypeEnum.COMPANY);
    }

    /**
     * NDA 알림 전송 공통 메서드
     *
     * @param ndaCnttId
     * @param alarmCodeEnum
     * @param targetTypeEnum
     * @throws Exception
     */
    public void requestNdaAlarm(String ndaCnttId, AlarmCode.AlarmCodeEnum alarmCodeEnum, IvtCode.UsisTypeEnum targetTypeEnum) throws Exception {

        // NDA 정보 조회
        NdaVO resultNdaVO = ndaRepo.selectNda(ndaCnttId);

        // 알림 아이디, 제목, base url 설정
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(
                alarmCodeEnum,
                targetTypeEnum == IvtCode.UsisTypeEnum.COMPANY
                        ? AlarmCode.AlarmLinkEnum.NDA_DETAIL_COMPANY_URL
                        : AlarmCode.AlarmLinkEnum.NDA_DETAIL_VC_URL
        );

        // 알림 메시지 템플릿 배열 정보 설정
        Object[] templateArr = null;
        if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.NDA_REQUEST) {
            templateArr = new Object[]{resultNdaVO.getDsmsInttNm()};
        } else if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.NDA_CHANGE_STEP) {
            templateArr = new Object[]{resultNdaVO.getDsmsInttNm(), resultNdaVO.getRcvInttNm(), resultNdaVO.getPgrsSttsNm()};
        }

        // 알림 url, 알림 내용 설정
        requestAlarmVO.setPcLinkUrlCon(requestAlarmVO.getPcLinkUrlCon() + ndaCnttId);
        requestAlarmVO.setAlrtCon(messageSource.getMessage(
                alarmCodeEnum.getTemplateId()
                , templateArr
                , null
        ));

        // 알림 발송
        // NDA 요청의 경우 체결 대상 이용기관 쪽으로 알림이 감, 그 외 반려 최종체결의 경우 최초 요청 이용기관 쪽으로 알림이 감
        InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO,
                alarmCodeEnum == AlarmCode.AlarmCodeEnum.NDA_REQUEST ? resultNdaVO.getRcvInttId() : resultNdaVO.getDsmsInttId(), null);
        // 알림 이력 저장
        platformAlarmService.saveInvestAlarmSendResult(alarmResult);
    }

}
