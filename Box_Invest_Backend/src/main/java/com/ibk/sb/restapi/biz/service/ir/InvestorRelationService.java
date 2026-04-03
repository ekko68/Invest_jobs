package com.ibk.sb.restapi.biz.service.ir;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.util.DateUtil;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.ir.repo.InvestorRelationRepo;
import com.ibk.sb.restapi.biz.service.ir.vo.*;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrSupportFundVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.*;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrDebtVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryGroupVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryVO;
import com.ibk.sb.restapi.biz.service.ir.vo.member.IrMemberVO;
import com.ibk.sb.restapi.biz.service.ir.vo.plan.*;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.RequestIRProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestorRelationService {

    private final InvestorRelationRepo investorRelationRepo;

    private final CompanyService companyService;

    private final CommonFileService fileService;

    private final FileUtil fileUtil;

    private final InvestAuditService investAuditService;

    private final VentureCapitalService ventureCapitalService;

    private final PlatformAccountService platformAccountService;

    /** ================================ CRUD ================================ **/

    /**
     * 사업자번호, 투자심사 아이디 기준 기업 IR 조회 가능여부 확인
     * @param auditId
     * @param bizrno
     * @return
     * @throws Exception
     */
    public String searchIrCompanyIdByBizNumAndAuditId(String auditId, String bizrno) throws Exception {

        // 사업자 번호 기준 이용기관 정보 조회
        if(!StringUtils.hasLength(bizrno)) throw new BizException(StatusCode.COM0005);
        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyByBizNum(bizrno);
        if(mainCompanyVO == null) throw new BizException(StatusCode.COM9998);

        // 투자심사 정보 조회
        InvestAuditVO auditVO = investAuditService.searchInvestAudit(auditId);

        // 조회가능 유효성 판단
        if(auditVO.getRqstEnprIrInqYn().equals(IvtCode.YnTypeEnum.N.name())) {
            throw new BizException(StatusCode.BIZ0002);
        }

        // 이용기관 아이디 체크
        if(ventureCapitalService.checkVentureCapital(mainCompanyVO.getUtlinsttId())) {
            if(!auditVO.getInvmCmpId().equals(mainCompanyVO.getUtlinsttId())) throw new BizException(StatusCode.COM0005);
        } else {
            if(!auditVO.getRqstEnprId().equals(mainCompanyVO.getUtlinsttId())) throw new BizException(StatusCode.COM0005);
        }

        // 기업 아이디 리턴
        return auditVO.getRqstEnprId();
    }

    /**
     * 투자심사 페이지 투자사 IR 미리보기 조회
     * -> 투자심사 기준 IR 조건 충족 필요 (로그인 아이디와 투자사 아이디, IR 조회 가능여부 등)
     * @param tabType
     * @param auditId
     * @return
     * @throws Exception
     */
    public IrPreviewVO searchAuditIRPreview(String tabType, String auditId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자심사 정보 조회
        InvestAuditVO auditVO = investAuditService.searchInvestAudit(auditId);

        // 조회가능 유효성 판단
        if(auditVO.getRqstEnprIrInqYn().equals(IvtCode.YnTypeEnum.N.name())) {
            throw new BizException(StatusCode.BIZ0002);
        }

        // 기업 아이디 체크
        if(!(user.checkGroup(IvtCode.UsisTypeEnum.VC) && auditVO.getInvmCmpId().equals(user.getUserGroupId()))
                && !(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY) && auditVO.getRqstEnprId().equals(user.getUserGroupId()))) {
            throw new BizException(StatusCode.COM0005);
        }

        return searchIRPreview(tabType, auditVO.getRqstEnprId());
    }

    /**
     * IR 미리보기 탭 조회
     * Enum으로 타입을 받으면 좋지만 페이지 기준 Controller를 줄이기 위해 IR Preview만 예외로 처리
     * @param companyId
     * @return
     * @throws Exception
     */
    public IrPreviewVO searchIRPreview(String tabType, String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        IrPreviewVO irPreviewVO = new IrPreviewVO();

        if(tabType.equals(IvtCode.IrTabTypeEnum.IR_BASIC.getType())) {
            irPreviewVO.setIrBasicTab(searchIR(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_HISTORY.getType())) {
            irPreviewVO.setIrHistoryTab(searchIRHistoryGroupList(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_MEMBER.getType())) {
            irPreviewVO.setIrMemberTab(searchIRMemberList(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_STOCKHOLDER.getType())) {
            irPreviewVO.setIrStockHolderTab(searchIRStockHolderList(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_FINANCE.getType())) {
            irPreviewVO.setIrFinanceTab(searchIRFinance(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_EXTRA.getType())) {
            irPreviewVO.setIrExtraTab(searchIRExtra(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_PLAN.getType())) {
            irPreviewVO.setIrPlanAndResultTab(searchIRPlanAndResult(userGroupId));
        }
        else if (tabType.equals(IvtCode.IrTabTypeEnum.IR_ALL.getType())) {
            irPreviewVO.setIrBasicTab(searchIR(userGroupId));
            irPreviewVO.setIrHistoryTab(searchIRHistoryGroupList(userGroupId));
            irPreviewVO.setIrMemberTab(searchIRMemberList(userGroupId));
            irPreviewVO.setIrStockHolderTab(searchIRStockHolderList(userGroupId));
            irPreviewVO.setIrFinanceTab(searchIRFinance(userGroupId));
            irPreviewVO.setIrExtraTab(searchIRExtra(userGroupId));
            irPreviewVO.setIrPlanAndResultTab(searchIRPlanAndResult(userGroupId));
        }

        return irPreviewVO;
    }


    /**
     * IR 등록 완료 진행도 조회
     */
    public IrProgressVO searchIRProgress() throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 진행도 조회
        IrProgressVO progress = investorRelationRepo.selectCompanyIRProgress(user.getUserGroupId());

        if (progress == null) {
            progress = new IrProgressVO();
            progress.setProgress(0);
        }

        // IR 제목 세팅 (임시)
        else {
            CompanyBasicVO companyVO = companyService.searchCompanyBasic();
            if(companyVO != null && StringUtils.hasLength(companyVO.getBplcNm())) {
                String title = companyVO.getBplcNm() + " IR 자료";
                progress.setIrTitle(progress.getLastModifiedTimestamp().toLocalDateTime().getYear() + " " + title);
                progress.setIrPopupTitle(title);
            }
        }

        return progress;
    }

    /**
     * 조회 기업 아이디 설정
     * @param companyId
     * @return
     * @throws Exception
     */
    public String getSearchGroupId(String companyId) throws Exception {
        if(StringUtils.hasLength(companyId)) {
            return companyId;
        } else {
            // 로그인 유저 정보 획득
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // 기업회원 체크
            if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
                throw new BizException(StatusCode.COM0005);
            }
            return user.getUserGroupId();
        }
    }

    /**
     * IR 기본정보 조회
     *
     * @return
     * @throws Exception
     */
    public InvestRelationVO searchIR(String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        // IR 기본정보 조회
        InvestRelationVO investRelationVO = investorRelationRepo.selectCompanyIR(userGroupId);

        // irId가 없는 경우 연동된 기업의 기본 정보만 세팅해서 전달
        if (investRelationVO == null) {
            investRelationVO = new InvestRelationVO();

            // 로그인 후 처리하는 등록용 조회에만 초기값 세팅
            if(!StringUtils.hasLength(companyId)) {
                investRelationVO.setUtlinsttId(userGroupId);

                CompanyBasicVO companyVO = companyService.searchCompanyBasic();
                if (companyVO != null) {
                    investRelationVO.setBnnm(companyVO.getBplcNm());            // 사업자명
                    investRelationVO.setBzn(companyVO.getBizrno());             // 사업자등록번호
                    investRelationVO.setCol(companyVO.getFondDe());             // 설립일자
                    investRelationVO.setRprnm(companyVO.getRprsntvNm());        // 대표자명
                    investRelationVO.setBtnm(companyVO.getBtnm());              // 업종명
                    investRelationVO.setCgn(companyVO.getJurirno());            // 법인등록번호
                    investRelationVO.setHmpgUrlAdr(companyVO.getHmpgAdres());   // 홈페이지 주소

                    investRelationVO.setEnprDsncCd(companyVO.getEnfmClsfCd());// -> 구분코드 생성 후 처리
                    investRelationVO.setEnprDsncNm(companyVO.getEnfmClsfNm());
                    investRelationVO.setZpcd(companyVO.getPostNo());            // 우편번호
                    investRelationVO.setAdr(companyVO.getAddr());              // 주소
                }
            }
        }

        // 투자유치, 기관지원금 정보 조회 및 세팅
        investRelationVO.setInvestList(investorRelationRepo.selectCompanyIRInvestList(userGroupId));
        investRelationVO.setSupportList(investorRelationRepo.selectCompanyIRSupportFundList(userGroupId));

        if (!(investRelationVO.getInvestList() != null && investRelationVO.getInvestList().size() > 0)) {
            investRelationVO.setInvestList(new ArrayList<>());
        }
        if (!(investRelationVO.getSupportList() != null && investRelationVO.getSupportList().size() > 0)) {
            investRelationVO.setSupportList(new ArrayList<>());
        }

        return investRelationVO;
    }

    /**
     * 등록, 수정 처리용 IR 주요연혁 조회
     *
     * @return
     * @throws Exception
     */
    public List<IrHistoryVO> searchIRHistoryList() throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 연혁 정보 조회
        List<IrHistoryVO> historyList = investorRelationRepo.selectCompanyIRHistoryList(user.getUserGroupId());

        historyList = historyList == null ? new ArrayList<>() : historyList;

        return historyList;
    }

    /**
     * IR 주요연혁 조회
     *
     * @return
     * @throws Exception
     */
    public List<IrHistoryGroupVO> searchIRHistoryGroupList(String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        // 연혁 정보 조회
        List<IrHistoryVO> historyList = investorRelationRepo.selectCompanyIRHistoryList(userGroupId);

        // 연도에 따라 연혁정보 묶기
        List<IrHistoryGroupVO> historyGroupList = new ArrayList<>();

        // 조회 결과가 없는 경우
        if (!(historyList != null && historyList.size() > 0)) {
            IrHistoryGroupVO historyGroupVO = new IrHistoryGroupVO();
        }

        // 조회 결과가 있는 경우 연도별 연혁정보 묶음처리 (쿼리문에서 연도의 역순으로 조회)
        else {
            // 연도별 분리를 위한 Set 설정
            Set<String> yearSet = new HashSet<>();

            // 초기화
            IrHistoryGroupVO irHistoryGroupVO = new IrHistoryGroupVO();

            int cnt = 1;

            for (IrHistoryVO item : historyList) {
                // 새로운 연도가 들어올 경우
                if (yearSet.add(item.getGroupYear())) {
                    // 기존 그룹 정보 리스트에 추가 (첫번째 경우 제외)
                    if (cnt != 1) historyGroupList.add(irHistoryGroupVO);
                    // Group VO 초기화
                    irHistoryGroupVO = new IrHistoryGroupVO();
                    irHistoryGroupVO.setYear(item.getGroupYear());
                    irHistoryGroupVO.setHistoryList(new ArrayList<>());
                }

                if(irHistoryGroupVO.getHistoryList() != null) irHistoryGroupVO.getHistoryList().add(item);

                // 라스트 인덱스일 경우 그룹정보 리스트에 추가
                if (cnt == historyList.size()) historyGroupList.add(irHistoryGroupVO);

                cnt++;
            }
        }

        return historyGroupList;
    }

    /**
     * IR 주요인력 조회
     *
     * @return
     * @throws Exception
     */
    public List<IrMemberVO> searchIRMemberList(String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        // 구성원 정보 조회
        List<IrMemberVO> memberList = investorRelationRepo.selectCompanyIRMemberList(userGroupId);

        return fileUtil.setImageUrlList(memberList);
    }

    /**
     * IR 주주현황 조회
     *
     * @return
     * @throws Exception
     */
    public List<IrStockHolderVO> searchIRStockHolderList(String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        // 주주정보 조회
        List<IrStockHolderVO> stockHolderList = investorRelationRepo.selectCompanyIRStockHolderList(userGroupId);
        return stockHolderList == null ? new ArrayList<>() : stockHolderList;
    }

    /**
     * IR 재무정보 조회
     *
     * @return
     * @throws Exception
     */
    public IrFinanceVO searchIRFinance(String companyId) throws Exception {

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        // 재무정보 조회
        IrFinanceVO financeVO = investorRelationRepo.selectCompanyIRFinance(userGroupId);

        if (financeVO == null) {
            financeVO = new IrFinanceVO();
        }

        // 채무정보 리스트 조회
        List<IrDebtVO> debtList = investorRelationRepo.selectCompanyIRDebtList(userGroupId);
        debtList = debtList == null ? new ArrayList<>() : debtList;

        financeVO.setDebtList(debtList);

        return financeVO;
    }

    /**
     * IR 제품/기술/시장 정보 조회
     *
     * @return
     * @throws Exception
     */
    public IrExtraVO searchIRExtra(String companyId) throws Exception {

        // 리턴 VO
        IrExtraVO result = new IrExtraVO();

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        /** 제품 **/
        // 설명 TB_BOX_IVT_IR_P_PRDT_D
        IrProductVO productVO = investorRelationRepo.selectCompanyIRProduct(userGroupId);
        result.setProduct(productVO == null ? new IrProductVO() : productVO);

        // 주요매출처 TB_BOX_IVT_IR_P_SALE_L
        List<IrMainSaleVO> saleList = investorRelationRepo.selectCompanyMainSaleList(userGroupId);
        result.setSaleList(saleList == null ? new ArrayList<>() : saleList);

        /** 기술 **/
        // 보유기술 정보 TB_BOX_IVT_IR_P_TECH_D
        IrTechVO techVO = investorRelationRepo.selectCompanyIRTech(userGroupId);
        result.setTech(techVO == null ? new IrTechVO() : techVO);

        // 지적재산권 현황 TB_BOX_IVT_IR_P_TCHN_L
        List<IrIpStateVO> ipList = investorRelationRepo.selectCompanyIRIPStateList(userGroupId);
        result.setIpList(ipList == null ? new ArrayList<>() : ipList);

        /** 시장 **/
        // 시장 TB_BOX_IVT_IR_P_MKRT_D
        IrMarketVO marketVO = investorRelationRepo.selectCompanyIRMarket(userGroupId);
        result.setMarket(marketVO == null ? new IrMarketVO() : marketVO);

        // 시장 타겟 TB_BOX_IVT_IR_P_GOAL_L
        List<IrMarketTargetVO> marketTargetList = investorRelationRepo.selectCompanyIRMarketTargetList(userGroupId);
        result.setMarketTargetList(marketTargetList == null ? new ArrayList<>() : marketTargetList);

        // 시장 플레이어 TB_BOX_IVT_IR_P_PTCN_L
        List<IrMarketPlayerVO> marketPlayerList = investorRelationRepo.selectCompanyIRMarketPlayerList(userGroupId);
        result.setMarketPlayerList(marketPlayerList == null ? new ArrayList<>() : marketPlayerList);

        return result;
    }

    /**
     * IR 성과 및 계획 정보 조회
     *
     * @return
     * @throws Exception
     */
    public IrPlanAndResultVO searchIRPlanAndResult(String companyId) throws Exception {

        // 리턴 VO
        IrPlanAndResultVO result = new IrPlanAndResultVO();

        // 조회 아이디 세팅
        String userGroupId = getSearchGroupId(companyId);

        /** 주요 성과 **/
        // 투자 유치 성과 리스트
        List<IrInvestResultVO> investList = investorRelationRepo.selectCompanyIRInvestResultList(userGroupId);
        result.setInvestList(investList == null ? new ArrayList<>() : investList);

        // 수상 실적 리스트
        List<IrAwardResultVO> awardLst = investorRelationRepo.selectCompanyIRAwardResultList(userGroupId);
        result.setAwardList(awardLst == null ? new ArrayList<>() : awardLst);

        // 수출 실적 리스트
        List<IrExportResultVO> exportList = investorRelationRepo.selectCompanyIRExportResultList(userGroupId);
        result.setExportList(exportList == null ? new ArrayList<>() : exportList);

        // 정책자금 리스트
        List<IrPolicyFundVO> policyFundList = investorRelationRepo.selectCompanyIRPolicyFundList(userGroupId);
        result.setPolicyFundList(policyFundList == null ? new ArrayList<>() : policyFundList);

        /** 주요 계획 **/
        // 계획 리스트
        List<IrMainPlanVO> planList = investorRelationRepo.selectCompanyIRMainPlanList(userGroupId);
        result.setPlanList(planList == null ? new ArrayList<>() : planList);

        return result;
    }


    /** 마이페이지 기업 IR 작성 **/

    /**
     * IR 기본정보 입력/수정
     */
    public void saveCompanyIR(InvestRelationVO investRelationVO) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기업 ID 세팅
        investRelationVO.setUtlinsttId(user.getUserGroupId());

        // 등록자, 수정자 ID 세팅
        investRelationVO.setRgsnUserId(user.getUsername());
        investRelationVO.setAmnnUserId(user.getUsername());

        // 연월정보 yyyyMMdd 세팅
        investRelationVO.setCol(DateUtil.checkFormat(investRelationVO.getCol()));

        // 연락처 하이픈 제거
        investRelationVO.setCnpl(investRelationVO.getCnpl().replaceAll("[^0-9]", ""));

        /** IR 기본정보 등록/수정 **/

        /** 등록 **/
        if (investorRelationRepo.selectCompanyIR(user.getUserGroupId()) == null) {
            // 기본정보 등록
            investorRelationRepo.insertCompanyIR(investRelationVO);
        }

        /** 수정 **/
        else {
            // 기본정보 수정
            investorRelationRepo.updateCompanyIR(investRelationVO);

            // 기존 투자유치, 지원금 정보 삭제
            investorRelationRepo.deleteCompanyIRInvestList(user.getUserGroupId());
            investorRelationRepo.deleteCompanyIRSupportFundList(user.getUserGroupId());

        }

        // 투자유치, 지원금 정보 등록
        saveIRInvestAndSupport(investRelationVO);

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_BASIC, investRelationVO.calcIRTabProgress(), null);
    }

    /**
     * 투자유치, 기관지원금 등록
     *
     * @param investRelationVO
     * @throws Exception
     */
    public void saveIRInvestAndSupport(InvestRelationVO investRelationVO) throws Exception {

        // 투자유치 정보 등록
        if (investRelationVO.getInvestList() != null && investRelationVO.getInvestList().size() != 0) {

            int seq = 1;

            for (IrInvestVO item : investRelationVO.getInvestList()) {

                // 기업, 등록자 아이디 세팅
                item.setUtlinsttId(investRelationVO.getUtlinsttId());
                item.setRgsnUserId(investRelationVO.getRgsnUserId());
                item.setAmnnUserId(investRelationVO.getAmnnUserId());

                // 연월정보 yyyyMMdd 세팅
                item.setInvmEnmtYm(DateUtil.checkFormatWithoutDay(item.getInvmEnmtYm()));

                // 투자 유치 년월 && 투자 유치 기업명이 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getInvmEnmtEtnm()) && StringUtils.hasLength(item.getInvmEnmtYm())) {
                    // 시퀀스 세팅 (수정시 레코드 리스트 삭제 후 다시 밀어넣음)
                    item.setInvmEnmtSqn(seq);
                    // 투자유치정보 등록
                    investorRelationRepo.insertCompanyIRInvest(item);
                    seq++;
                }
            }
            investRelationVO.setCalInvestList((seq - 1));
        }

        // 기관지원금 정보 등록
        if (investRelationVO.getSupportList() != null && investRelationVO.getSupportList().size() > 0) {

            int seq = 1;

            for (IrSupportFundVO item : investRelationVO.getSupportList()) {

                // 기업, 등록자 아이디 세팅
                item.setUtlinsttId(investRelationVO.getUtlinsttId());
                item.setRgsnUserId(investRelationVO.getRgsnUserId());
                item.setAmnnUserId(investRelationVO.getAmnnUserId());

                // 연월정보 yyyyMMdd 세팅
                item.setSprnMnyEnmtDt(DateUtil.checkFormat(item.getSprnMnyEnmtDt()));

                // 직원 기관 명 && 치원금 유치 날짜가 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getSprnInttNm()) && StringUtils.hasLength(item.getSprnMnyEnmtDt())) {
                    // 시퀀스 세팅 (수정시 레코드 리스트 삭제 후 다시 밀어넣음)
                    item.setSprnMnySqn(seq);
                    // 기관지원금 정보 등록
                    investorRelationRepo.insertCompanyIRSupportFund(item);
                    seq++;
                }
            }
            investRelationVO.setCalSupportList((seq - 1));
        }
    }


    /**
     * IR 주요연혁 입력/수정
     */
    public void saveCompanyIRHistory(List<IrHistoryVO> irHistoryList) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }


        /** 등록 && 수정 **/
        // 기존 연혁 정보 삭제
        investorRelationRepo.deleteCompanyIRHistoryList(user.getUserGroupId());

        int seq = 1;

        for (IrHistoryVO item : irHistoryList) {
            // 기업 아이디, 시퀀스 세팅
            item.setUtlinsttId(user.getUserGroupId());
            item.setOrdvSqn(seq);

            // 등록자 아이디 세팅
            item.setRgsnUserId(user.getUsername());
            item.setAmnnUserId(user.getUsername());

            // 연월정보 yyyyMM 세팅
            if (StringUtils.hasLength(item.getOrdvYm())) {
                item.setOrdvYm(DateUtil.checkFormatWithoutDay(item.getOrdvYm()));
            }

            // 연력 년월 && 연혁 내용이 존재하는 경우에만 insert
            if(StringUtils.hasLength(item.getOrdvYm()) && StringUtils.hasLength(item.getOrdvCon())) {
                // 연혁 항목 등록
                investorRelationRepo.insertCompanyIRHistory(item);
                seq++;
            }
        }

        // IR 진행도 업데이트
        // (seq - 1) : 실제 업데이트 된 연혁 정보 수
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_HISTORY, irHistoryList != null && (seq - 1) > 0 ? 5 : 0, null);
    }

    /**
     * IR 주요인력 정보 입력/수정
     */
    public void saveCompanyIRMember(List<IrMemberVO> irMemberList) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 등록 && 수정 **/
        // 기존 인력 조회
        List<IrMemberVO> beforeList = investorRelationRepo.selectCompanyIRMemberList(user.getUserGroupId());

        if (beforeList != null && beforeList.size() > 0) {
            // 갱신 정보의 파일 아이디 리스트 추출
            List<String> fileIdList = new ArrayList<>();
            fileIdList = irMemberList.stream()
                    .filter(x -> StringUtils.hasLength(x.getFileId()))
                    .map(IrMemberVO::getFileId)
                    .collect(Collectors.toList());

            // 갱신 데이터에 포함되어있지 않은 이전 파일 아이디는 논리 삭제처리
            for (IrMemberVO item : beforeList) {
                if (StringUtils.hasLength(item.getFileId()) && !fileIdList.contains(item.getFileId())) {
                    fileService.deleteFile(item.getFileId(), null);
                }
            }

            // 기존 인력 정보 삭제
            investorRelationRepo.deleteCompanyIRMemberList(user.getUserGroupId());
        }

        int seq = 1;

        for (IrMemberVO item : irMemberList) {
            // 기업 아이디, IR 아이디, 시퀀스 세팅
            item.setUtlinsttId(user.getUserGroupId());
            item.setTmmbSqn(seq);

            // 등록자 아이디 세팅
            item.setRgsnUserId(user.getUsername());
            item.setAmnnUserId(user.getUsername());

            // 팀원명이 존재하는 경우만 insert
            if(StringUtils.hasLength(item.getTmmbNm())) {
                // 인력 항목 등록
                investorRelationRepo.insertCompanyIRMember(item);
                seq++;
            }
        }

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_MEMBER, irMemberList != null && (seq - 1) > 0 ? 5 : 0, null);
    }

    /**
     * IR 주주현황 정보 입력/수정
     */
    public void saveCompanyIRStockHolder(List<IrStockHolderVO> irStockHolderList) throws Exception {

        // 로그인 유저 정보 획득
        // User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 등록 && 수정 **/
        // 기존 주주정보 삭제
        investorRelationRepo.deleteCompanyIRStockHolderList(user.getUserGroupId());

        int seq = 1;

        for (IrStockHolderVO item : irStockHolderList) {
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

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_STOCKHOLDER, irStockHolderList != null && (seq - 1) > 0 ? 5 : 0, null);
    }

    /**
     * IR 재무정보 입력/수정
     */
