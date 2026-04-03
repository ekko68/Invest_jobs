package com.ibk.sb.restapi.biz.service.audit;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFieldProperty;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.BadgeListVO;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PassCheckData;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.audit.repo.InvestAuditRepo;
import com.ibk.sb.restapi.biz.service.audit.vo.*;
import com.ibk.sb.restapi.biz.service.common.CommonService;
import com.ibk.sb.restapi.biz.service.common.repo.CommonFileRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.repo.CompanyRepo;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAdditionalAuditService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.TcbResultVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.repo.VentureCapitalRepo;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VentureCapitalBasicVO;
import com.ibk.sb.restapi.biz.service.vncmloan.repo.VncmLoanRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.MessageSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvestAuditService {

    private final InvestAuditRepo investAuditRepo;

    private final CompanyService companyService;

    private final VentureCapitalService ventureCapitalService;

    private final FileUtil fileUtil;

    private final PlatformAccountService platformAccountService;

    private final PlatformAlarmService platformAlarmService;
    private final MessageSource messageSource;

    private final PlatformAdditionalAuditService platformAdditionalAuditService;
    
    private final CommonFileRepo commonFileRepo;
    
    private final VncmLoanRepo vncmLoanRepo;

    private final CompanyRepo companyRepo;
    
    private final VentureCapitalRepo ventureCapitalRepo;

    private final CommonService commonService;
    
    /** ================================ CRUD ================================ **/

    /**
     * NDA 대상 기업 리스트 조회
     * -> 투자심사 심사중, 심사완료 상태인 상대 기업
     * @return
     * @throws Exception
     */
    public List<TargetCompanyVO> searchAuditNdaTargetCompanyList() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 심사중, 심사완료 투자심사 리스트 조회
        List<InvestAuditSummaryVO> auditList = investAuditRepo.selectAuditByStatus(new RequestSearchInvestAuditByStatusVO(
                null, Arrays.asList(ComCode.AUDIT_EVALUATE.getCode(), ComCode.AUDIT_COMPLETE.getCode()),
                user.getUserGroupId(), user.getUserGroupType()));

        auditList = auditList == null ? new ArrayList<>() : auditList;

        // 상대 기업 리스트 스트림 추출
        List<TargetCompanyVO> targetList = auditList.stream()
                .map(x -> {
                    TargetCompanyVO vo = new TargetCompanyVO();
                    if(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
                        vo.setUtlinsttId(x.getInvmCmpId());
                        vo.setId(x.getInvmCmpId());
                        vo.setBplcNm(x.getInvmCmpBplcNm());
                        vo.setValue(x.getInvmCmpBplcNm());
                    } else {
                        vo.setUtlinsttId(x.getRqstEnprId());
                        vo.setId(x.getRqstEnprId());
                        vo.setBplcNm(x.getRqstBplcNm());
                        vo.setValue(x.getRqstBplcNm());
                    }
                    return vo;
                }).distinct().collect(Collectors.toList());

        return targetList;
    }

    /**
     * 상태별 투자심사 리스트 조회
     * @param requestSearchInvestAuditByStatusVO
     * @return
     * @throws Exception
     */
    public List<InvestAuditSummaryVO> searchAuditByStatus(RequestSearchInvestAuditByStatusVO requestSearchInvestAuditByStatusVO) throws Exception {
       List<InvestAuditSummaryVO> searchList = investAuditRepo.selectAuditByStatus(requestSearchInvestAuditByStatusVO);
       return searchList != null ? searchList : new ArrayList<>();
    }

    /**
     * 투자유치현황 조회
     * @return
     * @throws Exception
     */
    public InvestAuditApplyVO searchAuditApply() throws Exception {

        InvestAuditApplyVO result = new InvestAuditApplyVO();

        // 현재날짜세팅
        result.setDate(new Date());

        // 카운트 조회
        // 요청상태 카운트
        List<InvestAuditSummaryVO> requestList = investAuditRepo.selectAuditByStatus(new RequestSearchInvestAuditByStatusVO(null, Arrays.asList(ComCode.AUDIT_REQUEST.getCode()), null, null));
        int requestCnt = requestList == null ? 0 : requestList.size();
        // 심사상태 카운트
        List<InvestAuditSummaryVO> evaluatingList = investAuditRepo.selectAuditByStatus(new RequestSearchInvestAuditByStatusVO(null, Arrays.asList(ComCode.AUDIT_EVALUATE.getCode()), null, null));
        int evaluatingCnt = evaluatingList == null ? 0 : evaluatingList.size();
        // 심사완료 카운트
        List<InvestAuditSummaryVO> completeList = investAuditRepo.selectAuditByStatus(new RequestSearchInvestAuditByStatusVO(null, Arrays.asList(ComCode.AUDIT_COMPLETE.getCode()), null, null));
        int completeCnt = completeList == null ? 0 : completeList.size();

        // IBK가 투자한 기업 카운트
        List<InvestAuditSummaryVO> ibkAuditComList = investAuditRepo.selectIbkAuditDetail(new RequestSearchInvestAuditByStatusVO(null, Arrays.asList(ComCode.AUDIT_COMPLETE.getCode()), "C0127305", null));
        int ibkAuditComCnt = ibkAuditComList == null ? 0 : ibkAuditComList.size();

        int num = 0;
        for(int i=0 ; i<ibkAuditComList.size() ; i++) {
            num += ibkAuditComList.get(i).getInvmPrfrScdlAmt();
        }

        result.setTotalApplyCnt(requestCnt + evaluatingCnt + completeCnt);
        result.setProgressAuditCnt(evaluatingCnt);
        result.setCompleteAuditCnt(completeCnt);
        result.setIbkAuditCompany(ibkAuditComCnt);
        result.setIbkAuditAmt(num);

        // 상태 상수값 입력을 위한 RequestVO 세팅
        List<ApplySummaryVO> applyList = investAuditRepo.selectMainAuditApplyList(new RequestSearchInvestAuditVO());
        result.setApplyList(applyList == null ? new ArrayList<>() : applyList);

        return result;
    }

    /**
     * 신규 제안 or 요청 등록시 두 기업간 진행중인 투자심사 유무 체크
     * @param invmCmpId 투자사 ID
     * @param rqstEnprId 기업 ID
     * @return true : 신규 등록 가능 | false : 신규 등록 불가(이미 진행중 안건 있음)
     */
    public boolean checkAuditOngoing (String invmCmpId, String rqstEnprId) throws Exception {

        String vc = "";
        String com = "";

        // 로그인 유저 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 유효성 체크 및 아이디 세팅
        // 기업 아이디가 있고 + 투자사 파라매터가 비어있고 + 투자사 회원일때
        if(StringUtils.hasLength(rqstEnprId) && !StringUtils.hasLength(invmCmpId)) {
            if(user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
                vc = user.getUserGroupId();
                com = rqstEnprId;
            }
            // 기업회원일 때
            else {
                return false;
            }
        }

        // 투자사 파라매터가 비어있지 않고 + 기업 아이디가 비어있고 + 기업 회원일때
        if(StringUtils.hasLength(invmCmpId) && !StringUtils.hasLength(rqstEnprId)) {
            if(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
                vc = invmCmpId;
                com = user.getUserGroupId();
            } else {
                return false;
            }
        }

        if(!StringUtils.hasLength(vc) || !StringUtils.hasLength(com)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기업간 최근 진행 투자심사 조회
        InvestAuditStageVO auditHistory = investAuditRepo.selectOngoingAudit(vc, com);

        // 기업간 투자심사 진행중인지 확인
        if(auditHistory != null) {
            if(!(auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())
            )) {
                return true;
            }
        }
        return false;
    }

    /**
     * 투자심사 제안 (투자사 -> 기업)
     * @param investAuditVO
     * @return
     * @throws Exception
     */
    public String saveInvestAuditSuggest(InvestAuditVO investAuditVO) throws Exception {

        // 로그인 유저 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자사 유저인지 확인
        if(!StringUtils.hasLength(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);

        VentureCapitalBasicVO invmBasicData = ventureCapitalService.searchVcBasicData(user.getUserGroupId());
        if(invmBasicData == null) throw new BizException(StatusCode.COM0005);

        // 기업 아이디 유효성 확인
        if(!StringUtils.hasLength(investAuditVO.getRqstEnprId())) throw new BizException(StatusCode.COM0005);

        CompanyBasicVO enprBasicData = companyService.searchCompanyBasicByUsisId(investAuditVO.getRqstEnprId());
        if(enprBasicData == null) throw new BizException(StatusCode.COM0005);

        /** todo 2023.03 추가내용 :
            투자사의 사업자번호가 IBK 투자기관인 경우 기업의 TCB평가 자격 조회 검증 ==================== */

        // todo : tcb 코드 설정
        if(!platformAdditionalAuditService.checkEnprTcbLimit(
                user.getUserGroupId(), investAuditVO.getRqstEnprId(), invmBasicData.getBizrno(), enprBasicData.getBizrno()).isPass()) {
            throw new BizException(StatusCode.BIZ1000);
        }

        /** ================================================================== 2023.03 추가내용 */

        // 이미 존재하는 해당 기업-투자사 의 투자심사 진행여부 확인
        // 심사완료나 취소가 최신 상태가 아닐경우 반려
        InvestAuditStageVO auditHistory = investAuditRepo.selectOngoingAudit(user.getUserGroupId(), investAuditVO.getRqstEnprId());
        if(auditHistory != null) {
            if(!(auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())
            )) {
                throw new BizException(StatusCode.BIZ1001);
            }
        }

        // 투자심사 제안 등록
        investAuditVO.setInvmExntRqstId(UUID.randomUUID().toString());
        investAuditVO.setInvmCmpId(user.getUserGroupId());
        investAuditVO.setRgsnUserId(user.getUsername());

        investAuditRepo.insertInvestAudit(investAuditVO);

        // 투자심사 단계 정보 등록
        investAuditRepo.insertInvestAuditStage(
                investAuditVO.getInvmExntRqstId(), ComCode.AUDIT_SUGGEST.getCode(), user.getUsername());

        // 투자심사 제안 알림 발송

        // 알림 발송
        requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_SUGGEST,
                IvtCode.UsisTypeEnum.COMPANY, null);

        // 투자심사 ID 리턴
        return investAuditVO.getInvmExntRqstId();
    }

    /**
     * 로그인한 기업의 투자심사요청 개수
     * @return
     * @throws Exception
     */
    public int searchRequestAuditCount() throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업 유저 확인
        if(!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 리스트 조회
        RequestSearchInvestAuditPageVO requestVO = new RequestSearchInvestAuditPageVO();
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setComType(IvtCode.UsisTypeEnum.COMPANY.getType());
        requestVO.setListStartType(IvtCode.AuditListTypeEnum.COMPANY_SEND); // 기업 요청부터 시작하고
        requestVO.setCheckLimit(true);     // 결과보기나 기간만료가 아닌 상태
        List<InvestAuditSummaryVO> auditList = investAuditRepo.selectInvestAuditList(requestVO);
        auditList = auditList == null ? new ArrayList<>() : auditList;

        return auditList.size();
    }

    /**
     * 투자심사 요청 (기업 -> 투자사)
     * @param investAuditVO
     * @throws Exception
     */
    public void saveInvestAuditRequest(InvestAuditVO investAuditVO) throws Exception {

        // 로그인 유저 정보 확인
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업 유저 확인 (하단에서 사업자 번호 조회시에도 사용)
        CompanyBasicVO enprBasicData = companyService.searchCompanyBasicByUsisId(user.getUserGroupId());
        if(enprBasicData == null) throw new BizException(StatusCode.COM0005);

        /** 제안부터 시작하는 심사인지 (UPDATE), 요청부터 시작하는 심사인지(INSERT) 확인 **/

        /** UPDATE (제안 -> 요청) **/

        // 투자심사 아이디가 존재할 경우 유효성 체크
        if(StringUtils.hasLength(investAuditVO.getInvmExntRqstId())) {
            InvestAuditVO beforeData = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(investAuditVO.getInvmExntRqstId()));

            // 존재하는 항목인지 체크
            if(beforeData == null) throw new BizException(StatusCode.MNB0003);

            // 상태코드 확인 (제안 상태여야함)
            if(!(StringUtils.hasLength(beforeData.getInvmExntPgsgCd())
                    && beforeData.getInvmExntPgsgCd().equals(ComCode.AUDIT_SUGGEST.getCode()))) {
                throw new BizException(StatusCode.COM0005);
            }

            // 투자요청 기업 아이디 확인
            if(!(StringUtils.hasLength(beforeData.getRqstEnprId())
                    && beforeData.getRqstEnprId().equals(user.getUserGroupId()))) {
                throw new BizException(StatusCode.COM0005);
            }

            /** todo 2023.03 추가내용 :
             투자사의 사업자번호가 IBK 투자기관인 경우 기업의 TCB평가 자격 조회 검증 ==================== */

            PassCheckData<TcbResultVO> tcbPassCheck = platformAdditionalAuditService.checkEnprTcbLimit(
                            beforeData.getInvmCmpId(), user.getUserGroupId(), beforeData.getInvmCmpBizrno(), beforeData.getRqstBplcBizrno());
            if(!tcbPassCheck.isPass()) throw new BizException(StatusCode.BIZ1000);

            /** ================================================================== 2023.03 추가내용 */

            // 투자 요청 정보 업데이트
            investAuditVO.setInvmCmpId(beforeData.getInvmCmpId()); // 제안 투자사
            investAuditVO.setRqstEnprId(user.getUserGroupId()); // 요청 기업
            investAuditVO.setAmnnUserId(user.getUsername());

            // 요청 시점 TCB 정보 저장
            if(tcbPassCheck.getData() != null) {
                investAuditVO.setTcbTchnGrd(tcbPassCheck.getData().getTcbTchnGrd());
                investAuditVO.setIncfCd1(tcbPassCheck.getData().getIncfCd1());
                investAuditVO.setIncfCd2(tcbPassCheck.getData().getIncfCd2());
                investAuditVO.setIncfCd3(tcbPassCheck.getData().getIncfCd3());
            }

            investAuditRepo.updateInvestAuditRequest(investAuditVO);

            // 투자심사 단계 등록
            investAuditRepo.insertInvestAuditStage(
                    investAuditVO.getInvmExntRqstId(), ComCode.AUDIT_REQUEST.getCode(), user.getUsername());

            // 알림 발송
            requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_CHANGE_STEP,
                    IvtCode.UsisTypeEnum.VC, ComCode.AUDIT_REQUEST);
        }

        /** INSERT (요청부터 시작) **/
        else {
            String fondDe = enprBasicData.getFondDe();
            // 기업 설립일자 5년 초과 시 중소기업은행으로 투자 / 5년 미만 시 IBK 벤처투자로 투자
            LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
            String currentYm = String.valueOf(getDate).replace("-", "");
            int currentYear = Integer.parseInt(fondDe.substring(0,3)) - Integer.parseInt(currentYm.substring(0,3));

            String vcId = "";
            if(investAuditVO.getInvmCmpId().equals("C0127305")){
                if(currentYear > 5) {
                    System.out.println("vcId = 중소기업은행");
                    vcId = investAuditVO.getInvmCmpId();
                }else {
                    System.out.println("vcId = IBK벤처투자");
                    vcId = "C0040865";
                }
            }else {
                vcId = investAuditVO.getInvmCmpId();
            }

            // 투자사 ID 유효성 검증
            if(!StringUtils.hasLength(vcId)) throw new BizException(StatusCode.COM0005);

            VentureCapitalBasicVO invmBasicData = ventureCapitalService.searchVcBasicData(vcId);
            if(invmBasicData == null) throw new BizException(StatusCode.COM0005);

            /** todo 2023.03 추가내용 :
             투자사의 사업자번호가 IBK 투자기관인 경우 기업의 TCB평가 자격 조회 검증 ==================== */
            PassCheckData<TcbResultVO> tcbPassCheck = platformAdditionalAuditService.checkEnprTcbLimit(
                    investAuditVO.getInvmCmpId(), user.getUserGroupId(), invmBasicData.getBizrno(), enprBasicData.getBizrno());
            if(!tcbPassCheck.isPass()) throw new BizException(StatusCode.BIZ1000);

            /** ================================================================== 2023.03 추가내용 */

            // 이미 존재하는 기업-투자사간 투자심사 진행여부 확인
            // 두 이용기관 사이 최신 투자심사 이력이 심사완료나, 취소, 기간만료가 아닐경우 반려
            InvestAuditStageVO auditHistory = investAuditRepo.selectOngoingAudit(investAuditVO.getInvmCmpId(), user.getUserGroupId());
            if(auditHistory != null) {
                if(!(auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())
                        || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
                        || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())
                )) {
                    throw new BizException(StatusCode.BIZ1001);
                }

                /** 2023.03 추가내용 :
                    투자심사 요청 (기업 -> 투자사) 의 경우,
                    최근 1년 사이 동일 투자사로 요청한 이력이 있는 경우 제한 ================================= */
                InvestAuditSummaryVO requestRecentAudit = investAuditRepo.selectRecentLimitPeriodAudit(
                        user.getUserGroupId(),
                        investAuditVO.getInvmCmpId(),
                        ComCode.AUDIT_REQUEST.getCode()
                );

                if(requestRecentAudit != null) {
                    BizException bx = new BizException(StatusCode.BIZ1002);
                    HashMap<String, Object> errorData = new HashMap<>();
                    errorData.put("invmSttgDt",
                            requestRecentAudit.getInvmSttgDt()
                                    .toLocalDateTime()
                                    .format(DateTimeFormatter.ofPattern("yyyyMMdd")));
                    bx.setData(errorData);

                    throw bx;
                }
                /** ================================================================== 2023.03 추가내용 */
            }

            // 투자심사 요청 등록

            if(!investAuditVO.getInfotechId().equals("")) { //간편서류 제출 실행 시
                investAuditVO.setInvmExntRqstId(investAuditVO.getInfotechId());
            }else { // 간편서류 제출 안할 때
                investAuditVO.setInvmExntRqstId(UUID.randomUUID().toString());
            }

            investAuditVO.setRqstEnprId(user.getUserGroupId());
            investAuditVO.setRgsnUserId(user.getUsername());
            investAuditVO.setAmnnUserId(user.getUsername());

            // todo 위의 tcb 저장 로직 정의 후 마찬가지로 설정

            // 1안
