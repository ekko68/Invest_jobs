package com.ibk.sb.restapi.biz.service.batch;

import com.ibk.sb.restapi.app.common.constant.*;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.DateUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.batch.repo.BatchRepo;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.UpdateAgreementCompanyVO;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.UpdateCompanyVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.FnstBrkdDVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapBizLicenseSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapRowsVO;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepo batchRepo;

    private final MessageSource messageSource;
    private final CompanyService companyService;
    private final InvestorRelationService irService;

    private final PlatformAlarmService platformAlarmService;
    private final PlatformDocumentService platformDocumentService;

    @Value("${spring.profiles.active:}")
    private String activeProfile;
    @Value("${ivt.open.date:}")
    private String ivtOpenDate;


    /**
     * 기업 기본 정보 갱신
     * Spring Transaction Annotation 특성상 (Proxy 패턴)
     * 동일 Bean(Service) 내부에서 서비스끼리 호출시
     * 내부에서 호출되는 서비스의 @Transaction을 새로운 전파속성으로 정의하더라도 소용이 없으므로
     * Controller단에서 for문으로 처리하며 개별로 transaction rollback mark try-catch 처리하는 것으로 수정
     *
     * (대신 컨트롤러에서 try-catch exception 전체를 잡아주거나,
     *  rollback mark를 처리하기 위해 UnexpectedRollbackException을 잡고 나머지 exception은 서비스 단에서 잡도록 한다.)
     *
     * @param updateCompanyVO
     * @throws Exception
     */
    public void updateUsisInfo (UpdateCompanyVO updateCompanyVO) {

        try {
            // 기업 정보 업데이트
            batchRepo.batchMergeEnprInfo(updateCompanyVO);

            // 투자박스 테이블 사업장 소재지 정보가 null일 경우 주소 정보 기반으로 초기 설정
            String province =
                    (StringUtils.hasLength(updateCompanyVO.getNwAdresAt()) && updateCompanyVO.getNwAdresAt().equals(IvtCode.YnTypeEnum.Y.name()))
                            ? updateCompanyVO.getNwAdres() : updateCompanyVO.getAdres();

            if(StringUtils.hasLength(province)) {
                province = province.trim();

                if(province.length() >= 2) {
                    if(province.length() >= 4) {
                        province = province.substring(0, 4);
                        switch (province) {
                            case "충청북도":
                                province = "충북";
                                break;
                            case "충청남도":
                                province = "충남";
                                break;
                            case "경상북도":
                                province = "경북";
                                break;
                            case "경상남도":
                                province = "경남";
                                break;
                            case "전라북도":
                                province = "전북";
                                break;
                            case "전라남도":
                                province = "전남";
                                break;
                            default:
                                province = province.substring(0, 2);
                                break;
                        }
                    } else {
                        province = province.substring(0, 2);
                    }

                    batchRepo.batchInitEnprProvinceSite(updateCompanyVO.getUtlinsttId(), province, ComGroupCode.BIZ_ADR.getCode());
                }
            }
        } catch (BizException bx) {
            log.error("Fail to update USIS data. (Business Exception code : {}) : (USIS ID : {})", bx.getErrorCode(), updateCompanyVO.getUtlinsttId());
        } catch (Exception ex) {
            log.error("Fail to update USIS data. (Exception message : {}) : (USIS ID : {})", ex.getMessage(), updateCompanyVO.getUtlinsttId());
        }
    }

    /**
     * 투자심사 기간만료 대상 목록 조회
     * 기간만료 투자심사 상태변경 처리 및 알림 발송처리
     * 기간만료 처리 기준 :
     * 1. 제안 후 60일 이내 요청단계 전환이 되지 않은 경우
     * -> 최신상태가 제안 + 60일 초과
     * 2. 요청 후 60일 이내 진행중 단계로 전환이 되지 않은 경우
     * -> 최신상태가 요청 + 60일 초과
     * 3. 투자심사 시작 후 180이내 심사완료 처리가 되지 않은 투자심사의 경우
     * -> 시작상태 날짜 + 180일 초과 + 최신상태가 심사완료, 기간만료, 취소가 아님
     * -> 시작상태 날짜 + 180일 초과 + 심사중 상태 (제안, 요청의 경우 1, 2에서 기간만료 처리됨)
     *
     * @throws Exception
     */
    public List<InvestAuditVO> searchBatchExpiredAuditList() throws Exception {

        String openDate = null;
        if(activeProfile.equals(IvtCode.ProfileNameEnum.PROD.getName())
            && StringUtils.hasLength(ivtOpenDate)) openDate = ivtOpenDate; // YYYYMMDD

        /**
         * 운영 데이터 이관 테스트 및 오픈을 위해 openDate 값이 있을 경우
         * 해당 날짜 이전의 투자심사건에 대해서는 제외한다.
         */
        // 기간만료 처리가 필요한 투자심사 목록 조회
        return batchRepo.selectExpireAuditTargetList(
                ComCode.AUDIT_SUGGEST.getCode(),
                ComCode.AUDIT_REQUEST.getCode(),
                ComCode.AUDIT_EVALUATE.getCode(),
                openDate
        );
    }

    /**
     * 기간만료 처리 및 알림 발송
     * 개별 Tx 적용을 위해 Controller에서 searchBatchExpiredAuditList와 분리하여 호출
     *
     * @param
     * @throws Exception
     */
    public void sendExpiredAuditAlarm(InvestAuditVO investAuditVO, RequestAlarmVO requestAlarmVO, AdminUserVO adminUserVO) {

        try {
            // 투자심사 기간만료 처리
            batchRepo.insertBatchInvestAuditStage(
                    investAuditVO.getInvmExntRqstId(),
                    ComCode.AUDIT_EXPIRED.getCode(),
                    " "
            );

            // 알림 내용 설정
            requestAlarmVO.setAlrtCon(
                    messageSource.getMessage(
                            AlarmCode.AlarmCodeEnum.AUDIT_OVER_TIME.getTemplateId(),
                            new Object[]{investAuditVO.getInvmCmpBplcNm(), investAuditVO.getRqstBplcNm()},
                            null
                    )
            );

            /**
             * 기업, 투자사 어느 한쪽 알림 발송시 exception이 발생하더라도 서비스 rollback
             * 서비스가 rollback 되었는데 메시지가 가는 해프닝과 서비스가 커밋되었는데 메시지가 가지 않는 해프닝 중 전자 선택
             *
             * -> 만약 후자로 바꿔야 할 경우 메서드 및 트랜잭션 분리 처리
             */

            // 기업 전송 알림 url 세팅
            requestAlarmVO.setPcLinkUrlCon(AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_COMPANY_URL.getBaseUrl() + investAuditVO.getInvmExntRqstId());
            // 투자심사 기간만료 기업 알림 발송
            InvestAlarmSendResultVO alarmResultEnpr = platformAlarmService.sendInvestAlarm(requestAlarmVO, investAuditVO.getRqstEnprId(), adminUserVO);
            // 기업 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResultEnpr);

            // 투자사 전송 알림 url 세팅
            requestAlarmVO.setPcLinkUrlCon(AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_VC_URL.getBaseUrl() + investAuditVO.getInvmExntRqstId());
            // 투자심사 기간만료 투자사 알림 발송
            InvestAlarmSendResultVO alarmResultInvm = platformAlarmService.sendInvestAlarm(requestAlarmVO, investAuditVO.getInvmCmpId(), adminUserVO);
            // 투자사 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResultInvm);

        } catch (BizException bx) {
            log.error("Fail Send Audit Expire Alarm (Business Exception code : {}) : {} (Audit ID : {})", bx.getErrorCode(), bx.getErrorMsg(), investAuditVO.getInvmExntRqstId());
        } catch (Exception ex) {
            log.error("Fail Send Audit Expire Alarm : {} (Audit ID : {})", ex.getMessage(), investAuditVO.getInvmExntRqstId());
        }
    }

    /**
     * 포괄적 동의 기업(기업사업자번호-ClientKey) 리스트 조회
     * @return
     * @throws Exception
     */
    public List<String> searchAgreementUpdateCompanyList() throws Exception {
        List<String> companyBasicList = batchRepo.selectAgreementUpdateCompanyList();
        return companyBasicList;
    }

    /**
     * 포괄적 동의 대상 기업 정보 인포텍 스크래핑 업데이트
     *
     * @return
     * @throws Exception
     */
    public UpdateAgreementCompanyVO setUpdateAgreementCompanyVO (CompanyBasicVO companyBasicVO) throws Exception{

        // 사업자번호 조회
        companyBasicVO = companyService.setCompanyBasicPlatformInfo(companyBasicVO);

        // 사업자번호(bizrno) 로 ClientCertKey 조회
        String clientCertKey = "";
        if (StringUtils.hasLength(companyBasicVO.getBizrno())) {
            clientCertKey = platformDocumentService.searchInfotechClientKey(companyBasicVO.getBizrno());
        }
        // 사업자번호(bizrno)가 존재하지 않는 경우, 에러
        else {
            log.error("Fail Search ClientCertKey : No Bizrno (UtlinsttId : {})", companyBasicVO.getUtlinsttId());
            //return ResponseData.builder().code("400").message("Fail Search ClientCertKey : No Bizrno (UtlinsttId :" + companyBasicVO.getUtlinsttId() + ")").build();
        }

        // ClientCertKey 가 존재하는 경우, 인포텍 조회 후, IR 업데이트
        if(StringUtils.hasLength(clientCertKey)) {
            // 포괄적동의 기업 VO 셋팅
            UpdateAgreementCompanyVO item = new UpdateAgreementCompanyVO(companyBasicVO.getUtlinsttId(), companyBasicVO.getBizrno(), companyBasicVO.getJurirno(), clientCertKey);
            return item;
        }
        // ClientCertKey 가 존재하지 않는 경우, 에러
        else {
            log.error("Fail Search ClientCertKey : No ClientCertKey (UtlinsttId : {}, Bizrno : {})", companyBasicVO.getUtlinsttId(), companyBasicVO.getBizrno());
            // return ResponseData.builder().code("400").message("Fail Search ClientCertKey : No ClientCertKey (UtlinsttId :" + requestData.getUtlinsttId() + ", Bizrno : " + requestData.getBizrno() + ")").build();
        }

        return null;
    }

    /**
     * INFOTECH 스크래핑 데이터 기업 IR 기본정보 갱신
     * 매핑 대상
     * 사업자명 - 상호(법인명)
     * 사업자등록번호 - 사업자등록번호
     * 설립일자 - 개인 : 사업자등록일 | 법인 : 개업일
     * 대표 - 대표자성명
     * 업종 - 업태/종목
     * 법인등록번호 - 법인등록번호
     * 주소 - 사업장소재지
     *
     * @param updateAgreementCompanyVO
     * @throws Exception
     */
    public void updateClientDataToIrBasic(UpdateAgreementCompanyVO updateAgreementCompanyVO, AdminUserVO adminUserVO) {
        try {
            if (!StringUtils.hasLength(updateAgreementCompanyVO.getUtlinsttId())
                    || !StringUtils.hasLength(updateAgreementCompanyVO.getClientCertKey())
                    || !StringUtils.hasLength(updateAgreementCompanyVO.getBizrno())) throw new BizException(StatusCode.COM0005);

            // 스크래핑 데이터 조회 (사업자등록증 정보)
            InfotechScrapBizLicenseSummaryVO licenseData = platformDocumentService
                    .searchInfotechHometaxBizInfo(updateAgreementCompanyVO.getClientCertKey(), updateAgreementCompanyVO.getBizrno());

            // IR 기본정보 이력 저장
            batchRepo.insertIRBasicInfoHistroy(updateAgreementCompanyVO.getUtlinsttId());

            // 스크래핑 데이터 to IR 매핑
            // 기존 IR 기본정보 조회
            InvestRelationVO ir = irService.searchIR(updateAgreementCompanyVO.getUtlinsttId());
//            ir.setUtlinsttId(updateAgreementCompanyVO.getUtlinsttId());

            if (StringUtils.hasLength(licenseData.getTxprNm())) ir.setBnnm(licenseData.getTxprNm());
            if (StringUtils.hasLength(licenseData.getTxprDscmNoEncCntn())) ir.setBzn(licenseData.getTxprDscmNoEncCntn());
            if (StringUtils.hasLength(licenseData.getScrapBizInfoRprsTxprNm())) ir.setRprnm(licenseData.getScrapBizInfoRprsTxprNm());
            if (StringUtils.hasLength(licenseData.getScrapBizInfoAddr())) ir.setAdr(licenseData.getScrapBizInfoAddr());
            if (StringUtils.hasLength(licenseData.getScrapBizInfoCrpno())) ir.setCgn(licenseData.getScrapBizInfoCrpno());

            // 업태 / 업종
            ir.setBtnm(new StringBuilder()
                    .append(StringUtils.hasLength(licenseData.getBcNm()) ? licenseData.getBcNm() : "")
                    .append(" / ")
                    .append(StringUtils.hasLength(licenseData.getItmNm()) ? licenseData.getItmNm() : "")
                    .toString());

            // 설립일 설정
            if (StringUtils.hasLength(licenseData.getTxprDscmDt()) || StringUtils.hasLength(licenseData.getBmanRgtDt())) {
                String col = "";
                if (StringUtil.hasLengthWithTrim(ir.getCgn())) col = DateUtil.checkFormat(licenseData.getTxprDscmDt());
                else col = DateUtil.checkFormat(licenseData.getBmanRgtDt());
                ir.setCol(col);
            }

            // 등록, 수정 사용자 설정
//            ir.setAmnnUserId(adminUserVO.getAdminUserId());
//            ir.setRgsnUserId(adminUserVO.getAdminUserId());

            // Secure Coding Access Key 점검사항 조치 TODO : 문서작성
            // ->   수정대상 key 설정을 다시 setter로 잡아줘도 조치대상에 들어가므로
            //      repo에서 조회된 항목에서 필요한 부분들을 새로운 인스턴스로 생성해서 처리
            // 스크래핑 데이터 IR 갱신
//            batchRepo.mergeIRBasicInfoFromInfotechScrapping(ir);
            batchRepo.mergeIRBasicInfoFromInfotechScrapping(InvestRelationVO.builder()
                    .utlinsttId(updateAgreementCompanyVO.getUtlinsttId())
                    .bnnm(ir.getBnnm())
                    .bzn(ir.getBzn())
                    .col(ir.getCol())
                    .rprnm(ir.getRprnm())
                    .btnm(ir.getBtnm())
                    .cgn(ir.getCgn())
                    .adr(ir.getAdr())
                    .zpcd(ir.getZpcd())
                    .rgsnUserId(adminUserVO.getAdminUserId())
                    .amnnUserId(adminUserVO.getAdminUserId())
                    .build());

            // IR 진행도 업데이트
            adminUserVO.setTargetUsisId(updateAgreementCompanyVO.getUtlinsttId());
            irService.saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_BASIC, ir.calcIRTabProgress(), adminUserVO);

        } catch (BizException bx) {
            log.error("Fail Update INFOTECH Scrapping Business License Data to Invest Box IR Basic (Business Exception code : {}) : {} (Bizrno : {})", bx.getErrorCode(), bx.getErrorMsg(), updateAgreementCompanyVO.getBizrno());
        } catch (Exception e) {
            log.error("Fail Update INFOTECH Scrapping Business License Data to Invest Box IR Basic : {} (Bizrno : {})", e.getMessage(), updateAgreementCompanyVO.getBizrno());
        }
    }

    /**
     * INFOTECH 스크래핑 데이터 기업 IR 재무정보 갱신
     *
     * @param updateAgreementCompanyVO
     * @throws Exception
     */
    public void updateClientDataToIrFinance(UpdateAgreementCompanyVO updateAgreementCompanyVO, AdminUserVO adminUserVO) {
        try {
            if (!StringUtils.hasLength(updateAgreementCompanyVO.getUtlinsttId())
                    || !StringUtils.hasLength(updateAgreementCompanyVO.getClientCertKey())
                    || !StringUtils.hasLength(updateAgreementCompanyVO.getBizrno())) throw new BizException(StatusCode.COM0005);

            // 과세기간 기준 설정 (전년도 1~12)
            String txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - 1, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
            String txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - 1, Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));

            // 스크래핑 데이터 조회 (표준재무제표 정보)
            InfotechScrapFinanceSummaryVO financialData = platformDocumentService
                    .searchInfotechHometaxFinanceInfo(
                            updateAgreementCompanyVO.getClientCertKey(), updateAgreementCompanyVO.getBizrno()
                            , txnrmStrtYm, txnrmEndYm);

            /** 법인 사업자일 경우에만 갱신처리 (IBK API 정책상) */
            if (financialData.getBmanBscInfrInqrDVO().getTxprDclsCd().equals("250")) { // 개인사업자 : 210
                // IR 재부정보 이력 저장
                batchRepo.insertIRFinancialInfoHisotry(updateAgreementCompanyVO.getUtlinsttId());

                // 스크래핑 데이터 to IR 매핑
                // 기존 IR 재무정보 조회
                IrFinanceVO financeVO = irService.searchIRFinance(updateAgreementCompanyVO.getUtlinsttId());
//                financeVO.setUtlinsttId(updateAgreementCompanyVO.getUtlinsttId());

                // 표준대차대조표
                financeVO = financialBalanceSheetScrapDataMappingIR(financialData.getFnstBrkdDVOList01(), financeVO);
                financeVO = financialBalanceSheetScrapDataMappingIR(financialData.getFnstBrkdDVOList02(), financeVO);
                // 손익계산서
                financeVO = incomeStatementScrapDataMappingIR(financialData.getFnstBrkdDVOPndlList01(), financeVO);
                financeVO = incomeStatementScrapDataMappingIR(financialData.getFnstBrkdDVOPndlList02(), financeVO);

                // 등록, 수정 사용자 설정
//                financeVO.setAmnnUserId(adminUserVO.getAdminUserId());
//                financeVO.setRgsnUserId(adminUserVO.getAdminUserId());

                // Secure Coding Access Key 점검사항 조치 TODO : 문서작성
                // ->   수정대상 key 설정을 다시 setter로 잡아줘도 조치대상에 들어가므로
                //      repo에서 조회된 항목에서 필요한 부분들을 새로운 인스턴스로 생성해서 처리
                // 스크래핑 데이터 IR 갱신
                batchRepo.mergeIRFinancialInfoFromInfotechScrapping(IrFinanceVO.builder()
                        .utlinsttId(updateAgreementCompanyVO.getUtlinsttId())
                        .flasAmt(financeVO.getFlasAmt())
                        .noneFlasAmt(financeVO.getNoneFlasAmt())
                        .lbltTtsmAmt(financeVO.getLbltTtsmAmt())
                        .cptsTtsmAmt(financeVO.getCptsTtsmAmt())
                        .qckasAmt(financeVO.getQckasAmt())
                        .inasAmt(financeVO.getInasAmt())
                        .etcFlasAmt(financeVO.getEtcFlasAmt())
                        .ivasAmt(financeVO.getIvasAmt())
                        .tgasAmt(financeVO.getTgasAmt())
                        .itasAmt(financeVO.getItasAmt())
                        .etcNoneFlasAmt(financeVO.getEtcNoneFlasAmt())
                        .crlbAmt(financeVO.getCrlbAmt())
                        .noneCrlbAmt(financeVO.getNoneCrlbAmt())
                        .cpfnAmt(financeVO.getCpfnAmt())
                        .cpspMnyAmt(financeVO.getCpspMnyAmt())
                        .etcInlvPlCtam(financeVO.getEtcInlvPlCtam())
                        .ernspAmt(financeVO.getErnspAmt())
                        .amslAmt(financeVO.getAmslAmt())
                        .ampmAmt(financeVO.getAmpmAmt())
                        .sltpAmt(financeVO.getSltpAmt())
                        .sacstAmt(financeVO.getSacstAmt())
                        .opprAmt(financeVO.getOpprAmt())
                        .nnoeAmt(financeVO.getNnoeAmt())
                        .nonopExpAmt(financeVO.getNonopExpAmt())
                        .orpfAmt(financeVO.getOrpfAmt())
                        .crtxAmt(financeVO.getCrtxAmt())
                        .astTtsmAmt(financeVO.getAstTtsmAmt())
                        .lbltCptsTtsm(financeVO.getLbltCptsTtsm())
                        .rgsnUserId(adminUserVO.getAdminUserId())
                        .amnnUserId(adminUserVO.getAdminUserId())
                        .build());

                // IR 진행도 업데이트
                adminUserVO.setTargetUsisId(updateAgreementCompanyVO.getUtlinsttId());
                irService.saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_FINANCE, financeVO.calcIRTabProgress(), adminUserVO);
            } else {
                log.info("Skip Update INFOTECH Financial Data to IR : Type miss match (Company ID : {})", updateAgreementCompanyVO.getUtlinsttId());
            }

        } catch (BizException bx) {
            log.error("Fail Update INFOTECH Scrapping Financial Data to Invest Box IR Finance (Business Exception code : {}) : {} (Bizrno : {})", bx.getErrorCode(), bx.getErrorMsg(), updateAgreementCompanyVO.getBizrno());
        } catch (Exception e) {
            log.error("Fail Update INFOTECH Scrapping Financial Data to Invest Box IR Finance : {} (Bizrno : {})", e.getMessage(), updateAgreementCompanyVO.getBizrno());
        }
    }

    /**
     * 표준대차대조표 IR 매핑
     * 코드는 스펙문서나 FnstBrkdDVO Class 주석 참조
     *
     * @param infotechList
     * @param financeVO
     * @return
     * @throws Exception
     */
    public IrFinanceVO financialBalanceSheetScrapDataMappingIR(InfotechScrapRowsVO<FnstBrkdDVO> infotechList, IrFinanceVO financeVO) throws Exception {
        List<FnstBrkdDVO> list = infotechList == null ? new ArrayList<>() : infotechList.getRows();
        if (list != null && list.size() > 0) {
            for (FnstBrkdDVO item : list) {
                switch (item.getFrmlClusRfrnNo()) {
                    // 유동자산
                    case "001":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setFlasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 당좌자산
                    case "002":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setQckasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 재고자산
                    case "044":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setInasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 기타유동자산
                    case "067":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setEtcFlasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 비유동자산
                    case "080":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setNoneFlasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 투자자산
                    case "081":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setIvasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 유형자산
                    case "110":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setTgasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 무형자산
                    case "169":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setItasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 기타비유동자산
                    case "194":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setEtcNoneFlasAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 자산총계
                    case "228":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setAstTtsmAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 부채총계
                    case "333":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setLbltTtsmAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 유동부채
                    case "229":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setCrlbAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 비유동부채
                    case "284":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setNoneCrlbAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 자본총계
                    case "382":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setCptsTtsmAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 자본금
                    case "334":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setCpfnAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 자본잉여금
                    case "337":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setCpspMnyAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 자본조정
                    case "348":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setCpcrAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 기타포괄순익 누계액
                    case "361":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setEtcInlvPlCtam(Long.parseLong(item.getDebAmt()));
                        break;
                    // 이익잉여금
                    case "372":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setErnspAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 부채와 자본총계
                    case "383":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setLbltCptsTtsm(Long.parseLong(item.getDebAmt()));
                        break;
                }
            }
        }
        return financeVO;
    }

    /**
     * 손익계산서 IR 매핑
     * 코드는 스펙문서나 FnstBrkdDVO Class 주석 참조
     *
     * @param infotechList
     * @param financeVO
     * @return
     * @throws Exception
     */
    public IrFinanceVO incomeStatementScrapDataMappingIR(InfotechScrapRowsVO<FnstBrkdDVO> infotechList, IrFinanceVO financeVO) throws Exception {
        List<FnstBrkdDVO> list = infotechList == null ? new ArrayList<>() : infotechList.getRows();
        if (list != null && list.size() > 0) {
            for (FnstBrkdDVO item : list) {
                switch (item.getFrmlClusRfrnNo()) {
                    // 매출액
                    case "001":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setAmslAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 매출원가
                    case "035":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setAmpmAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 매출총이익
                    case "066":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setSltpAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 판매관리비
                    case "067":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setSacstAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 영업이익
                    case "129":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setOpprAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 영업외수익
                    case "130":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setNnoeAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 영업외비용
                    case "179":
                        if (StringUtils.hasLength(item.getDebAmt())) financeVO.setNonopExpAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 경상이익
//                    case "???":
//                        financeVO.setOrpfAmt(Long.parseLong(item.getDebAmt()));
//                        break;
                    // 법인세
                    case "218":
                        financeVO.setCrtxAmt(Long.parseLong(item.getDebAmt()));
                        break;
                    // 당기순이익
                    case "219":
                        financeVO.setCtnpAmt(Long.parseLong(item.getDebAmt()));
                        break;
                }
            }
        }
        return financeVO;
    }

}
