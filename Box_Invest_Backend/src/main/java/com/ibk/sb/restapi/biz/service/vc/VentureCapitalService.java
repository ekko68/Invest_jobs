package com.ibk.sb.restapi.biz.service.vc;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.*;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.biz.service.admin.AdminVcService;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVcRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.repo.CompanyRepo;
import com.ibk.sb.restapi.biz.service.company.vo.invest.*;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAdditionalAuditService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.vc.repo.VentureCapitalRepo;
import com.ibk.sb.restapi.biz.service.vc.vo.base.*;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.*;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.*;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.*;
import com.ibk.sb.restapi.biz.service.vc.vo.request.*;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VcPageSummaryVO;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VentureCapitalSummaryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VentureCapitalService {

    private final VentureCapitalRepo ventureCapitalRepo;

    private final PlatformAccountService platformAccountService;
    private final PlatformAdditionalAuditService platformAdditionalAuditService;

    private final CommonFileService fileService;
    private final FileUtil fileUtil;

    private final AdminVcService adminVcService;
    private final AdminVcRepo repo;
    private final CompanyRepo companyRepo;
    /** ================================ CRUD ================================ **/

    /** 메인 화면 **/

    /**
     * 총 펀드금액 조회
     * 포트폴리오 투자금액 합산액
     * @return
     * @throws Exception
     */
    public PortfolioFundAmountVO searchFundAmount() throws Exception {

        PortfolioFundAmountVO totalAmount = ventureCapitalRepo.selectTotalFundAmount(IvtCode.YnTypeEnum.Y.name());
        totalAmount.setInvmAmt(totalAmount.getInvmAmt() != null ? totalAmount.getInvmAmt() : 0);
        totalAmount.setInvmAmtStr(StringUtils.hasLength(totalAmount.getInvmAmtStr()) ? totalAmount.getInvmAmtStr() : "0");

        return totalAmount;
    }

    /**
     * 메인화면 투자사 전용 페이지 목록 조회
     * @return
     * @throws Exception
     */
    public List<VcPageSummaryVO> searchMainVCPageList() throws Exception {

        // 메인화면 투자사 전용 페이지 목록 조회
        // 랜덤으로 9개 리스트
        List<VcPageSummaryVO> pageList = ventureCapitalRepo.selectMainVCPageList();
        pageList = fileUtil.setImageUrlList(pageList);

        return pageList;
    }

    /**
     * 진행중 투자사 전환 요청건 확인
     * @return ongoingYn : 전환요청 진행여부  rqstDt : 전환요청 날짜
     * @throws Exception
     */
    public HashMap<String, String> searchConvertRequestAvailable() throws Exception {
        HashMap<String, String> result = new HashMap<>();

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업 투자사 전환 요청 최신 상태 조회
        AdminVcConvertRequestVO stateVO = adminVcService.searchRecentRequestConvert(user.getUserGroupId());

//        if(stateVO != null && stateVO.getCnvsRqstSttsCdId().equals(ComCode.CONVERT_VC_STANDBY.getCode())) {
        if(stateVO != null && !stateVO.getCnvsRqstSttsCdId().equals(IvtCode.CvsStg.CVS01002.getType())) {
            result.put("ongoingYn", IvtCode.YnTypeEnum.Y.name());
            result.put("rqstDt", DateUtil.checkFormat(stateVO.getRgsnTs().toString()));
        } else {
            result.put("ongoingYn", IvtCode.YnTypeEnum.N.name());
        }

        return result;
    }

    /**
     * 기업 마이페이지 투자사 전환요청
     * asis 투자 사전환 로직 일시 대기중 ,오픈 전까지
     * @throws Exception
     */
    public AdminVcConvertRequestVO requestConvertToVC(PostSimpleBodyVO.SimpleFileBody licenseFile) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 유효한 사업자등록증 파일인지 확인
//        if(!StringUtils.hasLength(licenseFile.getFileId()) || fileService.searchFile(licenseFile.getFileId()) == null) {
//            throw new BizException(StatusCode.MNB0003);
//        }

        // 이미 투자사 계정 상태인지 확인
        if(ventureCapitalRepo.selectIsVentureCapital(user.getUserGroupId()) != null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기업 투자사 전환 요청 최신 상태 조회
        AdminVcConvertRequestVO stateVO = adminVcService.searchRecentRequestConvert(user.getUserGroupId());

        // 최신 상태가 전환 대기 상태일경우 신청 불가
        if(stateVO != null && stateVO.getCnvsRqstSttsCdId().equals(ComCode.CONVERT_VC_STANDBY.getCode())) {
            BizException bx = new BizException(StatusCode.BIZ0003);
            HashMap<String, Object> errorData = new HashMap<>();
            errorData.put("rgsnTs", DateUtil.checkFormat(stateVO.getRgsnTs().toString()));
            bx.setData(errorData);

            throw bx;
        }

        // 투자사 전환 신청 등록
//        AdminVcConvertRequestVO requestVO = new AdminVcConvertRequestVO();
//        requestVO.setBrgcFileId(licenseFile.getFileId());
//        adminVcService.requestConvertToVc(requestVO);

        // 요청 정보 리턴
        return adminVcService.searchRecentRequestConvert(user.getUserGroupId());
    }

    /**
     * 기업 마이페이지 투자사 전환 요청 정보 등록
     * @throws Exception
     */
    public AdminVcConvertRequestVO invmCnvrsRegSaveToVc(InvmCnvrsRegSaveToVcVO invmCnvrsRegSaveToVcVO,MultipartFile file) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 이미 투자사 계정 상태인지 확인
        if(ventureCapitalRepo.selectIsVentureCapital(user.getUserGroupId()) != null) {
            throw new BizException(StatusCode.COM0005,"이미 투자사 전환 상태입니다.");
        }
        ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
        if(fileInfoVO.getFileId().isEmpty()) {
            throw new BizException(StatusCode.COM0005);
        } else {
            invmCnvrsRegSaveToVcVO.setFileId(fileInfoVO.getFileId());
        }

        // 기업 투자사 전환 요청 최신 상태 조회
        AdminVcConvertRequestVO stateVO = adminVcService.searchRecentRequestConvert(user.getUserGroupId());

        // 최신 상태가 전환 대기 상태일경우 신청 불가
        if(stateVO != null && !stateVO.getCnvsRqstSttsCdId().equals(IvtCode.CvsStg.CVS01002.getType())) {
            BizException bx = new BizException(StatusCode.BIZ0003);
            HashMap<String, Object> errorData = new HashMap<>();
            errorData.put("rgsnTs", DateUtil.checkFormat(stateVO.getRgsnTs().toString()));
            bx.setData(errorData);
            throw bx;
        }

        // 간접투자: 투자사 전환 신청 정보 등록
        invmCnvrsRegSaveToVcVO.setUtlinsttId(user.getUserGroupId());
        adminVcService.requestConvertToVcNew(invmCnvrsRegSaveToVcVO);
        // 요청 정보 리턴
        return adminVcService.searchRecentRequestConvert(user.getUserGroupId());
    }

    /**
     * 투자사 전환 결과 정보 확인
     * @throws Exception
     */
    public void checkConvertResult(AdminVcConvertRequestVO adminVcConvertRequestVO) throws Exception {
        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // 필수 파라미터 체크
        if(!(StringUtils.hasLength(adminVcConvertRequestVO.getUtlinsttId()) && adminVcConvertRequestVO.getCnvsRqstSqn() != null)) throw new BizException(StatusCode.COM9998);

        // 정보 세팅
        adminVcConvertRequestVO.setUtlinsttId(user.getUserGroupId());
        adminVcConvertRequestVO.setAmnnUserId(user.getUsername());
        adminVcConvertRequestVO.setCnvsRqstSttsCdId(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY) ? ComCode.CONVERT_VC_CANCEL.getCode() : ComCode.CONVERT_VC_COMPLETE.getCode());

        // 투자사 전환 결과 확인 필드 업데이트
        ventureCapitalRepo.updateConvertResultCheck(adminVcConvertRequestVO);
    }

    /**
     * 투자기관 플랫폼 기업 정보 세팅
     *
     * @param basicData
     * @return
     * @throws Exception
     */
    public VentureCapitalBasicVO setVCBasicPlatformInfo(VentureCapitalBasicVO basicData) throws Exception {

        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyById(basicData.getUtlinsttId());

        if (mainCompanyVO != null) {
            basicData.setRprsntvNm(mainCompanyVO.getRprsntvNm()); // 대표자명
            basicData.setHmpgAdres(mainCompanyVO.getHmpgAdres()); // 홈페이지 경로
            basicData.setReprsntTelno(mainCompanyVO.getReprsntTelno()); // 대표 연락처
            basicData.setReprsntFxnum(mainCompanyVO.getReprsntFxnum()); // 팩스번호
            basicData.setReprsntEmail(mainCompanyVO.getReprsntEmail()); // 이메일 정보
            basicData.setPostNo(mainCompanyVO.getPostNo()); // 우편번호
            basicData.setBizrno(mainCompanyVO.getBizrno()); // 사업자등록번호

            // 주소 세팅
            if (StringUtils.hasLength(mainCompanyVO.getNwAdresAt()) && mainCompanyVO.getNwAdresAt().equals(IvtCode.YnTypeEnum.Y.name())) {
                basicData.setAddr(mainCompanyVO.getNwAdres() + mainCompanyVO.getNwAdresDetail());
            } else {
                basicData.setAddr(mainCompanyVO.getAdres() + mainCompanyVO.getDetailAdres());
            }

            // 로고 이미지 경로 세팅
            basicData.setLogoImageUrl(fileUtil.setMainboxLogoUrl(mainCompanyVO.getLogoImageFile()));
        } else {
            basicData.setRprsntvNm(""); // 대표자명
            basicData.setHmpgAdres(""); // 홈페이지 경로
            basicData.setReprsntTelno(""); // 대표 연락처
            basicData.setReprsntFxnum(""); // 팩스번호
            basicData.setReprsntEmail(""); // 이메일 정보
            basicData.setPostNo(""); // 우편번호
            basicData.setAddr(""); // 주소
            basicData.setLogoImageUrl(""); // 로고 이미지 경로
        }

        return basicData;
    }


    /** 기업 마이페이지 **/

    /**
     * 추천 투자사 목록 조회
     *
     * @return
     * @throws Exception
     */
    public List<VentureCapitalSummaryVO> searchRecommendVCList() throws Exception {

        // 로그인 기업 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 추천 투자사 리스트 조회
        List<VentureCapitalSummaryVO> recommendList = ventureCapitalRepo.selectRecommendVCList(user.getUserGroupId());
        recommendList = recommendList == null ? new ArrayList<>() : recommendList;

        // 로고 정보 추가 설정
        ProfileHeadCharacter ibkProfileHeadCharSet = new ProfileHeadCharacter();
        for(VentureCapitalSummaryVO item : recommendList) {
            item.setLogoImageUrl(fileUtil.setMainboxLogoUrl(item.getLogoImageUrl()));

            if((item.getDefaultLogoYn().equals(IvtCode.YnTypeEnum.Y.name()) || !StringUtils.hasLength(item.getLogoImageUrl()))
                    && StringUtils.hasLength(item.getBplcNm())) item.setDefaultLogoChar(ibkProfileHeadCharSet.get(item.getBplcNm()));
        }

        // 플랫폼 기업 정보 세팅
//        recommendList = setVCSummaryPlatformInfo(recommendList);

        return recommendList;
    }

    /** 투자기관 정보 **/

    /**
     * 투자사(투자기관) 목록 조회 (페이징)
     * @return
     * @throws Exception
     */
    public PagingVO<VentureCapitalSummaryVO> searchVCList(RequestSearchVcVO requestSearchVCVO) throws Exception {

        // 투자사 목록 조회
        List<VentureCapitalSummaryVO> vcList = ventureCapitalRepo.selectVentureCapitalList(requestSearchVCVO);
        vcList = vcList == null ? new ArrayList<>() : vcList;

        // 로고 정보 추가 설정
        ProfileHeadCharacter ibkProfileHeadCharSet = new ProfileHeadCharacter();
        for(VentureCapitalSummaryVO item : vcList) {
            item.setLogoImageUrl(fileUtil.setMainboxLogoUrl(item.getLogoImageUrl()));

            if((item.getDefaultLogoYn().equals(IvtCode.YnTypeEnum.Y.name()) || !StringUtils.hasLength(item.getLogoImageUrl()))
                    && StringUtils.hasLength(item.getBplcNm())) item.setDefaultLogoChar(ibkProfileHeadCharSet.get(item.getBplcNm()));
        }

        // 플랫폼 기업 정보 세팅
//        vcList = setVCSummaryPlatformInfo(vcList);

        // 태그 리스트 세팅
        for(VentureCapitalSummaryVO item : vcList) {
            item.setCnrnFildList(StringUtil.toStringTagList(item.getCnrnTags()));
        }

        // 페이징 처리 리턴
        return new PagingVO<>(requestSearchVCVO, vcList);
    }

    /**
     * 투자기관 상세 조회
     * 조회수 업데이트 로직 있음 -> 다른 컨트롤러에서도 서비스를 사용하게 된다면 주의
     * @param vcId
     * @return
     */
    public VentureCapitalDetailVO searchVC(String vcId) throws Exception {

        VentureCapitalDetailVO result = new VentureCapitalDetailVO();

        // 조회수 업데이트
        ventureCapitalRepo.updateVCViewCount(vcId);

        // 투자기관 기본 정보 조회
        VentureCapitalBasicVO basicData = ventureCapitalRepo.selectVentureCapital(vcId);

        if (basicData == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 투자기관이 IBK 투자사인지 확인
        basicData.setIbkVcYn(
                (StringUtils.hasLength(basicData.getBizrno()) && platformAdditionalAuditService.getIbkVcBiznumList().contains(basicData.getBizrno()))
                    ?   IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name()
        );

        // 투자기관 플랫폼 기업 정보 세팅
        result.setBasicData(setVCBasicPlatformInfo(basicData));

        // 투자기관 집행 지표 정보 조회
        VcAuditExecuteIndicatorVO indicator = ventureCapitalRepo.selectAuditExecuteIndicator(vcId);
        if (indicator != null) {
            result.setOppbYn(StringUtils.hasLength(indicator.getOppbYn()) ? indicator.getOppbYn() : IvtCode.YnTypeEnum.N.name());

            result.setInvmPrfrCnt(indicator.getInvmPrfrCnt());
            result.setInvmAmt(indicator.getInvmAmt());

            String invmAmtStr = "";

            if(result.getInvmAmt() != null) {
                if(result.getInvmAmt() >= StringUtil.KR_100MILLION) {
                    invmAmtStr = StringUtil.numberToUnitString(result.getInvmAmt(), StringUtil.UnitEnum.KR_100MILLION_START, false) + " ";
                }

                // 천만은 단위가 조금 특수하므로 따로 계산처리함
                long divideRslt = (result.getInvmAmt() % StringUtil.KR_100MILLION)  / (StringUtil.KR_10THOUSAND * 1000);
                if(divideRslt > 0) invmAmtStr = invmAmtStr + divideRslt + "천만";
            }

            result.setInvmAmtStr(StringUtils.hasLength(invmAmtStr) ? invmAmtStr : "0");

        } else {
            indicator.setOppbYn(IvtCode.YnTypeEnum.N.name());
        }

        // 선호 투자 유형 정보 (Pie 차트)
        List<VcPreferenceChartVO> pieChartList = ventureCapitalRepo.selectVCPreferenceChart(vcId);
        result.setPfrcChartList(pieChartList == null ? new ArrayList<>() : pieChartList);

        // 총 투자집행 그래프 정보 조회
        List<VcAuditExecuteChartVO> chartList = ventureCapitalRepo.selectAuditExecuteChart(vcId);
        result.setExecChartList(chartList == null ? new ArrayList<>() : chartList);

        return result;
    }

    /**
     * 포트폴리오 목록 조회 (페이징)
     * @return
     * @throws Exception
     */
    public PagingVO<VcPortfolioVO> searchPortfolioList(RequestVcPortfolioVO requestVCPortfolioVO) throws Exception {

        // 검색 아이디 유무 체크
        if (!StringUtils.hasLength(requestVCPortfolioVO.getUtlinsttId())) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 포트폴리오 목록 조회
        requestVCPortfolioVO.setOppbYn(IvtCode.YnTypeEnum.Y.name());
        List<VcPortfolioVO> portfolioList = ventureCapitalRepo.selectVCPortfolioList(requestVCPortfolioVO);

        // 이미지 경로 세팅
        portfolioList = fileUtil.setImageUrlList(portfolioList);

        // 페이징 처리 리턴
        return new PagingVO<>(requestVCPortfolioVO, portfolioList);
    }

    /**
     * 대표심사역 목록 조회 (페이징)
     * @param requestVCMemberVO
     * @return
     * @throws Exception
     */
    public PagingVO<VcMemberVO> searchVCMemberList(RequestVcMemberVO requestVCMemberVO) throws Exception {

        // 검색 아이디 유무 체크
        if (!StringUtils.hasLength(requestVCMemberVO.getUtlinsttId())) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 대표심사역 목록 조회
        List<VcMemberVO> memberList = ventureCapitalRepo.selectVCMemberPagingList(requestVCMemberVO);
        memberList = fileUtil.setImageUrlList(memberList);

        // 페이징 처리 리턴
        return new PagingVO<>(requestVCMemberVO, memberList);
    }


    /** 마이페이지 **/

    /**
     * 투자사 기본정보 상세 조회
     * @return
     * @throws Exception
     */
    public VcInvestDetailVO searchVC() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        VcInvestDetailVO result = new VcInvestDetailVO();

        // 투자사 기본정보 조회
        VentureCapitalBasicVO basicData = ventureCapitalRepo.selectVentureCapital(user.getUserGroupId());
        basicData = basicData == null ? new VentureCapitalBasicVO() : basicData;
        basicData.setUtlinsttId(user.getUserGroupId());
        basicData = setVCBasicPlatformInfo(basicData);

        // 투자사 관심분야 조회
        List<VcInterestVO> interestList = ventureCapitalRepo.selectVCInterestTagList(user.getUserGroupId());
        basicData.setCnrnFildList(interestList == null ? new ArrayList<>() : interestList);

        result.setBasicData(basicData);

        // 투자사 관심투자분야 조회
        List<VcInvestFieldVO> investFieldList = ventureCapitalRepo.selectVCInvestFieldList(user.getUserGroupId());
        result.setInvestFieldList(investFieldList == null ? new ArrayList<>() : investFieldList);

        // 투자사 관심활용기술 조회
        List<VcUtilTechVO> utilTechList = ventureCapitalRepo.selectVCUtilTechList(user.getUserGroupId());
        result.setUtilTechList(utilTechList == null ? new ArrayList<>() : utilTechList);

        // 투자사 주요투자단계 조회
        List<VcInvestStepVO> stepList = ventureCapitalRepo.selectVCInvestStepList(user.getUserGroupId());
        result.setInvestStepList(stepList == null ? new ArrayList<>() : stepList);

        // 투자사 주요투자지역 조회
        List<VcInvestRegionVO> investRegionList = ventureCapitalRepo.selectVCInvestRegionList(user.getUserGroupId());
        result.setInvestRegionList(investRegionList);

        // 투자사 주요활용기술 조회
        VcInvestAmountVO amountVO = ventureCapitalRepo.selectVCInvestAmount(user.getUserGroupId());
        result.setInvestAmount(amountVO == null ? new VcInvestAmountVO() : amountVO);

        // 투자사 전환요청 결과여부 조회
        AdminVcConvertRequestVO adminVcConvertRequestVO = adminVcService.searchRecentRequestConvert(user.getUserGroupId());

        // 전환 요청을 했었고 + 완료 상태인 경우
        if(adminVcConvertRequestVO != null && adminVcConvertRequestVO.getCnvsRqstSttsCdId().equals(ComCode.CONVERT_VC_COMPLETE.getCode())) {
            result.setConvertInfo(adminVcConvertRequestVO);
        }

        return result;
    }

    /**
     * 마이페이지 포트폴리오 투자 목록 조회
     * @param pageVO
     * @return
     */
    public PagingVO<VcPortfolioVO> searchVCPortfolioList(PageVO pageVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 조회 파라미터 세팅
        RequestVcPortfolioVO requestVO = new RequestVcPortfolioVO(pageVO);
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setOppbYn(null);

        // 리스트 조회
        List<VcPortfolioVO> portfolioList = ventureCapitalRepo.selectVCPortfolioList(requestVO);
        portfolioList = fileUtil.setImageUrlList(portfolioList);

        // 페이징 처리 및 리턴
        return new PagingVO<>(pageVO, portfolioList);
    }

    /**
     * 대표심사역 목록 조회
     * @return
     */
    public List<VcMemberVO> searchVCMemberList() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 대표심사역 리스트 조회
        List<VcMemberVO> memberList = ventureCapitalRepo.selectVCMemberList(user.getUserGroupId());
        return fileUtil.setImageUrlList(memberList);
    }
    /**
     * 운용 보고서 목록 조회
     * @return
     */
    public PagingVO<VcOperationReportVO> searchOperationReportList(RequestVcOperationReportVO params) throws Exception {

        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }
        params.setInvtId(user.getUserGroupId());

        List<VcOperationReportVO> operationReportList = ventureCapitalRepo.selectVCOperationReportList(params);

        operationReportList = operationReportList == null ? new ArrayList<>() : operationReportList;

        return new PagingVO<>(params, operationReportList);
    }


    /**
     * 기본정보 등록/수정
     * @param vcInvestDetailVO
     * @throws Exception
     */
    public void saveVC(VcInvestDetailVO vcInvestDetailVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 기본정보 등록 | 수정 **/

        VentureCapitalBasicVO basicVO = vcInvestDetailVO.getBasicData();

        if(basicVO == null) {
            throw new BizException(StatusCode.COM0005);
        }

        basicVO.setUtlinsttId(user.getUserGroupId());
        basicVO.setAmnnUserId(user.getUsername());

        // -> 기업 정보 배치 등록 시 해당 테이블 정보까지 insert 시키는 것으로 염두하고 변경
        // TODO : 추후 확인 세팅
//        // 투자박스 전용 기존 기본정보 유무 확인 -> 등록 / 수정 체크
//        // 등록
//        if(ventureCapitalRepo.selectVCInvestBasic(user.getUserGroupId()) == null) {
//            basicVO.setRgsnUserId(user.getUsername());
//            ventureCapitalRepo.insertVentureCapitalBasic(basicVO);
//        }
//
//        // 수정
//        else {
//            ventureCapitalRepo.updateVentureCapitalBasic(basicVO);
//        }
        // 기본정보 갱신
        basicVO.setRgsnUserId(user.getUsername());
        ventureCapitalRepo.mergeVentureCapitalBasic(basicVO);

        // 투자사 목록 테이블 수정 (투자사 타입, 투자심사 재요청 제한 기간)
        ventureCapitalRepo.updateVentureCapitalInvestorData(basicVO);

        /** 관심분야, 관심투자분야, 활용기술, 투자단계, 투자지역 등록, 삭제 **/

        // 기존 관심분야 삭제
        ventureCapitalRepo.deleteVCInterestTagList(user.getUserGroupId());

        // 관심분야 등록
        if(basicVO.getCnrnFildList() != null && basicVO.getCnrnFildList().size() > 0) {
            int seq = 1;
            for(VcInterestVO item : basicVO.getCnrnFildList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setCnrnFildSqn(seq);
                ventureCapitalRepo.insertVCInterestTag(item);
                seq++;
            }
        }

        // 기존 관심투자분야 삭제
        ventureCapitalRepo.deleteVCInvestFieldList(user.getUserGroupId());

        // 관심투자분야 등록
        if(vcInvestDetailVO.getInvestFieldList() != null && vcInvestDetailVO.getInvestFieldList().size() > 0) {
            int seq = 1;
            for(VcInvestFieldVO item : vcInvestDetailVO.getInvestFieldList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setIvflSqn(seq);
                ventureCapitalRepo.insertVCInvestField(item);
                seq++;
            }
        }

        // 기존 관심활용기술 삭제
        ventureCapitalRepo.deleteVCUtilTechList(user.getUserGroupId());

        // 관심활용기술 등록
        if(vcInvestDetailVO.getUtilTechList() != null && vcInvestDetailVO.getUtilTechList().size() > 0) {
            int seq = 1;
            for(VcUtilTechVO item : vcInvestDetailVO.getUtilTechList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setUtlzTchnSqn(seq);
                ventureCapitalRepo.insertVCUtilTech(item);
                seq++;
            }
        }

        // 기존 투자단계 삭제
        ventureCapitalRepo.deleteVCInvestStepList(user.getUserGroupId());

        // 주요투자단계 등록
        if(vcInvestDetailVO.getInvestStepList() != null && vcInvestDetailVO.getInvestStepList().size() > 0) {
            for(VcInvestStepVO item : vcInvestDetailVO.getInvestStepList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                ventureCapitalRepo.insertVCInvestStep(item);
            }
        }

        // 기존 투자지역 삭제
        ventureCapitalRepo.deleteVCInvestRegionList(user.getUserGroupId());

        // 투자지역 매핑 등록
        if(vcInvestDetailVO.getInvestRegionList() != null && vcInvestDetailVO.getInvestRegionList().size() > 0) {
            for(VcInvestRegionVO item : vcInvestDetailVO.getInvestRegionList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                ventureCapitalRepo.insertVCInvestRegion(item);
            }
        }

        /** 투자금액 등록 | 수정 **/

        VcInvestAmountVO amountVO = vcInvestDetailVO.getInvestAmount();

        // 등록 | 수정
        if(amountVO != null && StringUtils.hasLength(amountVO.getInvmAmtCd())) {
            amountVO.setUtlinsttId(user.getUserGroupId());
            amountVO.setAmnnUserId(user.getUsername());

            // 기존 등록 정보 유무에 따른 등록/수정 처리
            // 등록
            if(ventureCapitalRepo.selectVCInvestAmount(user.getUserGroupId()) == null) {
                amountVO.setRgsnUserId(user.getUsername());
                ventureCapitalRepo.insertVCInvestAmount(amountVO);
            }

            // 수정
            else {
                ventureCapitalRepo.updateVCInvestAmount(amountVO);
            }
        }
        // 삭제
        else {
            ventureCapitalRepo.deleteVCInvestAmount(user.getUserGroupId());
        }
    }


    /**
     * 포트폴리오 등록/수정
     * @param portfolio
     * @throws Exception
     */
    public void saveVCPortfolio(VcPortfolioVO portfolio) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 공통 등록 정보 세팅
        portfolio.setUtlinsttId(user.getUserGroupId());
        portfolio.setAmnnUserId(user.getUsername());
        portfolio.setInvmPrfrDt(DateUtil.checkFormat(portfolio.getInvmPrfrDt()));

        // 등록
        if(!StringUtils.hasLength(portfolio.getPrtfId())) {
            // 등록 정보 세팅
            portfolio.setRgsnUserId(user.getUsername());

            // 포트폴리오 아이디 생성
            portfolio.setPrtfId(UUID.randomUUID().toString());

            // 포트폴리오 등록
            ventureCapitalRepo.insertVCPortfolio(portfolio);
        }

        // 수정
        else {
            // 기존 데이터 조회
            VcPortfolioVO beforeData = ventureCapitalRepo.selectVCPortfolio(user.getUserGroupId(), portfolio.getPrtfId());

            // 포트폴리오 아이디 유효성 체크
            if(beforeData == null) {
                throw new BizException(StatusCode.COM0005);
            }

            // 포트폴리오 수정
            ventureCapitalRepo.updateVCPortfolio(portfolio);

            // 로고 파일 변경 시 기존 파일 삭제처리
            if(StringUtils.hasLength(beforeData.getFileId())) {
                if(!beforeData.getFileId().equals(StringUtils.hasLength(portfolio.getFileId()) ? portfolio.getFileId() : "")) {
                    fileService.deleteFile(beforeData.getFileId(), null);
                }
            }
        }
    }


    /**
     * 대표심사역 등록/수정
     * @param memberList
     * @throws Exception
     */
    public void saveVCMember(List<VcMemberVO> memberList) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기존 대표심사역 리스트 조회
        List<VcMemberVO> beforeMemberList = ventureCapitalRepo.selectVCMemberList(user.getUserGroupId());
        beforeMemberList = beforeMemberList == null ? new ArrayList<>() : beforeMemberList;

        // 대표심사역 등록 제한 인원수 체크
        if(beforeMemberList.size() >= 10) {
            throw new BizException(StatusCode.BIZ0001);
        }

        // 삭제될 대표심사역 아이디, 파일 아이디 후보 리스트 세팅
        List<String> deleteMemberList = new ArrayList<>(beforeMemberList.size());
        List<String> deleteFileList = new ArrayList<>(beforeMemberList.size());

        beforeMemberList.forEach(x -> {
            deleteMemberList.add(x.getRprsCrofId());
            if(StringUtils.hasLength(x.getFileId())) {
                deleteFileList.add(x.getFileId());
            }
        });

        /** 등록 | 수정 처리 **/
        for(VcMemberVO item : memberList) {

            // 공통 정보 세팅
            item.setAmnnUserId(user.getUsername());
            item.setUtlinsttId(user.getUserGroupId());

            // 대표심사역 아이디가 있는 경우 -> 수정처리
            if(StringUtils.hasLength(item.getRprsCrofId())) {
                // 삭제할 기존 멤버 리스트에서 해당 아이디 제외
                if(!deleteMemberList.remove(item.getRprsCrofId())) {
                    // false 일 경우 잘못된 멤버 아이디임
                    throw new BizException(StatusCode.MNB0003);
                }
                // 파일아이디 삭제 파일 리스트에서 제거
                deleteFileList.remove(item.getFileId());

                // 대표심사역 업데이트
                ventureCapitalRepo.updateVCMember(item);
            }

            // 대표심사역 아이디가 없는 경우 -> 등록처리
            else {
                // 아이디 세팅
                item.setRprsCrofId(UUID.randomUUID().toString());
                item.setRgsnUserId(user.getUsername());

                ventureCapitalRepo.insertVCMember(item);
            }
        }

        /** 삭제 처리 **/
        // 삭제된 대표심사역, 대표심사역 이미지 파일 삭제 처리
        for(String memberId : deleteMemberList) {
            ventureCapitalRepo.deleteVCMember(user.getUserGroupId(), memberId);
        }
        for(String fileId : deleteFileList) {
            fileService.deleteFile(fileId, null);
        }
    }

    /**
     * 대표 심사역 삭제
     * @param memberId
     * @throws Exception
     */
    public void deleteVCMember(String memberId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 대표심사역 삭제
        ventureCapitalRepo.deleteVCMember(user.getUserGroupId(), memberId);
    }

    /**
     * 운용 보고서 등록/수정
     * @param operationReportReq
     * @throws Exception
     */
    public void saveVCOperationReport(RequestVcSaveOperationReportVO operationReportReq) throws Exception{

        boolean isRegister = operationReportReq.getInvtId() == null;
        if (isRegister){ // 등록
            VcOperationReportVO insertReport = new VcOperationReportVO();
            // 구분정보 유효성검사
            if (operationReportReq.getRptDsnc() == null){
                // 값이 없다고 메세지 날려주기
                throw new BizException(StatusCode.OOP0015);
            }

            // 파일 유효성 검사
            if(operationReportReq.getReqReportList() == null) {
                // 값이 없다고 메세지 날려주기
                throw new BizException(StatusCode.OOP0015);
            }
            // 날짜 검사
            if(operationReportReq.getLada() == null) {
                // 값이 없다고 메세지 날려주기
                throw new BizException(StatusCode.OOP0015);
            }

            // 유저정보 유효성 검사
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
                throw new BizException(StatusCode.COM0005);
            }
            String utlinsttId = user.getUserGroupId();
            String rptDsnc = operationReportReq.getRptDsnc();

            // 중복 검사
            VcOperationReportVO searchResult = ventureCapitalRepo.selectVCOperationReport(utlinsttId, rptDsnc);
            if (searchResult != null){
                //"해당 분기에 업로드된 보고서 존재"
                throw new BizException(StatusCode.COM0047);
            }

            insertReport.setInvtId(utlinsttId);
            insertReport.setRptDsnc(rptDsnc);

            insertReport.setLada(operationReportReq.getLada());
            insertReport.setRgsnUserId(user.getUsername());

            // file Upload하고 id 받기
            for( MultipartFile file : operationReportReq.getReqReportList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                insertReport.setFileId(fileInfoVO.getFileId());
            }
            // 테이블에 넣기
            ventureCapitalRepo.insertVCOperationReport(insertReport);
        }else{ // 수정
            VcOperationReportVO updateReport = new VcOperationReportVO();

            String rptDsnc = operationReportReq.getRptDsnc();
            String rptDsncPrev = operationReportReq.getRptDsncPrev();
            String lada = operationReportReq.getLada();


            // 구분정보 유효성검사
            if (operationReportReq.getRptDsnc() == null){
                throw new BizException(StatusCode.OOP0015);
            }

            // 날짜 검사
            if(lada == null) {
                throw new BizException(StatusCode.OOP0015);
            }

            // 유저정보 유효성 검사
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
                throw new BizException(StatusCode.COM0005);
            }
            String utlinsttId = user.getUserGroupId();

            updateReport.setLada(lada);
            updateReport.setRptDsnc(rptDsnc);
            updateReport.setRptDsncPrev(rptDsncPrev);
            updateReport.setInvtId(utlinsttId);
            updateReport.setRgsnUserId(user.getUsername());

            // 수정할 보고서 확인
            VcOperationReportVO searchResult = ventureCapitalRepo.selectVCOperationReport(utlinsttId, rptDsncPrev);
            if (searchResult == null){
                // "해당 분기에 수정할 보고서가 존재하지 않습니다"
                throw new BizException(StatusCode.COM0048);
            }
            String fileId = searchResult.getFileId();


            boolean needCheckUniqueKeyDuplication = false ;

            if (!rptDsnc.equals(rptDsncPrev)) {
                needCheckUniqueKeyDuplication = true;
            }
            if (needCheckUniqueKeyDuplication){
                VcOperationReportVO searchResult2 = ventureCapitalRepo.selectVCOperationReport(utlinsttId, rptDsnc);
                if (searchResult2 != null){
                    // "해당 분기에 이미 업로드된 보고서가 존재합니다"
                    throw new BizException(StatusCode.COM0047);
                }
            }

            boolean hasNewData = operationReportReq.getReqReportList() != null;
            if (hasNewData){
                fileService.deleteFile(fileId, null);
                for( MultipartFile file : operationReportReq.getReqReportList()){
                    ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                    updateReport.setFileId(fileInfoVO.getFileId());
                }
            }else{
                updateReport.setFileId(fileId);
            }
            ventureCapitalRepo.updateVCOperationReport(updateReport);
        }
    }


    /** 투자사 전용 페이지 **/

    /**
     * 투자사 전용 페이지 리스트 조회
     * @param requestVO
     * @return
     * @throws Exception
     */
    public PagingVO<VcPageSummaryVO> searchVCPageList(RequestSearchVcPageVO requestVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자사 전용 페이지 리스트 조회
        requestVO.setUtlinsttId(user.getUserGroupId());
        List<VcPageSummaryVO> vcPageList = ventureCapitalRepo.selectVCPageList(requestVO);

        return new PagingVO<>(requestVO, fileUtil.setImageUrlList(vcPageList));
    }

    /**
     * 투자사 전용 페이지 상세 조회
     * @param pageId
     * @return
     * @throws Exception
     */
    public VcPageDetailVO searchVCPage(String pageId) throws Exception {

        VcPageDetailVO result = new VcPageDetailVO();

        // 페이지 아이디가 있는 경우 -> 수정 화면, 이벤트 페이지 화면
        if(StringUtils.hasLength(pageId)) {

            // 투자사 페이지 메인 정보 조회
            VcPageMainVO mainVO = ventureCapitalRepo.selectVCPageMain(pageId);

            // 유효성 검사
            if(mainVO == null) {
                throw new BizException(StatusCode.MNB0003);
            }

            mainVO.setLgtyImgUrl(fileUtil.setImageUrl(mainVO.getLgtyImgFileId()));
            mainVO.setRprsImgUrl(fileUtil.setImageUrl(mainVO.getRprsImgFileId()));
            mainVO.setInrdImgUrl(fileUtil.setImageUrl(mainVO.getInrdImgFileId()));

            // 이벤트 페이지 화면 펀드금액, 기업가치금액 단위 설정
            if(mainVO.getFundAmt() != null) {
                if(mainVO.getFundAmt() > StringUtil.KR_100MILLION) mainVO.setFundAmtStr(StringUtil.numberToUnitString(mainVO.getFundAmt(), StringUtil.UnitEnum.KR_100MILLION_START, false));
                else if(mainVO.getFundAmt() > 0) mainVO.setFundAmtStr(StringUtil.numberToUnitString(mainVO.getFundAmt(), StringUtil.UnitEnum.KR_10THOUSAND, true));
                else mainVO.setFundAmtStr("0");
            }
            if(mainVO.getEtvlAmt() != null) {
                if(mainVO.getEtvlAmt() > StringUtil.KR_100MILLION) mainVO.setEtvlAmtStr(StringUtil.numberToUnitString(mainVO.getEtvlAmt(), StringUtil.UnitEnum.KR_100MILLION_START, false));
                else if(mainVO.getEtvlAmt() > 0) mainVO.setEtvlAmtStr(StringUtil.numberToUnitString(mainVO.getEtvlAmt(), StringUtil.UnitEnum.KR_10THOUSAND, true));
                else mainVO.setEtvlAmtStr("0");
            }

            result.setPageMainData(mainVO);

            // 투자사 페이지 이벤트 리스트 조회
            List<VcPageEventVO> eventList = ventureCapitalRepo.selectVCPageEventList(pageId);
            result.setEventList(fileUtil.setImageUrlList(eventList));

            // 투자사 페이지 FAQ 리스트 조회
            List<VcPageFaqVO> faqList = ventureCapitalRepo.selectVCPageFAQList(pageId);
            result.setFaqList(faqList == null ? new ArrayList<>() : faqList);

            // 투자사 페이지 배너 리스트 조회
            List<VcPageBannerVO> bannerList = ventureCapitalRepo.selectVCPageBannerList(pageId);
            result.setBannerList(fileUtil.setImageUrlList(bannerList));

        }

        // 페이지 아이디가 없는 경우 -> 등록 화면
        else {
            // 로그인 정보 조회
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // 투자사 아이디, 명 세팅
            VcPageMainVO mainVO = new VcPageMainVO();
            mainVO.setUtlinsttId(user.getUserGroupId());
            mainVO.setBplcNm(user.getUserGroupName());

            // 빈객체 세팅
            result.setPageMainData(mainVO);
            result.setEventList(new ArrayList<>());
            result.setBannerList(new ArrayList<>());
            result.setFaqList(new ArrayList<>());
        }

        return result;
    }

    /**
     * 투자사 전용 페이지 등록/수정
     * @param pageDetailVO
     * @throws Exception
     */
    public String saveVCPage(VcPageDetailVO pageDetailVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 메인정보 유효성 확인
        VcPageMainVO mainVO = pageDetailVO.getPageMainData();

        if(mainVO == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 삭제할 파일 아이디 리스트
        List<String> deleteFileList = new ArrayList<>();

        /** 메인정보 등록 | 수정 **/

        // 공통 정보 세팅
        mainVO.setUtlinsttId(user.getUserGroupId());
        mainVO.setAmnnUserId(user.getUsername());

        // 전화번호 특수문자 제거 (하이픈제외)
        mainVO.setCscnTpn(mainVO.getCscnTpn().replaceAll("[^-0-9]", ""));

        // 페이지 아이디 유무 체크 -> 등록수정 분기
        // 수정
        if(StringUtils.hasLength(mainVO.getInvmCmpExusPageId())) {
            // 페이지 아이디 유효성 체크
            VcPageMainVO beforeData = ventureCapitalRepo.selectVCPageMain(mainVO.getInvmCmpExusPageId());

            if(beforeData == null) {
                throw new BizException(StatusCode.COM0005);
            }

            if(!beforeData.getUtlinsttId().equals(user.getUserGroupId())) {
                throw new BizException(StatusCode.COM0005);
            }

            // 기존 파일아이디 변경 체크
            if(!mainVO.getLgtyImgFileId().equals(beforeData.getLgtyImgFileId())) {
                deleteFileList.add(beforeData.getLgtyImgFileId());
            }
            if(!mainVO.getRprsImgFileId().equals(beforeData.getRprsImgFileId())) {
                deleteFileList.add(beforeData.getRprsImgFileId());
            }
            if(!mainVO.getInrdImgFileId().equals(beforeData.getInrdImgFileId())) {
                deleteFileList.add(beforeData.getInrdImgFileId());
            }

            // 페이지 메인정보 업데이트
            ventureCapitalRepo.updateVCPageMain(mainVO);
        }

        // 등록
        else {
            // 아이디 세팅
            mainVO.setInvmCmpExusPageId(UUID.randomUUID().toString());
            mainVO.setRgsnUserId(user.getUsername());

            // 페이지 메인정보 등록
            ventureCapitalRepo.insertVCPageMain(mainVO);
        }

        /** 이벤트 리스트 등록 | 삭제 **/

        // 삭제할 이벤트 파일 리스트 추출 (하단에서 유지되는 파일아이디는 다시 후보 리스트에서 제거)
        List<VcPageEventVO> beforeEventList = ventureCapitalRepo.selectVCPageEventList(mainVO.getInvmCmpExusPageId());
        if(beforeEventList != null && beforeEventList.size() > 0) {
            beforeEventList.forEach(x -> {
                if(StringUtils.hasLength(x.getRprsImgFileId())) {
                    deleteFileList.add(x.getRprsImgFileId());
                }
            });
        }

        // 기존 이벤트 리스트 삭제
        ventureCapitalRepo.deleteVCPageEventList(user.getUserGroupId(), mainVO.getInvmCmpExusPageId());

        // 이벤트 정보 등록
        if(pageDetailVO.getEventList() != null && pageDetailVO.getEventList().size() > 0) {
            int seq = 1;
            for(VcPageEventVO item : pageDetailVO.getEventList()) {
                // 아이디 정보 등록
                item.setUtlinsttId(user.getUserGroupId());
                item.setInvmCmpExusPageId(mainVO.getInvmCmpExusPageId());
                item.setRgsnUserId(user.getUsername());
                item.setEvntSqn(seq);

                // 파일 삭제 후보 리스트에서 제외처리
                deleteFileList.remove(item.getFileId());

                // YYYYMMDD
                item.setEvntStdt(DateUtil.checkFormat(item.getEvntStdt()));
                item.setEvntFndt(DateUtil.checkFormat(item.getEvntFndt()));

                // 이벤트 등록
                ventureCapitalRepo.insertVCPageEvent(item);
                seq++;
            }
        }

        /** FAQ 리스트 등록 | 삭제 **/

        // 기존 FAQ 리스트 삭제
        ventureCapitalRepo.deleteVCPageFAQList(user.getUserGroupId(), mainVO.getInvmCmpExusPageId());

        // FAQ 정보 등록
        if(pageDetailVO.getFaqList() != null && pageDetailVO.getFaqList().size() > 0) {
            int seq = 1;
            for(VcPageFaqVO item : pageDetailVO.getFaqList()) {
                // 아이디 정보 등록
                item.setUtlinsttId(user.getUserGroupId());
                item.setInvmCmpExusPageId(mainVO.getInvmCmpExusPageId());
                item.setRgsnUserId(user.getUsername());
                item.setFaqSqn(seq);

                // faq 등록
                ventureCapitalRepo.insertVCPageFAQ(item);
                seq++;
            }
        }

        /** 배너 리스트 등록 | 삭제 **/

        // 삭제할 배너 파일 리스트 추출 (하단에서 유지되는 파일아이디는 다시 후보 리스트에서 제거)
        List<VcPageBannerVO> beforeBannerList = ventureCapitalRepo.selectVCPageBannerList(mainVO.getInvmCmpExusPageId());
        if(beforeBannerList != null && beforeBannerList.size() > 0) {
            beforeBannerList.forEach(x -> {
                if(StringUtils.hasLength(x.getBnnrImgFileId())) {
                    deleteFileList.add(x.getBnnrImgFileId());
                }
            });
        }

        // 기존 배너 리스트 삭제
        ventureCapitalRepo.deleteVCPageBannerList(user.getUserGroupId(), mainVO.getInvmCmpExusPageId());

        // 배너정보 등록
        if(pageDetailVO.getBannerList() != null && pageDetailVO.getBannerList().size() > 0) {
            int seq = 1;
            for(VcPageBannerVO item : pageDetailVO.getBannerList()) {
                // 아이디 정보 등록
                item.setUtlinsttId(user.getUserGroupId());
                item.setInvmCmpExusPageId(mainVO.getInvmCmpExusPageId());
                item.setRgsnUserId(user.getUsername());
                item.setBnnrSqn(seq);

                // 파일 삭제 후보리스트 제외처리
                deleteFileList.remove(item.getFileId());

                // 배너정보 등록
                ventureCapitalRepo.insertVCPageBanner(item);
                seq++;
            }
        }

        // 아이디 리턴
        return mainVO.getInvmCmpExusPageId();
    }

    /**
     * 투자사 전용 페이지 삭제
     * @param pageId
     * @throws Exception
     */
    public void deleteVCPage(String pageId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.checkGroup(IvtCode.UsisTypeEnum.VC)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기존 정보 조회
        VcPageMainVO beforeData = ventureCapitalRepo.selectVCPageMain(pageId);

        if(beforeData == null) {
            throw new BizException(StatusCode.COM0005);
        }

        if(!beforeData.getUtlinsttId().equals(user.getUserGroupId())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 메인정보 논리 삭제
        ventureCapitalRepo.deleteVCPageMain(user.getUserGroupId(), pageId, user.getUsername());

        // 논리 삭제이므로 나머지 부분에 대해서는 유지

    }


    /** ================================ ETC ================================ **/

    /**
     * 이용기관 ID 투자박스 투자사 여부 확인
     *
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public boolean checkVentureCapital(String utlinsttId) throws Exception {
        if (!StringUtils.hasLength(utlinsttId)) {
            throw new BizException(StatusCode.COM0005);
        }

        VentureCapitalBasicVO check = ventureCapitalRepo.selectIsVentureCapital(utlinsttId);

        if (check == null) {
            return false;
        }

        return true;
    }

    /**
     * 투자사 기본정보 조회, 투자정보 등의 기타 매핑 정보는 반환하지 않음
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public VentureCapitalBasicVO searchVcBasicData (String utlinsttId) throws Exception {
        return ventureCapitalRepo.selectVentureCapital(utlinsttId);
    }

}