//            TcbResultVO tcbResultVO = tcbPassCheck.getData() == null
//                    ? platformAdditionalAuditService.searchRqstEnprTcbInfo(user.getUserGroupId()) : tcbPassCheck.getData();
//            investAuditVO.setTcbTchnGrd(tcbResultVO.getTcbTchnGrd());
//            investAuditVO.setIncfCd1(tcbResultVO.getIncfCd1());
//            investAuditVO.setIncfCd2(tcbResultVO.getIncfCd2());
//            investAuditVO.setIncfCd3(tcbResultVO.getIncfCd3());

            // 2안
            if(tcbPassCheck.getData() != null) {
                investAuditVO.setTcbTchnGrd(tcbPassCheck.getData().getTcbTchnGrd());
                investAuditVO.setIncfCd1(tcbPassCheck.getData().getIncfCd1());
                investAuditVO.setIncfCd2(tcbPassCheck.getData().getIncfCd2());
                investAuditVO.setIncfCd3(tcbPassCheck.getData().getIncfCd3());
            }
            investAuditRepo.insertInvestAudit(investAuditVO);

            // 투자심사 단계 등록
            investAuditRepo.insertInvestAuditStage(
                    investAuditVO.getInvmExntRqstId(), ComCode.AUDIT_REQUEST.getCode(), user.getUsername());

            // 알림 발송
            requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_REQUEST,
                    IvtCode.UsisTypeEnum.VC, null);
        }

        /** 투자심사 요청 기업 포괄적 동의 처리 */
        companyService.saveCompanyIRAgreement(investAuditVO.getAtrwStplCosnYn());

		HashMap<String, Object> req = new HashMap<>();
        // 접수한 담당자 이름 및 연락처 조회
        MainUserVO mainUserVO = platformAccountService.searchMainUser(investAuditVO.getRgsnUserId(), investAuditVO.getRqstEnprId());
        MainCompanyVO vcInfo = platformAccountService.searchMainCompanyById(investAuditVO.getInvmCmpId());
		req.put("invmCmpBplcNm", vcInfo.getBplcNm());
		req.put("rqstBplcNm", mainUserVO.getBplcNm());
		req.put("userNm", mainUserVO.getUserNm());
		req.put("userId", investAuditVO.getRgsnUserId());
        req.put("invmCmpId", investAuditVO.getInvmCmpId());
		// 요청 취소 시 혁신투자부에 이메일 및 sms로 알림
