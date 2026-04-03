package com.ibk.sb.restapi.biz.service.platform;

import com.ibk.sb.restapi.app.annotation.SkipCheckTxAspect;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.BadgeListVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenAlarmFeign;
import com.ibk.sb.restapi.biz.service.platform.repo.InvestAlarmRepo;
import com.ibk.sb.restapi.biz.service.platform.vo.account.UsisUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.*;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxMsgResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.RequestAlarmResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAlarmService {

    /*
    투자박스 알림발송 분류 코드 (MNB)
     */

    // 투자박스 알림 발송 중분류 코드 (혁신기업투자)
    @Value("${adp.alarm.mddv.ivt.code}")
    private String ALRT_MDDV_CD_INVEST;
    // BOX 서비스 구분 코드
    private final String IBKBOX_SVC_DCD = "IV";
    // BOX 알림 대분류
    private final String ALRT_LRDV_DCD_BOX = "0003";


    private final InvestAlarmRepo investAlarmRepo;
    private final BoxOpenAlarmFeign alarmFeign;
    private final PlatformAccountService platformAccountService;

    /**
     * 투자박스 알림 리스트 조회
     * @param page
     * @param record
     * @param alrtAllYnEnum
     * @return
     * @throws Exception
     */
    public BadgeListVO<ReceiveAlarmVO> searchReceiveInvestHeaderAlarmList(Integer page, Integer record, IvtCode.YnTypeEnum alrtAllYnEnum) throws Exception {

        page = (page != null && page > 0)  ? page : 1;
        record = (record != null && record > 0) ? record : 10;

        // 리스트 조회
        // cnt는 현재 건수, 페이지 번호가 아님 (inqCnt는 조회건수 이므로 record 그대로)
        int cnt = (page - 1) * record;
        BoxListResponseVO<ReceiveAlarmVO> responseVO = searchReceiveInvestAlarmList(cnt, record, alrtAllYnEnum);

        // result set
        BadgeListVO<ReceiveAlarmVO> resultList = new BadgeListVO<>();
        resultList.setList(responseVO.getRSLT_DATA());
        // 현재 수신건수 조회가 전체 분류에 대해서만 이뤄지므로 더 조회가능한지 여부를 마지막 조회에서의 사이즈 여부로 체크해야함
        resultList.setIsMoreYn(resultList.getList().size() > 0 ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        // 신규 미수신건 확인
        resultList.setUnreadYn(searchUnreadReceiveInvestAlarm() ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return resultList;
    }

    /**
     * TO-BE 투자박스 알림 수신 유무 확인
     * @return
     * @throws Exception
     */
    public boolean searchUnreadReceiveInvestAlarm() throws Exception {
        // 리스트 조회
        // 신규 읽지 않은 알림만 체크하므로 cnt : 0, inqCnt : 1, alrtAllYn : "N"
        BoxListResponseVO<ReceiveAlarmVO> responseVO = searchReceiveInvestAlarmList(0, 1, IvtCode.YnTypeEnum.N);

        if(responseVO.getRSLT_DATA().size() > 0) return true;
        else return false;
    }

    /**
     * 투자박스 알림 리스트 조회 공통
     * @param cnt
     * @param inqCnt
     * @param alrtAllYnEnum
     * @return
     * @throws Exception
     */
    public BoxListResponseVO<ReceiveAlarmVO> searchReceiveInvestAlarmList(int cnt, int inqCnt, IvtCode.YnTypeEnum alrtAllYnEnum) throws Exception{

        // 로그인 유저 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Request Setting
        Map<String, String> requestMap = new HashMap<>();

        // 이용기관 아이디
        requestMap.put("usisId", user.getUserGroupId());
        // 사용자 아이디
        requestMap.put("idmbId", user.getUsername());
        // 현재 건수, 페이지 번호가 아님
        requestMap.put("cnt", Integer.toString(cnt));
        // 조회 건수 (레코드수)
        requestMap.put("inqCnt", Integer.toString(inqCnt));
        // 알림 전체 여부 ("N"일 경우 미수신 알림 리스트만 조회)
        requestMap.put("alrtAllYn", alrtAllYnEnum.name());

        // 투자박스는 투자박스 알림 목록만 조회
        requestMap.put("alrtLrdvDcd", ALRT_LRDV_DCD_BOX); // 대분류 : BOX
        requestMap.put("alrtMddvCd", ALRT_MDDV_CD_INVEST); // 중분류 : 혁신기업투자

        // 리스트 조회
        BoxListResponseVO<ReceiveAlarmVO> responseVO = alarmFeign.getInvestBoxReceiveAlarmList(requestMap);
        if(responseVO == null) throw new BizException(StatusCode.COM0001);
        if(responseVO.getSTATUS() == null || !responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", responseVO.getMESSAGE());
            throw new BizException(StatusCode.COM0001);
        }

        return responseVO;
    }

    /**
     * 투자박스 알림 전송
     * @param requestAlarmVO
     * RequestVO : 알림 아이디, 알림 타이틀, 알림 내용, 링크는 각 서비스 단에서 설정
     * @param usisId
     * @return
     * @throws Exception
     */
    public InvestAlarmSendResultVO sendInvestAlarm(RequestAlarmVO requestAlarmVO, String usisId, AdminUserVO adminUserVO) throws Exception {

        // 투자박스 알림 분류 세팅
        requestAlarmVO.setAlrtLrdvDcd(ALRT_LRDV_DCD_BOX);
        requestAlarmVO.setAlrtMddvCd(ALRT_MDDV_CD_INVEST);
        requestAlarmVO.setIbkboxSvcDcd(IBKBOX_SVC_DCD);

        // 알림여부 Y, 푸시여부 N
        requestAlarmVO.setAlrtYn(IvtCode.YnTypeEnum.Y.name());
        requestAlarmVO.setPushYn(IvtCode.YnTypeEnum.N.name());

        // 시스템 아이디 세팅
        requestAlarmVO.setSysLsmdId("admin");

        // 현재시간 세팅
        Date now = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        requestAlarmVO.setAlrtSndgTs(dateFormat.format(now).toString().substring(0, 12));

        /*
        알림 발송 대상
        투자박스 : 이용기관 기준 총괄관리자(C) 전체
         */
        // 수신자 권한 코드 (총괄관리자 고정)
        requestAlarmVO.setRcvrDcd(IvtCode.MainBoxUserUsisAuthEnum.CEO.getCode());

        // TODO : 메인박스에서 이용기관 ID, 권한코드(C)에 따른 아이디 리스트 조회 API 배포 후 서비스 수정
        // usisId 사용
        List<UsisUserVO> targetList = platformAccountService.searchUsisUserListByAuth(usisId, IvtCode.MainBoxUserUsisAuthEnum.CEO);
        requestAlarmVO.setArray(targetList.stream()
                .map(RequestAlarmTargetVO::new)
                .collect(Collectors.toList()));
        requestAlarmVO.setArrayCnt(Integer.toString(targetList.size()));

        // 발송이력 저장 확인 후 발송번호(alrtSndgNo), 성공여부 저장
        // Caution : 알림 발송 이후이기 때문에 Exception에 의한 Transaction Rollback 주의
        // Exception이 일단 발생할 경우 Transaction이 실패로 인식되어 Rollback이 되므로 BizException 처리 X

        // 발송 이력 저장
        String sndgAlrtId = UUID.randomUUID().toString();
        String rgsnUserId = adminUserVO == null ? ((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername() : adminUserVO.getAdminUserId();
//        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        investAlarmRepo.insertInvestAlarmSendHistory(new InvestAlarmSendHistoryVO(requestAlarmVO, sndgAlrtId, rgsnUserId));

        // 수신 대상 이력 저장
        targetList.forEach(targetVO -> {
            investAlarmRepo.insertInvestAlarmTarget(new InvestAlarmTargetVO(targetVO, sndgAlrtId, rgsnUserId));
        });

        // 알림 발송
        RequestAlarmResponseVO responseVO = alarmFeign.postSendAlarm(requestAlarmVO);
        if(!StringUtil.hasLengthWithTrim(responseVO.getAlrtRcvCnt())) responseVO.setAlrtRcvCnt("0");
        if(!StringUtil.hasLengthWithTrim(responseVO.getAlrtRcvRfslCnt())) responseVO.setAlrtRcvRfslCnt("0");

        return new InvestAlarmSendResultVO(responseVO, sndgAlrtId, rgsnUserId);
    }

    /**
     * 알림 발송 결과 저장
     * (호출 서비스 + 알림발송)에 트랜잭션 예외발생 rollback 상황을 분리하기 위한 메서드
     *
     * 1.만약 Mapper에서 예외가 발생할 경우 Service로 throw 되는 시점에서 rollback 마크 생성
     *      -> 전파 속성을 REQUIRES_NEW으로 처리하여 부모 Tx와 분리
     *      +  try-catch로 부모 Tx로 전파 막음 (부모 Tx에 try-catch를 일일히 하지 않기 위해 해당 서비스에 설정)
     *
     * 2.동일 Bean 내 호출에 대해서는 @Transactional, Spring AOP로 처리한 Tx설정이 적용이 되지 않음
     *      -> Service Bean을 분리하거나 알림 sendInvestAlarm와 saveInvestAlarmSendResult을 호출 메서드에서 각각 호출 (후자선택)
     *
     * @param resultVO
     * @throws Exception
     */
    @SkipCheckTxAspect
    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {Exception.class})
    public void saveInvestAlarmSendResult(InvestAlarmSendResultVO resultVO) {
        try {
            investAlarmRepo.insertInvestAlarmSendResult(resultVO);
        } catch (BizException bx) {
            log.error("Fail Save Message Result (Business Exception code : {}) : {}", bx.getErrorCode(), bx.getErrorMsg());
        } catch (Exception ex) {
            log.error("Fail Save Message Result : {}", ex.getMessage());
        }
    }

    /**
     * 투자박스 알림 수신 확인
     * @param alrtSndgNo
     * @return
     * @throws Exception
     */
    public boolean checkReceiveAlarm(String alrtSndgNo) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // RequestBody 세팅
        RequestCheckAlarmVO requestVO = new RequestCheckAlarmVO();

        requestVO.setIdmbId(user.getUsername());
        requestVO.setUsisId(user.getUserGroupId());

        // 전체 수신완료 체크 (N)
        // 현재 기타 알림은 보여주지 않으므로
        requestVO.setAlrtAllYn(IvtCode.YnTypeEnum.N.name());

        // 수신 알림 체크
        if(StringUtils.hasLength(alrtSndgNo)) {
            requestVO.setList(Arrays.asList(alrtSndgNo));
        }

        // api 호출
        BoxMsgResponseVO response = alarmFeign.postCheckAlarm(requestVO);
        if(response == null) throw new BizException(StatusCode.COM0001);
        if(response.getSTATUS() == null || !response.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Box Platform Api Error Message : {}", response.getRSLT_MSG());
            throw new BizException(StatusCode.MNB0001);
        }

        // 투자박스 알림 수신 유무 체크 (리랜더링 필요할 경우를 위해)
        return searchUnreadReceiveInvestAlarm();
    }
}
