package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVcRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.*;
import com.ibk.sb.restapi.biz.service.admin.vo.request.*;
import com.ibk.sb.restapi.biz.service.audit.vo.TargetCompanyVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.repo.CompanyRepo;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyInterestVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.*;
import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.ProFundPartcptnVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoPageVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.ir.repo.InvestorRelationRepo;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.constant.CmmScpConst;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechContentVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.RequestCmmScpVO;
import com.ibk.sb.restapi.biz.service.prplcm.repo.ProposalCompanyRepo;
import com.ibk.sb.restapi.biz.service.prplcm.vo.RequestPropsalCompanyPageVo;
import com.ibk.sb.restapi.biz.service.vc.repo.VentureCapitalRepo;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestAmountVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestDetailVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestRegionVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminVcService {

    private final AdminVcRepo repo;
    private final FileUtil fileUtil;
    private final FundRepo fundRepo;
    private final CompanyRepo companyRepo;
    private final MessageSource messageSource;
    private final CommonFileService commonFileService;
    private final VentureCapitalRepo ventureCapitalRepo;
    private final ProposalCompanyRepo proposalCompanyRepo;
    private final PlatformAlarmService platformAlarmService;

    private final InvestorRelationRepo investorRelationRepo;

    private final PlatformDocumentService platformDocumentService;
    private final PlatformAccountService platformAccountService;

    /**
     * 투자사 전환 프로세스 수정
     *
     * 기존 :
     *
     * 투자희망기업 전환 요청 ->
     *
     *
     */


    /**
     * 로그인 이용기관 투자사 전환 요청 처리
     * @throws Exception
     */
    public void requestConvertToVc(AdminVcConvertRequestVO requestVO) throws Exception {
        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자시 목록 기등록 유무 확인
        AdminConvertVcHistoryVO beforeData = repo.selectVcByUsisIdWithoutFilterUseYn(user.getUserGroupId());
        // 등록 정보가 없는 경우 등록 및 이력 저장
        if(beforeData == null) {
            // 서순 : 등록 작업 -> 이력 저장
            repo.insertVcListStandBy(AdminConvertVcHistoryVO.builder()
                    .utlinsttId(user.getUserGroupId())
                    .invmCmpPtrnCd(ComCode.VC_TYPE_VC.getCode()) // default VC
                    .rgsnUserId(user.getUsername())
                    .amnnUserId(user.getUsername())
                    .build());

            repo.insertVcListConvertHistory(AdminConvertVcHistoryVO.builder()
                    .utlinsttId(user.getUserGroupId())
                    .build());
        }

        // 투자사 전환 요청 등록
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setCnvsRqstSttsCdId(ComCode.CONVERT_VC_STANDBY.getCode());
        requestVO.setRgsnUserId(user.getUsername());
        requestVO.setAmnnUserId(user.getUsername());
        requestVO.setRgsnUserNm(user.getUserNm());

        repo.insertRequestConvertVC(requestVO);
    }

    /**
     * 로그인 이용기관 투자사 전환 요청 처리
     * @throws Exception
     */
    public void requestConvertToVcNew(InvmCnvrsRegSaveToVcVO requestVO) throws Exception {
        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자사 목록 기등록 유무 확인
        AdminConvertVcHistoryVO beforeData = repo.selectVcByUsisIdWithoutFilterUseYn(user.getUserGroupId());
        // 등록 정보가 없는 경우 등록 및 이력 저장
        if(beforeData == null) {
            // 서순 : 등록 작업 -> 이력 저장
            repo.insertVcListStandBy(AdminConvertVcHistoryVO.builder()
                    .utlinsttId(user.getUserGroupId())
                    .invmCmpPtrnCd(ComCode.VC_TYPE_VC.getCode()) // default VC
                    .rgsnUserId(user.getUsername())
                    .amnnUserId(user.getUsername())
                    .build());
            repo.insertVcListConvertHistory(AdminConvertVcHistoryVO.builder()
                    .utlinsttId(user.getUserGroupId())
                    .build());
        }
        // 지존에 기타 항목 삭제
        repo.deleteEtcInptItmMngm(user.getUserGroupId());
        // 기타 항목 존재 한 경우 등록 실행
        if (!requestVO.getEtcList().isEmpty()){
            for(int i = 0; i < requestVO.getEtcList().size(); ++i) {
                EtcInptItmMngmVO box = new EtcInptItmMngmVO();
                box.setCmpnNm(requestVO.getCmpnNm()); // 회사명
                box.setBzn(requestVO.getBzn()); // 사업자 등록번호
                box.setUtlinsttId(user.getUserGroupId());
                box.setInpiItm(requestVO.getEtcList().get(i));
                box.setAmnnId(user.getUsername());
                
                switch (i) {
                    case 0:
                        box.setDsnc(IvtCode.Etc01Info.ETC01001.getType());
                        break;
                    case 1:
                        box.setDsnc(IvtCode.Etc01Info.ETC01002.getType());
                        break;
                    case 2:
                        box.setDsnc(IvtCode.Etc01Info.ETC01003.getType());
                        break;
                    case 3:
                        box.setDsnc(IvtCode.Etc01Info.ETC01004.getType());
                        break;
                    default:
                        break;
                }
                box.setRgsrId(user.getUsername());
                box.setRgsrNm(requestVO.getRprNm());

                repo.insertEtcInptItmMngm(box);
            }
        }
        // 대표이사 정보 등록
        if (!requestVO.getRpdirInfoList().isEmpty()){
            setInvmHnfInfoList(requestVO,requestVO.getRpdirInfoList(),user,IvtCode.HmrsInfo.IHI01001.getType());
        }
        // 투자사인력 정보 등록
        if (!requestVO.getIvcpHmrsInfoList().isEmpty()){
            setInvmHnfInfoList(requestVO,requestVO.getIvcpHmrsInfoList(),user,IvtCode.HmrsInfo.IHI01002.getType());
        }
        // 관리인력 정보 등록
        if (!requestVO.getMngmHmrsInfoList().isEmpty()){
            setInvmHnfInfoList(requestVO,requestVO.getMngmHmrsInfoList(),user,IvtCode.HmrsInfo.IHI01003.getType());
        }

        /** 주주 정보 등록 && 수정 **/
        // 기존 주주정보 삭제
        investorRelationRepo.deleteCompanyIRStockHolderList(user.getUserGroupId());

        int seq = 1;
        for (IrStockHolderVO item : requestVO.getStchInfo()) {
            // 기업 아이디, 시퀀스 세팅
            item.setUtlinsttId(user.getUserGroupId());
            item.setStchSqn(seq);

            // 등록자 아이디 세팅
            item.setRgsnUserId(user.getUsername());
            item.setAmnnUserId(user.getUsername());

            // 주주명이 있는 경우만 insert
            if(StringUtils.hasLength(item.getStchNm())) {
                // 주주 항목 등록
                investorRelationRepo.insertCompanyIRStockHolder(item);
                seq++;
            }
        }

        // 투자사 전환 요청 등록
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setInvmCnvsStts("CVS01001"); // 요청 상태 로 최초 셋팅
        requestVO.setAmnnUserId(user.getUsername());

        // 기존에 투자사 전환 등록
        AdminVcConvertRequestVO isRequestVO = new AdminVcConvertRequestVO();
        isRequestVO.setUtlinsttId(user.getUserGroupId());
        isRequestVO.setBrgcFileId(requestVO.getFileId());
        isRequestVO.setCnvsRqstSttsCdId(ComCode.CONVERT_VC_STANDBY.getCode());
        isRequestVO.setRgsnUserId(user.getUsername());
        isRequestVO.setAmnnUserId(user.getUsername());
        isRequestVO.setRgsnUserNm(user.getUserNm());

        repo.insertRequestConvertVC(isRequestVO);
        repo.insertRequestConvertVCNew(requestVO);
    }

    public void setInvmHnfInfoList(InvmCnvrsRegSaveToVcVO resVO,List<CnvrsHnfInfoVO> list, CustomUser user,String type) {
        resVO.setRpdirInfoList(list.stream().filter((item)-> !item.getInvmHnfNm().isEmpty()).collect(Collectors.toList()));
        list.forEach(item -> {
            item.setUtlinsttId(user.getUserGroupId());
            item.setInvmHnfInfoCd(type);
            repo.insertCnvrsHnfInfo(item);
        });
    }


    public AdminVcConvertRequestVO searchRecentRequestConvert(String usisId) throws Exception {
        if(!StringUtils.hasLength(usisId)) throw new BizException(StatusCode.COM0005);
        return repo.selectRecentVcConvertRequest(usisId);
    }


    /**
     * 운영자 포탈 - 투자사 회원관리 (투자사 전환 목록 조회)
     *
     * @return
     */
    public PagingVO<AdminConvertSummaryVO> searchVcConvertList(RequestVcConvertSearchVO params) throws Exception {
        List<AdminConvertSummaryVO> list = repo.selectVcConvertList(params);
        list = list == null ? new ArrayList<>() : list;
        return new PagingVO<>(params, list);
    }
    /**
     * 운영자 포탈 - 투자사 (투자사 전환 목록 조회 간접투자 신규)
     *
     * @return
     */
    public PagingVO<AdminConvertSummaryNewVO> selectVcConvertListNew(RequestSearchEtcVO params) throws Exception {
        List<AdminConvertSummaryNewVO> list = repo.selectVcConvertListNew(params);
        list = list == null ? new ArrayList<>() : list;
        return new PagingVO<>(params, list);
    }

    /**
     * 운영자 포탈 - (투자사 전환 상세 정보 조회 간접투자 신규:[기업기본정보 + 투자사 전환 정보])
     *
     * @return
     */
    public Optional<InvmCnvrsRegSaveToVcVO> searchCompanyBasic(String companyId) throws Exception {

        // 기업 조회수 업데이트
        companyRepo.mergeCompanyViewCount(companyId);

        // 기업 기본정보 조회 및 id 유효성 검사
        CompanyBasicVO companyBasicVO = companyRepo.selectCompanyBasic(companyId, "vcSelect");
        if (companyBasicVO == null) {
            throw new BizException(StatusCode.COM0005);
        }
        // 관심분야 태그 리스트 조회
        List<CompanyInterestVO> interestList = companyRepo.selectCompanyInterestTagList(companyId);
        if (!interestList.isEmpty()) {
            companyBasicVO.setCnrnFildList(interestList);
        }

        // 플랫폼 기업 정보 매핑
        companyBasicVO = setCompanyBasicPlatformInfo(companyBasicVO);

        Optional<InvmCnvrsRegSaveToVcVO> requestVO = repo.selectConvertInfo(companyId);
        if (!requestVO.isPresent()) {
            throw new BizException(StatusCode.COM0005);
        }
        requestVO.get().setCompanyBasicVO(companyBasicVO);
        // 협약 벤처 기관 여부 셋팅
        if (requestVO.get().getAgrnVncnYn().equals("0")){
            requestVO.get().setAgrnVncnYn("N");
        } else {
            requestVO.get().setAgrnVncnYn("Y");
        }

        // 투자사 주요투자지역 조회
        List<VcInvestRegionVO> investRegionList = ventureCapitalRepo.selectVCInvestRegionList(companyId);
        if (!investRegionList.isEmpty()) {
            requestVO.get().setInvestRegionList(investRegionList);
        }

        // 투자사 주요활용기술 조회
        VcInvestAmountVO amountVO = ventureCapitalRepo.selectVCInvestAmount(companyId);
        if (amountVO != null) {
            requestVO.get().setInvestAmount(amountVO);
        }

        // 펀드제안 목록 조회
        FundPrdtInfoPageVO fundPrdtInfoPageVO = new FundPrdtInfoPageVO();
        fundPrdtInfoPageVO.setUtlinsttId(companyId);
        List<FundPrdtInfoVO> fundList = fundRepo.searchFundList(fundPrdtInfoPageVO);
        if (!fundList.isEmpty()) {
            requestVO.get().setFundList(fundList);
        }
        //투자기업 추천 정보
        RequestPropsalCompanyPageVo inVO = new  RequestPropsalCompanyPageVo();
        inVO.setUserGroupId(companyId);
        List<PrplCmVO> proposalCompanyList =  proposalCompanyRepo.selectProposalCompanyList(inVO);
        if (!proposalCompanyList.isEmpty()){
            requestVO.get().setProposalCompanyList(proposalCompanyList);
        }
        // 투자사 운용보고서 목록 조회
        List<OrrpInfoVO> selectOrrpInfo = repo.selectOrrpInfo(companyId);
        if (!selectOrrpInfo.isEmpty()){
            requestVO.get().setOrrpInfoList(selectOrrpInfo);
        }
        // 투자사 출자정보 조회
        List<FncnInfoVO> selectFncnInfoList = repo.selectFncnInfoList(companyId);
        if (!selectFncnInfoList.isEmpty()){
            requestVO.get().setFncnInfoList(selectFncnInfoList);
        }

        // 기업 마이페이지 설정 투자정보 매핑
        CompanyInvestVO companyInvestData = searchCompanyInvestHope(companyId);

        // 공개 설정이 아닌 경우
        if (!(StringUtils.hasLength(companyInvestData.getInvestHope().getOppbYn())
                && companyInvestData.getInvestHope().getOppbYn().equals(IvtCode.YnTypeEnum.Y.name()))) {
            companyInvestData.getInvestHope().setInvmAmt(null);
            companyInvestData.getInvestHope().setInvmAmtCd("");
            companyInvestData.getInvestHope().setInvmAmtNm("");

            companyInvestData.getInvestHope().setInvmStgCd("");
            companyInvestData.getInvestHope().setInvmStgNm("");
        }

        return requestVO;
    }

    /**
     * 운영자 포탈 - 투자사 전환 (기타 항목 조회)
     *
     * @return
     */
    public PagingVO<EtcInptItmMngmVO> searchVcEtcList(RequestSearchEtcVO params) throws Exception {
        List<EtcInptItmMngmVO> list = repo.searchVcEtcList(params);
        list = list == null ? new ArrayList<>() : list;
        return new PagingVO<>(params, list);
    }

    /**
     * 운영자 포탈 -  투자희망기업 -> 투자사 전환
     *
     * @param requestBodyAdminVO
     * @return
     */
    public boolean convertToInvestor(RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        // 아이디 확인
        if (!(requestBodyAdminVO.getParams() != null && StringUtils.hasLength(requestBodyAdminVO.getParams()))) throw new BizException(StatusCode.COM9998);

        // 최근 투자사 전환 요청 확인
        AdminVcConvertRequestVO recentData = repo.selectRecentVcConvertRequest(requestBodyAdminVO.getParams());

        // 최근 투자사 전환 정보 조회 요청 확인 : 간접투자 추가
        RequestSearchEtcVO requestSearchEtcVO = new RequestSearchEtcVO();
        requestSearchEtcVO.setUtlinsttId(requestBodyAdminVO.getParams());
        List<AdminConvertSummaryNewVO> convertRequest = repo.selectVcConvertListNew(requestSearchEtcVO);

        // 최근 투자사 전환 요청이 대기 상태일 경우 승인 처리
        if(recentData != null
            && (!convertRequest.isEmpty())
            && (!convertRequest.get(0).getInvmCnvsStts().equals(IvtCode.CvsStg.CVS01002.getType()))) {

            recentData.setCnvsRqstSttsCdId(ComCode.CONVERT_VC_COMPLETE.getCode());
            recentData.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
            repo.updateVcConvertRequest(recentData);

            requestSearchEtcVO.setDsnc(IvtCode.CvsStg.CVS01002.getType());
            requestSearchEtcVO.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

            repo.updateVcConvertRequestNew(requestSearchEtcVO);
        }

//        if (!(requestBodyAdminVO.getList() == null)) {
//            for(int i = 0; i < requestBodyAdminVO.getList().size(); ++i) {
//                FncnInfoVO box = new FncnInfoVO();
//                box.setMemo(requestBodyAdminVO.getList().get(i).getMemo());
//                box.setFncnAmt(requestBodyAdminVO.getList().get(i).getFncnAmt());
//                box.setRgsrId(requestBodyAdminVO.getList().get(i).getRgsrId());
//                box.setRgyeDsnc(requestBodyAdminVO.getList().get(i).getRgyeDsnc());
//                assert recentData != null;
//                box.setUtlinsttId(recentData.getUtlinsttId());
//                repo.insertFncnInfo(box);
//            }
//        }
        /* 현재 진행중인 투자심사, 컨설팅 만료처리 */

         // 완료, 만료 처리되지 않은 투자심사 (마지막 상태가 제안, 요청, 진행중) 리스트 조회
        repo.cancelAuditOngoing(
                requestBodyAdminVO.getParams(),
                requestBodyAdminVO.getAdminUser().getAdminUserId(),
                ComCode.AUDIT_SUGGEST.getCode(),
                ComCode.AUDIT_REQUEST.getCode(),
                ComCode.AUDIT_EVALUATE.getCode(),
                ComCode.AUDIT_EXPIRED.getCode()
        );

        // 컨설팅 취소 처리
        repo.cancelStandbyConsulting(new RequestVcConvertConsultingCancelVO(requestBodyAdminVO.getParams(), requestBodyAdminVO.getAdminUser().getAdminUserId()));

//        repo.cancelStandbyQna(new RequestVcConvertQnaCancelVO(requestBodyAdminVO.getParams(), requestBodyAdminVO.getAdminUser().getAdminUserId()));


        /* 투자사 목록 및 전환 이력 수정 (서순 : 목록 업데이트 -> 이력저장)  */

        // 목록 정보 투자사 여부 전환
        AdminConvertVcHistoryVO investor = AdminConvertVcHistoryVO.builder()
                .utlinsttId(requestBodyAdminVO.getParams())
                .useYn(IvtCode.YnTypeEnum.Y.name())
                .build();

        repo.updateVcListConvertStatus(investor);

        // 전환 이력 저장
        repo.insertVcListConvertHistory(investor);


        /* 투자사 전환요청 승인 알림 발송 */

        // 알림 아이디, 타이틀, base url 설정
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(AlarmCode.AlarmCodeEnum.CONVERT_TO_INVESTOR, AlarmCode.AlarmLinkEnum.CONVERT_INVESTOR_URL);

        // 알림 내용 설정
        requestAlarmVO.setAlrtCon(
                messageSource.getMessage(
                        AlarmCode.AlarmCodeEnum.CONVERT_TO_INVESTOR.getTemplateId(),
                        new Object[]{},
                        null
                )
        );

        // 알림 전송
        InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, requestBodyAdminVO.getParams(), requestBodyAdminVO.getAdminUser());
        // 알림 전송 결과 저장
        platformAlarmService.saveInvestAlarmSendResult(alarmResult);

        return true;
    }

    /**
     * 운영자 포탈 - 투자사 -> 투자희망기업 전환
     *
     * @param requestBodyAdminVO
     * @return
     */
    public boolean convertToCompany(RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        // 아이디 확인
        if (!(requestBodyAdminVO.getParams() != null
                && StringUtils.hasLength(requestBodyAdminVO.getParams()))) throw new BizException(StatusCode.COM9998);

        /* 현재 진행중인 투자심사 만료처리 */

        // 완료, 만료 처리되지 않은 투자심사 (마지막 상태가 제안, 요청, 진행중) 리스트 조회
        repo.cancelAuditOngoing(
                requestBodyAdminVO.getParams(),
                requestBodyAdminVO.getAdminUser().getAdminUserId(),
                ComCode.AUDIT_SUGGEST.getCode(),
                ComCode.AUDIT_REQUEST.getCode(),
                ComCode.AUDIT_EVALUATE.getCode(),
                ComCode.AUDIT_EXPIRED.getCode()
        );

        /* 투자사 목록 및 전환 이력 수정 (서순 : 목록 업데이트 -> 이력저장)  */

        // 목록 정보 투자사 여부 전환
        AdminConvertVcHistoryVO investor = AdminConvertVcHistoryVO.builder()
            .utlinsttId(requestBodyAdminVO.getParams())
            .useYn(IvtCode.YnTypeEnum.N.name())
            .build();

        repo.updateVcListConvertStatus(investor);

        // 투자사 전환 정보 수정 : 승인 완료
        RequestSearchEtcVO requestSearchEtcVO = new RequestSearchEtcVO();
        requestSearchEtcVO.setUtlinsttId(requestBodyAdminVO.getParams());
        requestSearchEtcVO.setDsnc(IvtCode.CvsStg.CVS01003.getType());
        requestSearchEtcVO.setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        repo.updateVcConvertRequestNew(requestSearchEtcVO);

        if (requestBodyAdminVO.getList() == null){
            log.debug("requestBodyAdminVO.getList() == null11111111111111");
        } else {
            log.debug("requestBodyAdminVO.getList() == null2222222222222222");
        }

//        if (!(requestBodyAdminVO.getList() == null)) {
//            for(int i = 0; i < requestBodyAdminVO.getList().size(); ++i) {
//                FncnInfoVO box = new FncnInfoVO();
//                box.setMemo(requestBodyAdminVO.getList().get(i).getMemo());
//                box.setFncnAmt(requestBodyAdminVO.getList().get(i).getFncnAmt());
//                box.setRgsrId(requestBodyAdminVO.getList().get(i).getRgsrId());
//                box.setRgyeDsnc(requestBodyAdminVO.getList().get(i).getRgyeDsnc());
//                box.setUtlinsttId(requestBodyAdminVO.getList().get(i).getUtlinsttId());
//                repo.insertFncnInfo(box);
//            }
//        }

        // 전환 이력 저장
        repo.insertVcListConvertHistory(investor);

        /* 투자사 전환요청 반려 알림 발송 */

        // 알림 아이디, 타이틀, base url 설정
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(AlarmCode.AlarmCodeEnum.CONVERT_TO_COMPANY, AlarmCode.AlarmLinkEnum.CONVERT_COMPANY_URL);

        // 알림 내용 설정
        requestAlarmVO.setAlrtCon(
                messageSource.getMessage(
                        AlarmCode.AlarmCodeEnum.CONVERT_TO_COMPANY.getTemplateId(),
                        new Object[]{},
                        null
                )
        );

        // 알림 전송
        InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, requestBodyAdminVO.getParams(), requestBodyAdminVO.getAdminUser());
        // 알림 전송 결과 저장
        platformAlarmService.saveInvestAlarmSendResult(alarmResult);

        return true;
    }
    
    /**
     * 운영자 포탈 - 투자사 -> 출자정보 저장
     *
     * @param requestBodyAdminVO
     * @return
     */
    public boolean saveFncnInfo(RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        // 아이디 확인
        if (!(requestBodyAdminVO.getParams() != null
                && StringUtils.hasLength(requestBodyAdminVO.getParams()))) throw new BizException(StatusCode.COM9998);


        if (requestBodyAdminVO.getList() == null){
            log.debug("requestBodyAdminVO.getList() == null11111111111111");
        } else {
            log.debug("requestBodyAdminVO.getList() == null2222222222222222");
        }
        
        //기존값 삭제
        repo.deleteFncnInfo(requestBodyAdminVO.getParams());
        
        
        if (!(requestBodyAdminVO.getList() == null)) {
            for(int i = 0; i < requestBodyAdminVO.getList().size(); ++i) {
            	log.info("requestBodyAdminVO.getList().size() : {} >> " + requestBodyAdminVO.getList().size());
            	log.info("requestBodyAdminVO.getList().get(i).getMemo() : {} >> " + requestBodyAdminVO.getList().get(i).getMemo());
            	log.info("requestBodyAdminVO.getList().get(i).getFncnAmt() : {} >> " + requestBodyAdminVO.getList().get(i).getFncnAmt());
            	log.info("requestBodyAdminVO.getAdminUser().getAdminUserId() : {} >> " + requestBodyAdminVO.getAdminUser().getAdminUserId());
            	log.info("requestBodyAdminVO.getList().get(i).getRgyeDsnc() : {} >> " + requestBodyAdminVO.getList().get(i).getRgyeDsnc());
            	log.info("requestBodyAdminVO.getParams() : {} >> " + requestBodyAdminVO.getParams());
                FncnInfoVO box = new FncnInfoVO();
                box.setMemo(requestBodyAdminVO.getList().get(i).getMemo());
                box.setFncnAmt(requestBodyAdminVO.getList().get(i).getFncnAmt());
                box.setRgsrId(requestBodyAdminVO.getAdminUser().getAdminUserId());
                box.setRgyeDsnc(requestBodyAdminVO.getList().get(i).getRgyeDsnc());
                box.setUtlinsttId(requestBodyAdminVO.getParams());
                repo.insertFncnInfo(box);
            }
        }


        return true;
    }

    /**
     * 운영자 포탈 - 전환 목록 엑셀 다운로드
     *
     * @param requestVcConvertSearchVO
     * @param response
     * @return
     */
    public void convertListExcelDownload(RequestVcConvertSearchVO requestVcConvertSearchVO, HttpServletResponse response) throws Exception {

        // 투자사전환 요청 목록 전체 조회
        requestVcConvertSearchVO.setPage(null);
        requestVcConvertSearchVO.setRecord(null);
        List<AdminConvertSummaryVO> convertList = repo.selectVcConvertList(requestVcConvertSearchVO);

        ExcelFormVO excelFormVO = new ExcelFormVO(AdminConvertSummaryVO.class, convertList, "투자사 전환요청 목록");
        excelFormVO.setHeaderTitle("투자사 전환요청 목록");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
    /**
     * 운영자 포탈 - 기타 입력 항목 관리 다운로드
     *
     * @param requestSearchEtcVO
     * @param response
     * @return
     */
    public void etcListExcelDownload(RequestSearchEtcVO requestSearchEtcVO, HttpServletResponse response) throws Exception {

        // 투자사전환 요청 목록 전체 조회
        requestSearchEtcVO.setPage(null);
        requestSearchEtcVO.setRecord(null);
        List<EtcInptItmMngmVO> convertList = repo.searchVcEtcList(requestSearchEtcVO);
        
        for (int i=0 ; i<convertList.size() ; i++) {
        	if(convertList.get(i).getDsnc().equals("ETC01001")) {
        		convertList.get(i).setDsncNm("관심비즈니스분야");   		
        	} 
        	if(convertList.get(i).getDsnc().equals("ETC01002")) {
        		convertList.get(i).setDsncNm("활용기술");
        	}
        	if(convertList.get(i).getDsnc().equals("ETC01003")) {
        		convertList.get(i).setDsncNm("주요투자업종");
        	}
        	if(convertList.get(i).getDsnc().equals("ETC01004")) {
        		convertList.get(i).setDsncNm("주요투자단계");
        	}
        }
        
        ExcelFormVO excelFormVO = new ExcelFormVO(EtcInptItmMngmVO.class, convertList, "기타 입력 항목 관리");
        excelFormVO.setHeaderTitle("기타 입력 항목 관리");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

    /**
     * 운영자 포탈 - 투자사 전환 목록 정보 다운로드
     *
     * @param requestSearchEtcVO
     * @param response
     * @return
     */
    public void vcListExcelDownload(RequestSearchEtcVO requestSearchEtcVO, HttpServletResponse response) throws Exception {

        // 투자사전환 요청 목록 전체 조회
        requestSearchEtcVO.setPage(null);
        requestSearchEtcVO.setRecord(null);
        List<AdminConvertSummaryNewVO> convertList = repo.selectVcConvertListNew(requestSearchEtcVO);
        
        for (int i=0 ; i<convertList.size() ; i++) {
        	if(convertList.get(i).getInvmCnvsStts().equals("CVS01001")) {
        		convertList.get(i).setInvmCnvsSttsNm("요청");   		
        	} 
        	if(convertList.get(i).getInvmCnvsStts().equals("CVS01002")) {
        		convertList.get(i).setInvmCnvsSttsNm("승인완료");
        	}
        	if(convertList.get(i).getInvmCnvsStts().equals("CVS01003")) {
        		convertList.get(i).setInvmCnvsSttsNm("대기");
        	}
        }
        
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminConvertSummaryNewVO.class, convertList, "VC 관리");
        excelFormVO.setHeaderTitle("VC 관리");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

    /**
     * 운영자 포탈 - 전환 대상 사업자등록증 다운로드
     * @param utlinsttId
     * @param response
     * @throws Exception
     */
    public void licenseFileDownload(String utlinsttId, HttpServletResponse response) throws Exception {
        if(!StringUtils.hasLength(utlinsttId)) throw new BizException(StatusCode.COM0005);

        String infotechLicensePdfHex = null;       // 인포텍 스크래핑 사업자등록증 pdfHex
        ComFileInfoVO registeredLicenseFile = null;    // 전환요청시 등록한 사업자등록증

        // 최근 등록된 전환 요청 조회
        AdminVcConvertRequestVO recentConvertReq = repo.selectRecentVcConvertRequest(utlinsttId);
        if(recentConvertReq != null && StringUtils.hasLength(recentConvertReq.getBrgcFileId())) {
            registeredLicenseFile = commonFileService.searchFile(recentConvertReq.getBrgcFileId());
        }

        // 기등록 infotech cloud key 조회
        AdminConvertVcHistoryVO targetUsis = repo.selectVcByUsisIdWithoutFilterUseYn(utlinsttId);
        String clientKey = platformDocumentService.searchInfotechClientKey(targetUsis.getBzn());

        String fileName = new StringBuilder()
                .append(targetUsis.getBplcNm())
                .append("(").append(targetUsis.getBzn()).append(")")
                .append(".pdf")
                .toString();

        // clientKey가 있는 경우 사업자등록증 pdf 조회
        if(StringUtils.hasLength(clientKey)) {
            // request parameter set
            RequestCmmScpVO baseScpRequest = RequestCmmScpVO.builder()
                    .clientCertKey(clientKey)
                    .bizNo(targetUsis.getBzn())
                    .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
                    .docCd(CmmScpConst.DocTypeEnum.INFOTECH_BIZ_LICENSE.getCode())
                    .build();

            Map<String, String> addParam = new HashMap<>();
            addParam.put("pdfYnE101", IvtCode.YnTypeEnum.Y.name());

            try {
                InfotechContentVO.E101PdfOnly scpRslt = platformDocumentService
                        .searchCmmScpInfotechData(baseScpRequest, InfotechContentVO.E101PdfOnly.class, addParam);
                if(scpRslt != null && StringUtils.hasLength(scpRslt.getPdfHex()))
                    infotechLicensePdfHex = scpRslt.getPdfHex();
            }
            // 검색실패, 서버 통신 문제 등의 경우 이미지 파일을 전송
            // 그외 exception, bizException의 경우 throw 처리
            catch (BizException bx) {
                log.error("Scrapping Biz License Error : {}", bx.getErrorMsg());
                if(!bx.getErrorCode().equals(StatusCode.MNB0003)
                    && !bx.getErrorCode().equals(StatusCode.MNB0001)) throw bx;
            }

            // pdf hex 변환 전송
            if(StringUtils.hasLength(infotechLicensePdfHex)) {
                commonFileService.pdfHexStrFileDownload(
                        infotechLicensePdfHex, fileName, response);
            }
        }

        // 등록 사업자 번호 이미지 (or PDF) 다운로드
        else if(registeredLicenseFile != null && StringUtils.hasLength(registeredLicenseFile.getFilePtrn())
            && (registeredLicenseFile.getFilePtrn().startsWith("image") || registeredLicenseFile.getFilePtrn().equals(MediaType.APPLICATION_PDF_VALUE))) {
            commonFileService.downloadFile(
                    registeredLicenseFile.getFileId(), response, IvtCode.YnTypeEnum.N);
        }

        else {
            // 검색 실패 throw
            // api 호출시 responseType setting blob으로 이뤄지기 때문에
            // exception 코드를 받는다기보단 content-type으로 확인할 수 밖에 없음
            throw new BizException(StatusCode.MNB0003);
        }
    }
    /**
     * 기업 기본정보 - 플랫폼 정보 매핑
     *
     * @param companyBasicVO
     * @return
     * @throws Exception
     */
    public CompanyBasicVO setCompanyBasicPlatformInfo(CompanyBasicVO companyBasicVO) throws Exception {

        // 기업 정보 조회
        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyById(companyBasicVO.getUtlinsttId());

        if (mainCompanyVO != null) {
            // 기업 기본정보 추가 매핑
            companyBasicVO.setRprsntvNm(mainCompanyVO.getRprsntvNm()); // 대표자명
            companyBasicVO.setReprsntTelno(mainCompanyVO.getReprsntTelno()); // 대표 전화번호
            companyBasicVO.setReprsntEmail(mainCompanyVO.getReprsntEmail()); // 대표 이메일
            companyBasicVO.setReprsntFxnum(mainCompanyVO.getReprsntFxnum()); // 대표 팩스번호
            companyBasicVO.setHmpgAdres(mainCompanyVO.getHmpgAdres()); // 홈페이지 주소
            companyBasicVO.setBizrno(mainCompanyVO.getBizrno()); // 사업자등록번호
            companyBasicVO.setJurirno(mainCompanyVO.getJurirno()); // 법인등록번호
            companyBasicVO.setPostNo(mainCompanyVO.getPostNo()); // 우편번호
            companyBasicVO.setSalamt(mainCompanyVO.getSalamt()); // 매출

            // 주소처리
            if (StringUtils.hasLength(mainCompanyVO.getNwAdresAt()) && mainCompanyVO.getNwAdresAt().equals(IvtCode.YnTypeEnum.Y.name())) {
                companyBasicVO.setAddr(mainCompanyVO.getNwAdres() + mainCompanyVO.getNwAdresDetail());
            } else {
                companyBasicVO.setAddr(mainCompanyVO.getAdres() + mainCompanyVO.getDetailAdres());
            }

            // 로고 이미지 파일 경로
            companyBasicVO.setLogoImageUrl(fileUtil.setMainboxLogoUrl(mainCompanyVO.getLogoImageFile()));

        } else {
            companyBasicVO.setRprsntvNm(""); // 대표자명
            companyBasicVO.setReprsntTelno(""); // 대표 전화번호
            companyBasicVO.setReprsntEmail(""); // 대표 이메일
            companyBasicVO.setReprsntFxnum(""); // 대표 팩스번호
            companyBasicVO.setHmpgAdres(""); // 홈페이지 주소
            companyBasicVO.setBizrno(""); // 사업자등록번호
            companyBasicVO.setJurirno(""); // 법인등록번호
            companyBasicVO.setPostNo(""); // 우편번호
            companyBasicVO.setSalamt(null); // 매출
            companyBasicVO.setAddr("");
            companyBasicVO.setLogoImageUrl(fileUtil.setMainboxLogoUrl(""));
        }

        return companyBasicVO;
    }
    /**
     * 기업 투자희망 정보 조회
     *
     * @return
     * @throws Exception
     */
    public CompanyInvestVO searchCompanyInvestHope(String companyId) throws Exception {

        CompanyInvestVO result = new CompanyInvestVO();

        // 기업 투자희망 정보 조회
        CompanyInvestHopeVO companyInvestHopeVO = companyRepo.selectCompanyInvestHope(companyId);
        result.setInvestHope(companyInvestHopeVO == null ? new CompanyInvestHopeVO() : companyInvestHopeVO);

        // 공개여부, 해외진출희망여부 기본값 설정
        if (!StringUtils.hasLength(result.getInvestHope().getOppbYn())) result.getInvestHope().setOppbYn(IvtCode.YnTypeEnum.N.name());
        if (!StringUtils.hasLength(result.getInvestHope().getOsivHopeyn())) result.getInvestHope().setOsivHopeyn(IvtCode.YnTypeEnum.N.name());

        // 기업 비즈니스 분야 정보 조회
        List<CompanyInvestFieldVO> investFieldList = companyRepo.selectCompanyInvestFieldList(companyId);
        result.setInvestFieldList(investFieldList == null ? new ArrayList<>() : investFieldList);

        // 기업 활용기술 정보 조회
        List<CompanyUtilTechVO> techList = companyRepo.selectCompanyUtilTechList(companyId);
        result.setUtilTechList(techList == null ? new ArrayList<>() : techList);

        return result;
    }

}