//    @Transactional
    public void saveCompanyIRFinance(IrFinanceVO irFinanceVO) throws Exception {

        // 로그인 유저 정보 획득
        // User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 재무정보 등록 / 수정 **/
        // ID 정보 세팅
        irFinanceVO.setUtlinsttId(user.getUserGroupId());
        irFinanceVO.setRgsnUserId(user.getUsername());
        irFinanceVO.setAmnnUserId(user.getUsername());

        // 등록
        if (investorRelationRepo.selectCompanyIRFinance(user.getUserGroupId()) == null) {
            // 재무정보 등록
            investorRelationRepo.insertCompanyIRFinance(irFinanceVO);
        }
        // 수정
        else {
            // 재무정보 수정
            investorRelationRepo.updateCompanyIRFinance(irFinanceVO);
        }

        /** 채무정보 리스트 등록 **/
        // 기존 채무정보 삭제
        investorRelationRepo.deleteCompanyIRDebtList(user.getUserGroupId());

        if (irFinanceVO.getDebtList() != null && irFinanceVO.getDebtList().size() > 0) {

            int seq = 1;

            for (IrDebtVO item : irFinanceVO.getDebtList()) {
                // 기업 ID 시퀀스 설정
                item.setUtlinsttId(user.getUserGroupId());
                item.setBrngPlceSqn(seq);

                // 등록자 ID 설정
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());

                // 날짜정보 yyyyMMdd 세팅
                item.setExpiDt(DateUtil.checkFormat(item.getExpiDt()));

                if(StringUtils.hasLength(item.getBrngPlceNm()) && StringUtils.hasLength(item.getExpiDt())) {
                    // 채무정보 등록
                    investorRelationRepo.insertCompanyIRDebt(item);
                    seq++;
                }
            }
            irFinanceVO.setCalDebtList((seq - 1));
        }

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_FINANCE, irFinanceVO.calcIRTabProgress(), null);
    }

    /**
     * IR 제품/기술/시장 정보 입력/수정
     */
    public void saveCompanyIRExtra(IrExtraVO irExtraVO) throws Exception {

        // 로그인 유저정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 제품 **/
        /* 설명 TB_BOX_IVT_IR_P_PRDT_D */

        // 오브젝트 null 체크
        if (irExtraVO.getProduct() == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 로그인 정보 세팅
        irExtraVO.getProduct().setUtlinsttId(user.getUserGroupId());
        irExtraVO.getProduct().setAmnnUserId(user.getUsername());

        // 등록 여부 확인
        IrProductVO beforeProduct = investorRelationRepo.selectCompanyIRProduct(user.getUserGroupId());

        // 제품 설명 등록/수정
        if (beforeProduct == null) {
            irExtraVO.getProduct().setRgsnUserId(user.getUsername());
            investorRelationRepo.insertCompanyIRProduct(irExtraVO.getProduct());
        } else {
            investorRelationRepo.updateCompanyIRProduct(irExtraVO.getProduct());
        }

        /* 주요매출처 TB_BOX_IVT_IR_P_SALE_L */

        // 기존 주요 매출처 리스트 삭제
        investorRelationRepo.deleteCompanyIRMainSaleList(user.getUserGroupId());

        // 리스트 null 체크
        if (irExtraVO.getSaleList() != null) {

            int seq = 1;

            for (IrMainSaleVO item : irExtraVO.getSaleList()) {
                // 로그인 정보, 시퀀스 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setAmplSqn(seq);

                // 지역 코드 && 매출내용이 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getAreaDsncCd()) && StringUtils.hasLength(item.getAmslCon())) {
                    // 매출처 아이템 등록
                    investorRelationRepo.insertCompanyIRMainSale(item);
                    seq++;
                }
            }
            irExtraVO.setCalSaleList((seq - 1));
        }

        /** 기술 **/
        /* 보유기술 정보 TB_BOX_IVT_IR_P_TECH_D */

        // 오브젝트 null 체크
        if (irExtraVO.getTech() == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 로그인 정보 세팅
        irExtraVO.getTech().setUtlinsttId(user.getUserGroupId());
        irExtraVO.getTech().setAmnnUserId(user.getUsername());

        // 기존 등록여부 확인
        IrTechVO beforeTech = investorRelationRepo.selectCompanyIRTech(user.getUserGroupId());

        // 보유기술 정보 등록/수정
        if (beforeTech == null) {
            irExtraVO.getTech().setRgsnUserId(user.getUsername());
            investorRelationRepo.insertCompanyIRTech(irExtraVO.getTech());
        } else {
            investorRelationRepo.updateCompanyIRTech(irExtraVO.getTech());
        }

        /* 지적재산권 현황 TB_BOX_IVT_IR_P_TCHN_L */

        // 기존 지적 재산권 현황 리스트 제거
        investorRelationRepo.deleteCompanyIRIPStateList(user.getUserGroupId());

        // 리스트 null 체크
        if (irExtraVO.getIpList() != null) {

            int seq = 1;

            for (IrIpStateVO item : irExtraVO.getIpList()) {
                // 로그인 정보, 시퀀스 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setHoldTchnSqn(seq);

                // 등록일 yyyyMMdd 세팅
                item.setPnotPrrgRgda(DateUtil.checkFormat(item.getPnotPrrgRgda()));

                // 상태코드 && 지적재산권 내용 && 지적재산권 등록일 && 출원번호 가 존재하는 경우만 insert
                if(StringUtils.hasLength(item.getSttsCd())
                        && StringUtils.hasLength(item.getPnotPrrgCon())
                        && StringUtils.hasLength(item.getPnotPrrgRgda())
                        && StringUtils.hasLength(item.getAlfrNo())
                ) {
                    // 지적재산권 항목 등록
                    investorRelationRepo.insertCompanyIRIPState(item);
                    seq++;
                }
            }
            irExtraVO.setCalIpList((seq - 1));
        }

        /** 시장 **/
        /* 시장 정보 TB_BOX_IVT_IR_P_MKRT_D */

        // 오브젝트 null 체크
        if (irExtraVO.getMarket() == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 로그인 정보 세팅
        irExtraVO.getMarket().setUtlinsttId(user.getUserGroupId());
        irExtraVO.getMarket().setAmnnUserId(user.getUsername());

        // 등록 유무 확인
        IrMarketVO beforeMarket = investorRelationRepo.selectCompanyIRMarket(user.getUserGroupId());

        // 시장 정보 등록/수정
        if (beforeMarket == null) {
            irExtraVO.getMarket().setRgsnUserId(user.getUsername());
            investorRelationRepo.insertCompanyIRMarket(irExtraVO.getMarket());
        } else {
            investorRelationRepo.updateCompanyIRMarket(irExtraVO.getMarket());
        }

        /* 시장목표 TB_BOX_IVT_IR_P_GOAL_L */

        // 기존 시장목표 리스트 제거
        investorRelationRepo.deleteCompanyIRMarketTargetList(user.getUserGroupId());

        // 리스트 null 체크
        if (irExtraVO.getMarketTargetList() != null) {

            int seq = 1;

            for (IrMarketTargetVO item : irExtraVO.getMarketTargetList()) {
                // 로그인 정보, 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setPrmrGoalSqn(seq);

                // 지역 코드 && 주요 목표 내용이 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getAreaDsncCd()) && StringUtils.hasLength(item.getPrmrGoalCon())) {
                    // 시장목표 항목 등록
                    investorRelationRepo.insertCompanyIRMarketTarget(item);
                    seq++;
                }
            }
            irExtraVO.setCalMarketTargetList((seq - 1));
        }

        /* 시장 플레이어 TB_BOX_IVT_IR_P_PTCN_L */

        // 기존 시장 플레이어 리스트 제거
        investorRelationRepo.deleteCompanyIRMarketPlayerList(user.getUserGroupId());

        // 리스트 null 체크
        if (irExtraVO.getMarketPlayerList() != null) {

            int seq = 1;

            for (IrMarketPlayerVO item : irExtraVO.getMarketPlayerList()) {
                // 로그인 정보, 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setMrktPtcnSqn(seq);

                // 지역 코드 && 시장 참여자 명 && 시장 참여자 내용이 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getAreaDsncCd())
                        && StringUtils.hasLength(item.getMrktPtcnNm())
                        && StringUtils.hasLength(item.getMrktPtcnCon())
                ) {
                    // 시장 플레이어 항목 등록
                    investorRelationRepo.insertCompanyIRMarketPlayer(item);
                    seq++;
                }
            }
            irExtraVO.setCalMarketPlayerList((seq - 1));
        }

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_EXTRA, irExtraVO.calcIRTabProgress(), null);
    }

    /**
     * IR 성과 및 계획 정보 입력/수정
     */
    public void saveCompanyIRPlanAndResult(IrPlanAndResultVO irPlanAndResultVO) throws Exception {

        // 로그인 유저정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 주요 성과 **/
        /* 투자 성과 리스트 */

        // 기존 투자성과리스트 제거
        investorRelationRepo.deleteCompanyIRInvestResultList(user.getUserGroupId());

        // 리스트 null 체크
        if (irPlanAndResultVO.getInvestList() != null) {

            int seq = 1;

            for (IrInvestResultVO item : irPlanAndResultVO.getInvestList()) {
                // 로그인 및 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setInvmOtcmSqn(seq);

                // yyyyMMdd 세팅
                item.setInvmDt(DateUtil.checkFormat(item.getInvmDt()));

                // 투자 구분 내용 && 투자 날짜가 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getIndiCon()) && StringUtils.hasLength(item.getInvmDt())) {
                    // 투자성과 항목 등록
                    investorRelationRepo.insertCompanyIRInvestResult(item);
                    seq++;
                }
            }
            irPlanAndResultVO.setCalInvestList((seq - 1));
        }

        /* 수상 실적 리스트 */

        // 기존 수상 실적 리스트 제거
        investorRelationRepo.deleteCompanyIRAwardResultList(user.getUserGroupId());

        // 리스트 null 체크
        if (irPlanAndResultVO.getAwardList() != null) {

            int seq = 1;

            for (IrAwardResultVO item : irPlanAndResultVO.getAwardList()) {
                // 로그인 및 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setBeawAcrsSqn(seq);

                // yyyyMMdd 세팅
                item.setBeawDt(DateUtil.checkFormat(item.getBeawDt()));

                // 개최 장소 && 수상 내역 && 수상 날짜가 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getHldPlac())
                        && StringUtils.hasLength(item.getBeawHst())
                        && StringUtils.hasLength(item.getBeawDt())
                ){
                    // 수상실적 항목 등록
                    investorRelationRepo.insertCompanyIRAwardResult(item);
                    seq++;
                }
            }
            irPlanAndResultVO.setCalAwardList((seq - 1));
        }

        /* 수출 실적 리스트 */

        // 기존 수출 실적 리스트 제거
        investorRelationRepo.deleteCompanyIRExportResultList(user.getUserGroupId());

        // 리스트 null 체크
        if (irPlanAndResultVO.getExportList() != null) {

            int seq = 1;

            for (IrExportResultVO item : irPlanAndResultVO.getExportList()) {
                // 로그인 및 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setEprtHstSqn(seq);

                // yyyyMMdd 세팅
                item.setEprtDt(DateUtil.checkFormat(item.getEprtDt()));

                // 수출 대상 && 수출 날짜가 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getEprtTgt()) && StringUtils.hasLength(item.getEprtDt())) {
                    // 수출실적 항목 등록
                    investorRelationRepo.insertCompanyIRExportResult(item);
                    seq++;
                }
            }
            irPlanAndResultVO.setCalExportList((seq - 1));
        }

        /* 정책자금 리스트 */

        // 기존 정책자금 리스트 제거
        investorRelationRepo.deleteCompanyIRPolicyFundList(user.getUserGroupId());

        // 리스트 null 체크
        if (irPlanAndResultVO.getPolicyFundList() != null) {

            int seq = 1;

            for (IrPolicyFundVO item : irPlanAndResultVO.getPolicyFundList()) {
                // 로그인 및 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setPlfnSqn(seq);

                // yyyyMMdd 세팅
                item.setPlfnPrfrDd(DateUtil.checkFormat(item.getPlfnPrfrDd()));

                // 정책자금 내용 && 정책자금 집행일이 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getPlfnCon()) && StringUtils.hasLength(item.getPlfnPrfrDd())) {
                    // 정책자금 항목 등록
                    investorRelationRepo.insertCompanyIRPolicyFund(item);
                    seq++;
                }
            }
            irPlanAndResultVO.setCalPolicyFundList((seq - 1));
        }

        /** 주요 계획 **/
        /* 계획 리스트 */

        // 기존 계획 리스트 제거
        investorRelationRepo.deleteCompanyIRMainPlanList(user.getUserGroupId());

        // 리스트 null 체크
        if (irPlanAndResultVO.getPlanList() != null) {

            int seq = 1;

            for (IrMainPlanVO item : irPlanAndResultVO.getPlanList()) {
                // 로그인 및 시퀀스 정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setAmnnUserId(user.getUsername());
                item.setPrmrPlanSqn(seq);

                // 주요 지표 구분 && (현재지표 || 3개월 목표 || 6개월 목표 || 9개월 목표) 가 존재하는 경우에만 insert
                if(StringUtils.hasLength(item.getPrmrIndeDsnc())
                        && (
                            StringUtils.hasLength(item.getPsntIndeCon())
                            || StringUtils.hasLength(item.getMn3IndeCon())
                            || StringUtils.hasLength(item.getMn6IndeCon())
                            || StringUtils.hasLength(item.getMn9IndeCon())
                        )
                ) {
                    // 계획 항목 등록
                    investorRelationRepo.insertCompanyIRMainPlan(item);
                    seq++;
                }
            }
            irPlanAndResultVO.setCalPlanList((seq - 1));
        }

        // IR 진행도 업데이트
        saveCompanyIRProgress(IvtCode.IrTabTypeEnum.IR_PLAN, irPlanAndResultVO.calcIRTabProgress(), null);
    }

    /**
     * 작업 진행도 입력/수정 처리
     */
    public void saveCompanyIRProgress(IvtCode.IrTabTypeEnum irTabTypeEnum, int tabProgress, AdminUserVO adminUserVO) throws Exception {

        RequestIRProgressVO requestIRProgressVO = new RequestIRProgressVO();
        requestIRProgressVO.setTabType(irTabTypeEnum.getType());
        requestIRProgressVO.setTabProgress(tabProgress);

        if(adminUserVO != null) {
            // ID 설정
            requestIRProgressVO.setUtlinsttId(adminUserVO.getTargetUsisId());
            requestIRProgressVO.setRgsnUserId(adminUserVO.getAdminUserId());
            requestIRProgressVO.setAmnnUserId(adminUserVO.getAdminUserId());
        } else {
            // 사용자정보 세팅
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            requestIRProgressVO.setUtlinsttId(user.getUserGroupId());
            requestIRProgressVO.setRgsnUserId(user.getUsername());
            requestIRProgressVO.setAmnnUserId(user.getUsername());
        }

        // ir 진행도 레코드 유무 확인
        IrProgressVO progress = investorRelationRepo.selectCompanyIRProgress(requestIRProgressVO.getUtlinsttId());

        // 등록
        if (progress == null) {
            investorRelationRepo.insertCompanyIRProgress(requestIRProgressVO);
        }
        // 수정
        else {
            investorRelationRepo.updateCompanyIRProgress(requestIRProgressVO);
        }
    }

    /** ================================ ETC ================================ **/


}