//		commonService.sendEmailSms(req, "audit");
        // 투자심사요청 관련 파일 권한 설정
//            if(StringUtils.hasLength(investAuditVO.getAddtDocFileId())) {
//                fileService.setFileDownloadAuth(investAuditVO.getAddtDocFileId(), investAuditVO.getRqstEnprId(), investAuditVO.getInvmCmpId(), null);
//            }
//            if(StringUtils.hasLength(investAuditVO.getAnncDatFileId())) {
//                fileService.setFileDownloadAuth(investAuditVO.getAnncDatFileId(), investAuditVO.getRqstEnprId(), investAuditVO.getInvmCmpId(), null);
//            }
    }

    /**
     * 마이페이지 대시보드 받은/보낸 투자심사 리스트 조회
     * @return
     * @throws Exception
     */
    public BadgeListVO<InvestAuditSummaryVO> searchDashBoardAuditList(IvtCode.AuditListTypeEnum auditListTypeEnum) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 조회 정보 세팅
        RequestSearchInvestAuditPageVO requestVO = new RequestSearchInvestAuditPageVO();

        requestVO.setPage(1);
        requestVO.setRecord(6); // 6개씩 보여줌
        requestVO.setUtlinsttId(user.getUserGroupId());

        requestVO.setComType(user.getUserGroupType());

        requestVO.setListStartType(auditListTypeEnum);
        // 투자심사요청 내역은 검색조건있지만 대시보드는 검색조건 없음 근데 같은 쿼리 공유하여 사용하므로 대시보드는 검색조건 따로셋팅
        requestVO.setSearchComNm("");
        requestVO.setSearchBzn("");
        requestVO.setSearchFromDate("");
        requestVO.setSearchToDate("");
        requestVO.setInvestRcdt("");

        // 제안 요청 목록 조회
        List<InvestAuditSummaryVO> auditList;
        // 리스트 카운트가 각 리스트의 완료(취소)되지 않은 건에서 전체로 변경 -> 재수정 시 listCnt 연산에 selectAuditByStatus 사용
        int listCnt;

        BadgeListVO<InvestAuditSummaryVO> result = new BadgeListVO<>();
        auditList = investAuditRepo.selectInvestAuditList(requestVO);
        result.setList(auditList == null ? new ArrayList<>() : auditList);

        listCnt = auditList.size() > 0 ? auditList.get(0).getTotalCnt() : 0;
        result.setBadgeCnt(listCnt);

        return result;
    }

    /**
     * 투자심사 리스트 조회 By 로그인 정보
     * @param requestVO
     * @return
     * @throws Exception
     */
    public BadgePagingVO<InvestAuditSummaryVO> searchAuditListByLoginUserInfo(RequestSearchInvestAuditPageVO requestVO, IvtCode.AuditListTypeEnum auditListTypeEnum) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 조회정보 세팅 (프론트에서 받는건 상태코드와 페이징정보)
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setComType(user.getUserGroupType());
        requestVO.setListStartType(auditListTypeEnum);

        return searchAuditList(requestVO);
    }

    /**
     * 투자심사 리스트 조회 By 사업자번호
     * @param requestVO
     * @return
     * @throws Exception
     */
    public BadgePagingVO<InvestAuditSummaryVO> searchAuditListByBizNum(RequestSearchInvestAuditPageVO requestVO, IvtCode.TransmitTypeEnum transmitTypeEnum) throws Exception {

        // 사업자 번호 기준 이용기관 정보 조회
        if(!StringUtils.hasLength(requestVO.getBizrno())) throw new BizException(StatusCode.COM0005);
        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyByBizNum(requestVO.getBizrno());
        if(mainCompanyVO == null) throw new BizException(StatusCode.COM9998);

        // 이용기관 아이디 세팅
        requestVO.setUtlinsttId(mainCompanyVO.getUtlinsttId());

        // 이용기관 타입 조회 및 설정
        if(ventureCapitalService.checkVentureCapital(requestVO.getUtlinsttId())) {
            requestVO.setComType(IvtCode.UsisTypeEnum.VC.getType());

            // 받은 | 보낸 리스트 구분
            if(transmitTypeEnum == IvtCode.TransmitTypeEnum.RECEIVE) {
                requestVO.setListStartType(IvtCode.AuditListTypeEnum.VC_RECEIVE);
            } else if (transmitTypeEnum == IvtCode.TransmitTypeEnum.SEND) {
                requestVO.setListStartType(IvtCode.AuditListTypeEnum.VC_SEND);
            }

        } else {
            requestVO.setComType(IvtCode.UsisTypeEnum.COMPANY.getType());

            // 받은 | 보낸 리스트 구분
            if(transmitTypeEnum == IvtCode.TransmitTypeEnum.RECEIVE) {
                requestVO.setListStartType(IvtCode.AuditListTypeEnum.COMPANY_RECEIVE);
            } else if (transmitTypeEnum == IvtCode.TransmitTypeEnum.SEND) {
                requestVO.setListStartType(IvtCode.AuditListTypeEnum.COMPANY_SEND);
            }
        }

        return searchAuditList(requestVO);
    }

    /**
     * 투자심사 리스트 조회
     * @param requestVO
     * @return
     * @throws Exception
     */
    public BadgePagingVO<InvestAuditSummaryVO> searchAuditList(RequestSearchInvestAuditPageVO requestVO) throws Exception {

        // 리스트 조회
        List<InvestAuditSummaryVO> auditList = investAuditRepo.selectInvestAuditList(requestVO);
        auditList = auditList == null ? new ArrayList<>() : auditList;

        // 뱃지 카운트 조회 (필요시 수정 : 현재 각 탭별 전체 크기)
        HashMap<String, Integer> badgeMap = new HashMap<>();

        RequestSearchInvestAuditByStatusVO badgeRequest = new RequestSearchInvestAuditByStatusVO(
                null, null, requestVO.getUtlinsttId(), requestVO.getComType()
        );

        List<InvestAuditSummaryVO> receive = null;
        List<InvestAuditSummaryVO> send = null;
        IvtCode.TransmitTypeEnum listType = null;
        if(requestVO.getComType().equals(IvtCode.UsisTypeEnum.COMPANY.getType())) {
            // 기업 받은 제안 전체
            badgeRequest.setStartStgCdList(Arrays.asList(ComCode.AUDIT_SUGGEST.getCode()));
            receive = investAuditRepo.selectAuditByStatus(badgeRequest);
            // 기업 보낸 요청 전체
            badgeRequest.setStartStgCdList(Arrays.asList(ComCode.AUDIT_REQUEST.getCode()));
            send = investAuditRepo.selectAuditByStatus(badgeRequest);

            if(requestVO.getListStartType().equals(ComCode.AUDIT_SUGGEST.getCode())) {
                listType = IvtCode.TransmitTypeEnum.RECEIVE;
            } else {
                listType = IvtCode.TransmitTypeEnum.SEND;
            }

        } else if(requestVO.getComType().equals(IvtCode.UsisTypeEnum.VC.getType())) {
            // 투자사 받은 요청 전체
            badgeRequest.setStartStgCdList(Arrays.asList(ComCode.AUDIT_REQUEST.getCode()));
            receive = investAuditRepo.selectAuditByStatus(badgeRequest);
            // 투자사 보낸 제안 전체
            badgeRequest.setStartStgCdList(Arrays.asList(ComCode.AUDIT_SUGGEST.getCode()));
            send = investAuditRepo.selectAuditByStatus(badgeRequest);

            if(requestVO.getListStartType().equals(ComCode.AUDIT_REQUEST.getCode())) {
                listType = IvtCode.TransmitTypeEnum.RECEIVE;
            } else {
                listType = IvtCode.TransmitTypeEnum.SEND;
            }
        }

        receive = receive == null ? new ArrayList<>() : receive;
        send = send == null ? new ArrayList<>() : send;

        badgeMap.put(IvtCode.TransmitTypeEnum.RECEIVE.name(), receive.size());
        badgeMap.put(IvtCode.TransmitTypeEnum.SEND.name(), send.size());

        // 뱃지 페이징 처리 및 리턴
        return new BadgePagingVO<>(requestVO, auditList, listType == IvtCode.TransmitTypeEnum.RECEIVE ? receive.size() : send.size(), badgeMap);
    }

    /**
     * 투자심사 진행도 조회
     * @param auditId
     * @return
     * @throws Exception
     */
    public List<InvestAuditStageVO> searchAuditProgress(String auditId) throws Exception {

        // 투자심사 진행도 정보 조회
        List<InvestAuditStageVO> progressList = investAuditRepo.selectInvestAuditProgress(auditId);

        return progressList == null ? new ArrayList<>() : progressList;
    }

    /**
     * 투자심사 정보 기본 조회 (repo의 기본정보만 조회 반환)
     * @param auditId
     * @return
     * @throws Exception
     */
    public InvestAuditVO searchInvestAuditBasic(String auditId) throws Exception {
        // 투자심사 정보 조회
        return investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(auditId));
    }

    /**
     * 투자심사 정보 상세 조회
     * 메시지의 경우 페이징이므로 조회 api 분리
     * @param auditId
     * @return
     * @throws Exception
     */
    public InvestAuditVO searchInvestAudit(String auditId) throws Exception {

        // 투자심사 정보 조회
        InvestAuditVO investAuditVO = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(auditId));

        // 유효성 검사
        if(investAuditVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 로그인 정보가 있는 경우 유효성 검사
        // IBK 투자그룹 조회를 위해 instanceof로 체크
        String niceSearchLoginId = "";
        CustomUser user = null;
        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CustomUser) {
            user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            niceSearchLoginId = user.getUsername();
//            if(!investAuditVO.getRqstEnprId().equals(user.getUserGroupId()) && !investAuditVO.getInvmCmpId().equals(user.getUserGroupId()))
////                throw new BizException(StatusCode.COM0005);
        }

        // 투자사, 기업 로고 이미지 및 대표자명 조회
        MainCompanyVO vcInfo = platformAccountService.searchMainCompanyById(investAuditVO.getInvmCmpId());
        MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(investAuditVO.getRqstEnprId());
        // 접수한 담당자 이름 및 연락처 조회
        MainUserVO mainUserVO = platformAccountService.searchMainUser(investAuditVO.getRgsnUserId(), investAuditVO.getRqstEnprId());
        investAuditVO.setMainBizCd(comInfo.getMainBizcnd());
        investAuditVO.setMainBizCdNm(comInfo.getMainBizcndNm());

        // 비즈니스분야 셋팅
        List<CompanyInvestFieldVO> investFieldList = companyRepo.selectCompanyInvestFieldList(investAuditVO.getRqstEnprId());
        List<String> bsinStr = new ArrayList<>();
        if(investFieldList.size() > 0) {
            for(int i=0 ; i<investFieldList.size() ; i++) {
                bsinStr.add(i, investFieldList.get(i).getInvmFildNm());
            }
        }
        investAuditVO.setBsinList(bsinStr);

        // 활용기술 셋팅
        List<String> techStr = new ArrayList<>();
        List<CompanyUtilTechVO> techList = companyRepo.selectCompanyUtilTechList(investAuditVO.getRqstEnprId());
        if(techList.size() > 0) {
            for(int i=0 ; i<techList.size() ; i++) {
                techStr.add(i, techList.get(i).getUtlzTchnNm());
            }
        }
        investAuditVO.setTechUtilList(techStr);

        if(vcInfo != null) {
            investAuditVO.setInvmLogoImageUrl(fileUtil.setMainboxLogoUrl(vcInfo.getLogoImageFile()));
            investAuditVO.setInvmCmpRprsntvNm(vcInfo.getRprsntvNm());
        } else {
            investAuditVO.setInvmCmpRprsntvNm("");
            investAuditVO.setInvmLogoImageUrl("");
            
        }

        if(comInfo != null) {
            investAuditVO.setEnprLogoImageUrl(fileUtil.setMainboxLogoUrl(comInfo.getLogoImageFile()));
            investAuditVO.setRqstEnprRprsntvNm(mainUserVO.getUserNm());
            investAuditVO.setReprsntTelno(mainUserVO.getMoblphonNo());
            investAuditVO.setMainBizcnd(comInfo.getMainBizcnd());
            investAuditVO.setMainBizcndNm(comInfo.getMainBizcndNm());
        } else {
            investAuditVO.setRqstEnprRprsntvNm("");
            investAuditVO.setEnprLogoImageUrl("");
        }

        // 투자사 사업자번호가 IBK VC 사업자번호인지 확인
        investAuditVO.setIbkVcYn(
                (StringUtils.hasLength(investAuditVO.getInvmCmpBizrno()) && platformAdditionalAuditService.getIbkVcBiznumList().contains(investAuditVO.getInvmCmpBizrno()))
                    ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name()
        );

        // 제안 상태가 아닐 경우
        // 1. IR 조회기간 값이 있는 경우 IR 미리보기 여부 설정
        // 2. 간편서류 목록 조회
        investAuditVO.setRqstEnprIrInqYn(IvtCode.YnTypeEnum.Y.name());
        if(!investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_SUGGEST.getCode())) {
            // IR 조회기간 값이 있는 경우 IR 미리보기 여부 설정 - 혁신투자부 최세웅 차장님 요청으로 항상보이게 수정
            /*if(investAuditVO.getInqAblNdd() != null) {
                // 요청일 기준
                LocalDate expireDate = investAuditVO.getInvmRqstDt()
                        .toLocalDateTime().toLocalDate()
                        .plusDays((long) investAuditVO.getInqAblNdd());

                if(!expireDate.isBefore(LocalDate.now(ZoneId.of("Asia/Seoul")))) {
                    investAuditVO.setRqstEnprIrInqYn(IvtCode.YnTypeEnum.Y.name());
                }
            }*/

            // 간편서류 목록 조회
            // 간편서류 스크래핑 조회 후 pdf파일 TB_BOX_IVT_FILE_ATCH_M 테이블에 저장 -> auditId값으로 저장된 파일이름 간편서류 제출한 상세화면에서 파일 확인가능
            List<ComFileInfoVO> fileInfoVO = commonFileRepo.selectInfotechFileInfo(auditId);
            investAuditVO.setInfotechDoc(fileInfoVO);
 
        }
        VentureCapitalBasicVO basicData = ventureCapitalRepo.selectVentureCapital(vcInfo.getUtlinsttId());
        investAuditVO.setInvmexntRapLmtnMnct(basicData.getInvmexntRapLmtnMnct());
        
        // 투자심사완료 단계 + 투자집행예정금액이 유효할 경우
        // -> 금액 단위 적용
        if(investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode()) && investAuditVO.getInvmPrfrScdlAmt() != null) {

//            if(investAuditVO.getInvmPrfrScdlAmt() >= StringUtil.KR_10THOUSAND) {
//                investAuditVO.setInvmPrfrScdlAmtStr(
//                        StringUtil.numberToUnitString(investAuditVO.getInvmPrfrScdlAmt(), StringUtil.UnitEnum.KR_10THOUSAND_START, false)
//                );
//            } else {
//                investAuditVO.setInvmPrfrScdlAmtStr(StringUtil.longNumberCommaFormat(investAuditVO.getInvmPrfrScdlAmt()));
//            }
            investAuditVO.setInvmPrfrScdlAmtStr(StringUtil.longNumberCommaFormat(investAuditVO.getInvmPrfrScdlAmt()));
        }

        return investAuditVO;
    }

    /**
     * 심사중 상태 전환
     * @param auditId
     * @throws Exception
     */
    public void progressEvaluating(String auditId) throws Exception {

        if(!StringUtils.hasLength(auditId)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 정보 조회
        InvestAuditVO investAuditVO = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(auditId));

        // 유효성 검사
        if(investAuditVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 투자심사 상태 유효성 확인
        if(!investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_REQUEST.getCode())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자심사 심사중 상태 추가
        investAuditRepo.insertInvestAuditStage(
                auditId, ComCode.AUDIT_EVALUATE.getCode(), user.getUsername());

        // 알림 발송
        requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_CHANGE_STEP,
                IvtCode.UsisTypeEnum.COMPANY, ComCode.AUDIT_EVALUATE);
    }


    /**
     * 심사완료 처리
     * @param investAuditVO
     * @throws Exception
     */
    public void progressComplete(InvestAuditVO investAuditVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 심사는 투자사만
        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 유효성 조회
        if(!StringUtils.hasLength(investAuditVO.getInvmExntRqstId())) {
            throw new BizException(StatusCode.COM0005);
        }

        InvestAuditVO beforeData = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(investAuditVO.getInvmExntRqstId()));
        if(beforeData == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 심사중 상태에서 전환인지 체크
        if(!beforeData.getInvmExntPgsgCd().equals(ComCode.AUDIT_EVALUATE.getCode())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자사 아이디 확인
        if(!beforeData.getInvmCmpId().equals(user.getUserGroupId())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 총평 업데이트
        investAuditVO.setAmnnUserId(user.getUsername());
        investAuditVO.setExntRsprId(user.getUsername());

        investAuditRepo.updateInvestAuditEvaluateMsg(investAuditVO);

        // 투자 심사완료 상태 등록
        investAuditRepo.insertInvestAuditStage(
                investAuditVO.getInvmExntRqstId(), ComCode.AUDIT_COMPLETE.getCode(), user.getUsername());

        // 알림 발송
        requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_CHANGE_STEP,
                IvtCode.UsisTypeEnum.COMPANY, ComCode.AUDIT_COMPLETE);
    }

    /**
     * 투자심사 취소
     * @param auditId
     * @throws Exception
     */
    public void cancelAudit(String auditId) throws Exception {

        if(!StringUtils.hasLength(auditId)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 취소는 기업만
        if(!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 유효성 조회
        InvestAuditVO investAuditVO = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(auditId));
        if(investAuditVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 상태 체크 (취소 혹은 심사완료가 아니어야 함)
        if(investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())
                || investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
                || investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())) {
            throw new BizException(StatusCode.BIZ0004);
        }

        // 기업 아이디 체크
        if(!(StringUtils.hasLength(investAuditVO.getRqstEnprId())
                && investAuditVO.getRqstEnprId().equals(user.getUserGroupId()))) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 취소 상태 등록
        investAuditRepo.insertInvestAuditStage(
                investAuditVO.getInvmExntRqstId(), ComCode.AUDIT_CANCEL.getCode(), user.getUsername());
        
        // 간편서류 삭제
        List<ComFileInfoVO> fileInfoVO = commonFileRepo.selectInfotechFileInfo(auditId);
        for(int i=0; i<fileInfoVO.size() ; i++) {
        	commonFileRepo.deleteFilePhysical(fileInfoVO.get(i).getFileId());
        }
        List<BoxIvtFileVO> vncmLoanFileInfo = vncmLoanRepo.searchVncmLoanFileMapping(auditId);
        for(int i=0; i<vncmLoanFileInfo.size() ; i++) {
        	vncmLoanRepo.deleteVncmLoanFileMapping(vncmLoanFileInfo.get(i).getInvtId());
        }
        
        // 알림 발송
        requestAuditAlarm(investAuditVO.getInvmExntRqstId(), AlarmCode.AlarmCodeEnum.AUDIT_CHANGE_STEP,
                IvtCode.UsisTypeEnum.VC, ComCode.AUDIT_CANCEL);
    }

    /**
     * 투자심사 제안 or 요청 신청시 신청 가능여부 확인
     * 프론트 상 첫 단계에서만 호출 (투자심사요청 프로세스라 하더라도 먼저 제안 받은 경우 해당 안됨)
     * 실제 투자심사 신청 프로세스에서도 다시 확인이 들어감
     *
     * 제안 : 1.투자사가 IBK일 경우 - TCB 확인
     * 요청 : 1.투자사가 IBK일 경우 - TCB 확인 | 2.현재 요청 진행건수 제한 확인 | 3. 마지막 요청으로부터 1년이 지났는지 확인
     * @param rqstEnprId
     * @param invmCmpId
     * @return
     * @throws Exception
     */
    public HashMap<String, String> checkBeforeAuditLimit (final String rqstEnprId, final String invmCmpId, IvtCode.YnTypeEnum tcbCheckYn) throws Exception {
        if(!(StringUtils.hasLength(rqstEnprId) && StringUtils.hasLength(invmCmpId))) throw new BizException(StatusCode.COM0005);

        // 투자사 아이디 확인
        VentureCapitalBasicVO invmBasicData = ventureCapitalService.searchVcBasicData(invmCmpId);
        if(invmBasicData == null) throw new BizException(StatusCode.COM0005);

        // 기업 아이디 확인
        CompanyBasicVO enprBasicData = companyService.searchCompanyBasicByUsisId(rqstEnprId);
        if(enprBasicData == null) throw new BizException(StatusCode.COM0005);


        // 진행여부 확인
        InvestAuditStageVO auditHistory = investAuditRepo.selectOngoingAudit(invmCmpId, rqstEnprId);
        if(auditHistory != null) {
            if(!(auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
                    || auditHistory.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())
            )) {
                return getAuditLimitResult(IvtCode.YnTypeEnum.N.name(), StatusCode.BIZ1001, null);
            }
        }

        // 투자사가 IBK인 경우 TCB 확인
        if(tcbCheckYn == IvtCode.YnTypeEnum.Y) {
            PassCheckData<TcbResultVO> tcbCheck = platformAdditionalAuditService.checkEnprTcbLimit(invmCmpId, rqstEnprId,
                    invmBasicData.getBizrno(), enprBasicData.getBizrno());
            
            if(!tcbCheck.isPass()) return getAuditLimitResult(IvtCode.YnTypeEnum.N.name(), StatusCode.BIZ1000,
                    StringUtils.hasLength(tcbCheck.getData().getTcbTchnGrd()) ? tcbCheck.getData().getTcbTchnGrd() : "");
        }

        // 로그인 유저가 기업인 경우 진행건수 및 요청 기간 확인
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            // 진행건수 확인
            if(searchRequestAuditCount() >= 5) {
                return getAuditLimitResult(IvtCode.YnTypeEnum.N.name(), StatusCode.BIZ0001, null);
            }
            // 요청가능 기간 확인
            InvestAuditSummaryVO requestRecentAudit = investAuditRepo.selectRecentLimitPeriodAudit(
                    rqstEnprId,
                    invmCmpId,
                    ComCode.AUDIT_REQUEST.getCode()
            );

            if(requestRecentAudit != null) {
                return getAuditLimitResult(IvtCode.YnTypeEnum.N.name(), StatusCode.BIZ1002, null);
            }
        }

        return getAuditLimitResult(IvtCode.YnTypeEnum.Y.name(), null, null);
    }

    /**
     * 투자심사 신청 가능여부 확인 결과값 설정
     * @param passYn
     * @param status
     * @param tcbTchnGrd
     * @return
     * @throws Exception
     */
    private HashMap<String, String> getAuditLimitResult (String passYn, StatusCode status, String tcbTchnGrd) throws Exception {
        HashMap<String, String> result = new HashMap<>();
        result.put("passYn", passYn);

        if(status != null) {
            result.put("failCode", status.getCode());
            result.put("failMessage", status.getMessage());
        }

        if(status == StatusCode.BIZ1000) result.put("tcbTchnGrd", tcbTchnGrd);

        return result;
    }

    /** ================================ Extra ================================ **/

    /**
     * 투자심사 알림 전송 공통 메서드
     * @param invmExntRqstId
     * @param alarmCodeEnum
     * @throws Exception
     */
    public void requestAuditAlarm(String invmExntRqstId, AlarmCode.AlarmCodeEnum alarmCodeEnum,
                                  IvtCode.UsisTypeEnum targetTypeEnum, ComCode auditStepCode) throws Exception {

        // 투자심사 정보 조회
        InvestAuditVO resultVO = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(invmExntRqstId));

        // 알림 아이디, 타이틀, base url 설정
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(
                alarmCodeEnum,
                targetTypeEnum == IvtCode.UsisTypeEnum.COMPANY
                        ? AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_COMPANY_URL
                        : AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_VC_URL
                );

        // 알림 템플릿 배열 정보 세팅
        Object[] templateArr = null;
        if(alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_SUGGEST) {
            templateArr = new Object[]{resultVO.getInvmCmpBplcNm(), resultVO.getRqstBplcNm()};
        }
        else if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_REQUEST) {
            templateArr = new Object[]{resultVO.getInvmCmpBplcNm(), resultVO.getRqstBplcNm()};
        }
        else if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_CHANGE_STEP && auditStepCode != null) {
            templateArr = new Object[]{resultVO.getInvmCmpBplcNm(), resultVO.getRqstBplcNm(), auditStepCode.getName()};
        }
        else if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_OVER_TIME) {
            templateArr = new Object[]{resultVO.getInvmCmpBplcNm(), resultVO.getRqstBplcNm(), ComCode.AUDIT_EXPIRED.getName()};
        }
        else if (alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_MESSAGE_RECEIVE) {
            templateArr = new Object[]{resultVO.getInvmCmpBplcNm(), resultVO.getRqstBplcNm()};
        }

        // 알림 내용 설정
        requestAlarmVO.setAlrtCon(messageSource.getMessage(
                alarmCodeEnum.getTemplateId()
                , templateArr
                , null));

        // 알림 URL 설정
        requestAlarmVO.setPcLinkUrlCon(requestAlarmVO.getPcLinkUrlCon() + invmExntRqstId);

        // 알림 발송
        if(targetTypeEnum == IvtCode.UsisTypeEnum.COMPANY) {
            InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, resultVO.getRqstEnprId(), null);
            // 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResult);
        } else if(targetTypeEnum == IvtCode.UsisTypeEnum.VC) {
            InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, resultVO.getInvmCmpId(), null);
            // 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResult);
        }
    }
    
    /**
     * 받은,보낸요청 전체목록  엑셀 다운로드
     * @param requestSearchInvestAuditPageVO
     * @param response
     * @throws Exception
     */
    public void excelDownloadAudit(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO, HttpServletResponse response) throws Exception {

    	requestSearchInvestAuditPageVO.setPage(null);
    	requestSearchInvestAuditPageVO.setRecord(null);
        List<InvestAuditExcelVO> auditList = null;
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        requestSearchInvestAuditPageVO.setUtlinsttId(user.getUserGroupId());
        
    	if(requestSearchInvestAuditPageVO.getComType().equals("RECEIVE")) {
    		// 기업 받은 제안 전체
    		requestSearchInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_RECEIVE);
    		requestSearchInvestAuditPageVO.setComType(user.getUserGroupType());
    		auditList = investAuditRepo.selectExcelAuditList(requestSearchInvestAuditPageVO);
    		for(int i=0; i < auditList.size() ; i++) {
    			auditList.get(i).setSeq(auditList.size()-i);
    			auditList.get(i).setMsgCon(auditList.get(i).getRqstMsgCon());
                auditList.get(i).setIncrYmd(auditList.get(i).getIncrYmd().substring(0,4) + "-" +
                        auditList.get(i).getIncrYmd().substring(4,6) + "-" +
                        auditList.get(i).getIncrYmd().substring(6,8));
                if(auditList.get(i).getInvmCmpId().equals("C0127305")) {
                    auditList.get(i).setRcdt("중소기업은행");
                }else {
                    auditList.get(i).setRcdt("IBK벤처투자");
                }
    		}
    		ExcelFormVO excelFormVO = new ExcelFormVO(InvestAuditExcelVO.class, auditList, "투자심사 받은요청 리스트");
    		excelFormVO.setHeaderTitle("투자심사 받은요청 리스트");
    		excelFormVO.getColNmMap().put("msgCon", "받은 메세지");
    		
    		ExcelFileUtil.excelDownload(excelFormVO, response);
    	} else {
    		// 기업 보낸 요청 전체
    		requestSearchInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_SEND);
    		requestSearchInvestAuditPageVO.setComType(user.getUserGroupType());
    		auditList = investAuditRepo.selectExcelAuditList(requestSearchInvestAuditPageVO);
    		for(int i=0; i < auditList.size() ; i++) {
    			auditList.get(i).setSeq(auditList.size()-i);
    			auditList.get(i).setMsgCon(auditList.get(i).getPrplMsgCon());
    		}
    		ExcelFormVO excelFormVO = new ExcelFormVO(InvestAuditExcelVO.class, auditList, "투자심사 보낸요청 리스트");
    		excelFormVO.setHeaderTitle("투자심사 보낸요청 리스트");
    		excelFormVO.getColNmMap().put("msgCon", "보낸 메세지");
    		
    		ExcelFileUtil.excelDownload(excelFormVO, response);
    	}
    }	
    
    /**
     * 받은,보낸요청 세부내용 엑셀 다운로드
     * @param requestSearchInvestAuditPageVO
     * @param response
     * @throws Exception
     */
    public void excelDownloadAuditDetail(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO, HttpServletResponse response) throws Exception {

    	requestSearchInvestAuditPageVO.setPage(null);
    	requestSearchInvestAuditPageVO.setRecord(null);
        List<InvestAuditDetailExcelVO> auditList = null;
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        requestSearchInvestAuditPageVO.setUtlinsttId(user.getUserGroupId());
        
        
    	if(requestSearchInvestAuditPageVO.getComType().equals("RECEIVE")) {
    		// 기업 받은 제안 전체
    		requestSearchInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_RECEIVE);
    		requestSearchInvestAuditPageVO.setComType(user.getUserGroupType());
    		auditList = investAuditRepo.selectExcelAuditDetail(requestSearchInvestAuditPageVO);
            // 접수한 담당자 이름 및 연락처 조회
            
    		for(int i=0; i < auditList.size() ; i++) {
    			auditList.get(i).setSeq(auditList.size()-i);
    			auditList.get(i).setMsgCon(auditList.get(i).getRqstMsgCon());
    			MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(auditList.get(i).getRqstEnprId());
    			if(comInfo.getMainBizcnd() != null) {
    				auditList.get(i).setMainBizcnd(comInfo.getMainBizcnd());
    				auditList.get(i).setMainBizcndNm(comInfo.getMainBizcndNm());    				
    			}
                auditList.get(i).setCol(auditList.get(i).getCol().substring(0,4) + "-" +
                        auditList.get(i).getCol().substring(4,6) + "-" +
                        auditList.get(i).getCol().substring(6,8));
                if(auditList.get(i).getInvmCmpId().equals("C0127305")) {
                    auditList.get(i).setRcdt("중소기업은행");
                }else {
                    auditList.get(i).setRcdt("IBK벤처투자");
                }
    		}
    		ExcelFormVO excelFormVO = new ExcelFormVO(InvestAuditDetailExcelVO.class, auditList, "투자심사 받은요청 리스트");
    		excelFormVO.setHeaderTitle("투자심사 받은요청 리스트");
    		excelFormVO.getColNmMap().put("msgCon", "받은 메세지");
    		
    		ExcelFileUtil.excelDownload(excelFormVO, response);
    	} else {
    		// 기업 보낸 요청 전체
    		requestSearchInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_SEND);
    		requestSearchInvestAuditPageVO.setComType(user.getUserGroupType());
    		auditList = investAuditRepo.selectExcelAuditDetail(requestSearchInvestAuditPageVO);
    		for(int i=0; i < auditList.size() ; i++) {
    			auditList.get(i).setSeq(auditList.size()-i);
    			auditList.get(i).setMsgCon(auditList.get(i).getPrplMsgCon());
    			MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(auditList.get(i).getRqstEnprId());
    			auditList.get(i).setMainBizcnd(comInfo.getMainBizcnd());
    			auditList.get(i).setMainBizcndNm(comInfo.getMainBizcndNm());
    		}
    		ExcelFormVO excelFormVO = new ExcelFormVO(InvestAuditDetailExcelVO.class, auditList, "투자심사 보낸요청 리스트");
    		excelFormVO.setHeaderTitle("투자심사 보낸요청 리스트");
    		excelFormVO.getColNmMap().put("msgCon", "보낸 메세지");
    		
    		ExcelFileUtil.excelDownload(excelFormVO, response);
    	}
    }
    
    /**
     * 추천직원 및 영업점 수정
     * @param investAuditVO
     * @return
     * @throws Exception
     */
    public void updateRecommendAudit (InvestAuditVO investAuditVO) throws Exception {
    	
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        investAuditVO.setAmnnUserId(user.getUserGroupId());
        
    	investAuditRepo.updateRecommendAudit(investAuditVO);
    }
}
