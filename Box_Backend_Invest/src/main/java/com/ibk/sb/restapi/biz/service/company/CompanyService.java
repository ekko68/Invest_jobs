package com.ibk.sb.restapi.biz.service.company;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.ProfileHeadCharacter;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.AdminVcService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.company.repo.CompanyRepo;
import com.ibk.sb.restapi.biz.service.company.vo.base.*;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestHopeVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.ProductKeywordVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.ProductListGroupVO;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.*;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformMktService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.CommerceSellerProductVO;
import com.ibk.sb.restapi.biz.service.platform.vo.product.RequestSellerProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;


@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepo companyRepo;

    private final AdminVcService adminVcService;

    private final CommonFileService fileService;

    private final PlatformAccountService platformAccountService;

    private final PlatformMktService platformMktService;

    private final FileUtil fileUtil;

    /**
     * 기업 자동약관 동의 여부 갱신
     */
    public void saveCompanyIRAgreement(String atrwStplCosnYn) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 자동 약관 동의 갱신
        CompanyBasicVO requestVO = new CompanyBasicVO();
        requestVO.setUtlinsttId(user.getUserGroupId());
        requestVO.setAtrwStplCosnYn(atrwStplCosnYn);
        requestVO.setRgsnUserId(user.getUsername());
        requestVO.setAmnnUserId(user.getUsername());

        companyRepo.mergeCompanyIRAgreement(requestVO);
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

    /** 메인 화면 **/

    /**
     * 최신 등록 기업 목록 조회(페이징)
     *
     * @return
     * @throws Exception
     */
    public PagingVO<RecentCompanyVO> searchRecentCompanyList(PageVO pageVO) throws Exception {

        RequestSearchCompanyVO requestSearchCompanyVO = new RequestSearchCompanyVO(pageVO);

        // 리스트 조회
        List<RecentCompanyVO> recentCompanyList = companyRepo.selectRecentCompanyList(requestSearchCompanyVO);

        return new PagingVO<>(pageVO, recentCompanyList);
    }

    /**
     * 기업 즐겨찾기 수정
     * TODO : 삭제대기
     * @param companyFavoriteVO
     * @throws Exception
     */
//    public void saveFavoriteCompany(CompanyFavoriteVO companyFavoriteVO) throws Exception {
//
//        // 로그인 정보 조회
//        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//        if (!StringUtils.hasLength(companyFavoriteVO.getFvryYn())) {
//            throw new BizException(StatusCode.COM0005);
//        } else if (companyFavoriteVO.getFvryYn().equals(IvtCode.YnTypeEnum.Y.name())
//                && companyRepo.selectCompanyFavorite(user.getUserGroupId(), companyFavoriteVO.getFvryUsisId()) == null) {
//            companyRepo.insertCompanyFavorite(user.getUserGroupId(), companyFavoriteVO.getFvryUsisId(), user.getUsername());
//        } else if (companyFavoriteVO.getFvryYn().equals(IvtCode.YnTypeEnum.N.name())
//                && companyRepo.selectCompanyFavorite(user.getUserGroupId(), companyFavoriteVO.getFvryUsisId()) != null) {
//            companyRepo.deleteCompanyFavorite(user.getUserGroupId(), companyFavoriteVO.getFvryUsisId());
//        }
//    }

    /**
     * 이용기관 선호 매핑 수정
     *
     * @param targetUsisId
     * @return true : isLike Y | false : isLike N
     * @throws Exception
     */
    public boolean updateToggleLike(String targetUsisId) throws Exception {
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 유효성 검사 : target id가 없거나 로그인 사용자가 투자사가 아닌 경우
        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC) || !StringUtils.hasLength(targetUsisId)) throw new BizException(StatusCode.COM0005);

        // 기존 매핑정보 확인
        CompanyPreferenceVO prefMapping = companyRepo.selectCompanyPreferenceMapping(user.getUserGroupId(), targetUsisId);

        // 매핑 정보에 따른 toggle update (좋아요 생성 : insert | 좋아용 해제 : delete)
        if (prefMapping == null) companyRepo.insertCompanyPreferenceMapping(
                CompanyPreferenceVO.builder()
                        .utlinsttId(user.getUserGroupId())
                        .prfnUsisId(targetUsisId)
                        .rgsnUserId(user.getUsername())
                        .build()
        );
        else companyRepo.deleteCompanyPreferenceMapping(user.getUserGroupId(), targetUsisId);

        return prefMapping == null;
    }

    /**
     * 투자사 마이페이지 추천 기업 리스트 조회
     *
     * @return
     * @throws Exception
     */
    public List<CompanyRecommendVO> searchRecommendCompanyList() throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!user.checkGroup(IvtCode.UsisTypeEnum.VC)) throw new BizException(StatusCode.COM0005);

        // 추천 기업 리스트 조회
        List<CompanyRecommendVO> recommendList = companyRepo.selectRecommendCompanyList(user.getUserGroupId());
        recommendList = recommendList == null ? new ArrayList<>() : recommendList;

        // 로고 정보 추가 설정
        ProfileHeadCharacter ibkProfileHeadCharSet = new ProfileHeadCharacter();
        for (CompanyRecommendVO item : recommendList) {
            item.setLogoImageUrl(fileUtil.setMainboxLogoUrl(item.getLogoImageUrl()));

            if ((item.getDefaultLogoYn().equals(IvtCode.YnTypeEnum.Y.name()) || !StringUtils.hasLength(item.getLogoImageUrl()))
                    && StringUtils.hasLength(item.getBplcNm())) item.setDefaultLogoChar(ibkProfileHeadCharSet.get(item.getBplcNm()));
        }

        return recommendList;
    }


    /**
     * 기업 정보
     **/

    /**
     * 기업 목록 조회 (페이징)
     *
     * @param requestSearchCompanyVO
     * @return
     * @throws Exception
     */
    public PagingVO<CompanySummaryVO> searchCompanyList(RequestSearchCompanyVO requestSearchCompanyVO) throws Exception {

        // 로그인 정보가 있는 경우 즐겨찾기 매핑 확인을 위한 필드정보 추가
        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CustomUser) {
            requestSearchCompanyVO.setLoginUsisId(((CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserGroupId());
        }

        // 리스트 조회
        List<CompanySummaryVO> companyList = companyRepo.selectCompanyList(requestSearchCompanyVO);
        companyList = companyList == null ? new ArrayList<>() : companyList;

        // 로고 정보 추가 설정
        ProfileHeadCharacter ibkProfileHeadCharSet = new ProfileHeadCharacter();
        for (CompanySummaryVO item : companyList) {
            item.setLogoImageUrl(fileUtil.setMainboxLogoUrl(item.getLogoImageUrl()));

            if ((item.getDefaultLogoYn().equals(IvtCode.YnTypeEnum.Y.name()) || !StringUtils.hasLength(item.getLogoImageUrl()))
                    && StringUtils.hasLength(item.getBplcNm())) item.setDefaultLogoChar(ibkProfileHeadCharSet.get(item.getBplcNm()));
        }

        return new PagingVO<>(requestSearchCompanyVO, companyList);
    }

    /**
     * 기업 기본정보 조회, Like 정보 등은 조회되지 않음
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public CompanyBasicVO searchCompanyBasicByUsisId(String utlinsttId) throws Exception {
        return companyRepo.selectCompanyBasic(utlinsttId, null);
    }

    /**
     * 기업 기본정보 상세 조회
     * 기업 상세페이지에서만 사용 -> 조회수 증가 로직 포함
     *
     * @param companyId
     * @return
     * @throws Exception
     */
    public CompanyDetailVO searchCompany(String companyId) throws Exception {

        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업 조회수 업데이트
        companyRepo.mergeCompanyViewCount(companyId);

        // 기업 기본정보 조회 및 id 유효성 검사
        CompanyBasicVO companyBasicVO = companyRepo.selectCompanyBasic(companyId, user.getUserGroupId());
        if (companyBasicVO == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 플랫폼 기업 정보 매핑
        companyBasicVO = setCompanyBasicPlatformInfo(companyBasicVO);

        // 관심분야 태그 리스트 조회
        List<CompanyInterestVO> interestList = companyRepo.selectCompanyInterestTagList(companyId);
        companyBasicVO.setCnrnFildList(interestList);

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

        // 팀원정보 리스트 조회
        List<CompanyMemberVO> memberList = companyRepo.selectCompanyMemberList(companyId);
        // 이미지 경로 설정
        memberList = fileUtil.setImageUrlList(memberList);

        // 소개영상 리스트 조회
        List<CompanyIntroMediaVO> mediaList = companyRepo.selectCompanyIntroMediaList(companyId);
        mediaList = mediaList == null ? new ArrayList<>() : mediaList;


        CompanyDetailVO result = CompanyDetailVO.builder()
                .basicData(companyBasicVO)
                .investData(companyInvestData)
                .mediaList(mediaList)
                .memberCnt(memberList.size())
                .memberList(memberList)
                .build();

        // 커머스 연동 기능 추가
        // 커머스 연동 목록 정보 확인 (5개 최신)
        PagingVO<CommerceSellerProductVO> commercePrdtPaging =
                platformMktService.searchCommerceSellerProductList(RequestSellerProductVO.builder()
                        .selrUsisId(companyId)
                        .page(1)
                        .record(5)
                        .orderByDate(IvtCode.YnTypeEnum.Y.name()) // 정확히는 공백 체크한다.
                        .build());

        // 커머스 등록 제품이 있는 경우
        if (commercePrdtPaging != null && commercePrdtPaging.getList() != null && commercePrdtPaging.getList().size() > 0) {
            result.setProductListGroup(
                    ProductListGroupVO.builder()
                            .commerceListYn(IvtCode.YnTypeEnum.Y.name())
                            .commerceProductList(commercePrdtPaging.getList())
                            .productList(new ArrayList<>())
                            .build());
        }

        // 커머스 등록 제품이 없는 경우 -> 투자박스 마이페이지 등록 제품 사용
        else {

            // 서비스 제품 리스트 조회
            List<CompanyProductSummaryVO> productList = companyRepo.selectCompanyProductList(companyId);
            // 이미지 경로 설정
            productList = fileUtil.setImageUrlList(productList);
            result.setProductListGroup(
                    ProductListGroupVO.builder()
                            .commerceListYn(IvtCode.YnTypeEnum.N.name())
                            .commerceProductList(new ArrayList<>())
                            .productList(productList)
                            .build());
        }

        return result;
    }


    /** 마이페이지 **/

    /**
     * 로그인 회원 기업정보 조회
     *
     * @return
     * @throws Exception
     */
    public CompanyBasicVO searchCompanyBasic() throws Exception {
        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기본정보 조회
        CompanyBasicVO companyBasicVO = companyRepo.selectCompanyBasic(user.getUserGroupId(), null);
        companyBasicVO = companyBasicVO == null ? new CompanyBasicVO() : companyBasicVO;
        companyBasicVO.setUtlinsttId(user.getUserGroupId());

        // 플랫폼 매핑정보 세팅
        companyBasicVO = setCompanyBasicPlatformInfo(companyBasicVO);

        // 관심분야 리스트 세팅
        List<CompanyInterestVO> interestList = companyRepo.selectCompanyInterestTagList(user.getUserGroupId());
        companyBasicVO.setCnrnFildList(interestList == null ? new ArrayList<>() : interestList);

        // 투자사 전환요청 여부 확인
        AdminVcConvertRequestVO adminVcConvertRequestVO = adminVcService.searchRecentRequestConvert(user.getUserGroupId());

        // 전환 요청을 했었고 + 반려(취소) 상태인 경우
        if (adminVcConvertRequestVO != null && adminVcConvertRequestVO.getCnvsRqstSttsCdId().equals(ComCode.CONVERT_VC_CANCEL.getCode())) {
            companyBasicVO.setConvertInfo(adminVcConvertRequestVO);
        }

        return companyBasicVO;
    }

    /**
     * 내 기업 정보 주요제품 리스트 조회
     *
     * @return
     * @throws Exception
     */
//    public List<CompanyProductSummaryVO> searchCompanyProductList() throws Exception {
    public ProductListGroupVO searchCompanyProductListGroup() throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 커머스 연동 기능 추가
        // 커머스 연동 목록 정보 확인 (5개 최신)
        PagingVO<CommerceSellerProductVO> commercePrdtPaging =
                platformMktService.searchCommerceSellerProductList(RequestSellerProductVO.builder()
                        .selrUsisId(user.getUserGroupId())
                        .page(1)
                        .record(5)
                        .orderByDate(IvtCode.YnTypeEnum.Y.name()) // 정확히는 공백 체크한다.
                        .build());

        // 커머스 등록 제품이 있는 경우
        if (commercePrdtPaging != null && commercePrdtPaging.getList() != null && commercePrdtPaging.getList().size() > 0) {
            return ProductListGroupVO.builder()
                    .commerceListYn(IvtCode.YnTypeEnum.Y.name())
                    .commerceProductList(commercePrdtPaging.getList())
                    .productList(new ArrayList<>())
                    .build();
        }

        // 커머스 등록 제품이 없는 경우 -> 투자박스 마이페이지 등록 제품 사용
        else {

            // 서비스 제품 리스트 조회
            List<CompanyProductSummaryVO> productList = companyRepo.selectCompanyProductList(user.getUserGroupId());
            // 이미지 경로 설정
            productList = fileUtil.setImageUrlList(productList);

            return ProductListGroupVO.builder()
                    .commerceListYn(IvtCode.YnTypeEnum.N.name())
                    .commerceProductList(new ArrayList<>())
                    .productList(productList)
                    .build();
        }
    }

    /**
     * 내 기업 정보 주요제품 상세조회
     *
     * @param productId
     * @return
     * @throws Exception
     */
    public CompanyProductVO searchCompanyProduct(String productId, String companyId) throws Exception {

        // 제품 코드는 컨트롤러에서 체크

        if (!StringUtils.hasLength(companyId)) {
            // 로그인 유저 정보 조회
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
                throw new BizException(StatusCode.COM0005);
            }

            companyId = user.getUserGroupId();
        }

        // 제품 정보 조회
        CompanyProductVO product = companyRepo.selectCompanyProduct(companyId, productId);

        if (product == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 제품 이미지 경로 설정
        product.setImgUrl(fileUtil.setImageUrl(product.getImgFileId()));

        // 제품 키워드 세팅
        List<ProductKeywordVO> keywordList = companyRepo.selectProductKeywordList(companyId, productId);
        product.setKeywordList(keywordList == null ? new ArrayList<>() : keywordList);

        return product;
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

    /**
     * 기업 팀원정보 조회
     *
     * @return
     * @throws Exception
     */
    public List<CompanyMemberVO> searchCompanyMemberList() throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기업 팀원정보 조회
        List<CompanyMemberVO> memberList = companyRepo.selectCompanyMemberList(user.getUserGroupId());

        // 이미지 경로 설정 및 리턴
        return fileUtil.setImageUrlList(memberList);
    }

    /**
     * 기업 소개영상 조회
     *
     * @return
     * @throws Exception
     */
    public List<CompanyIntroMediaVO> searchCompanyIntroMedia() throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기업 소개영상 정보 조회
        List<CompanyIntroMediaVO> mediaList = companyRepo.selectCompanyIntroMediaList(user.getUserGroupId());
        mediaList = mediaList == null ? new ArrayList<>() : mediaList;

        return mediaList;
    }


    /**
     * 기업 기본정보 입력/수정
     *
     * @param companyBasicVO
     * @throws Exception
     */
    public void saveCompany(CompanyBasicVO companyBasicVO) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업 회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 회원, 기업 아이디 세팅
        companyBasicVO.setUtlinsttId(user.getUserGroupId());
        companyBasicVO.setAmnnUserId(user.getUsername());

        /** 기본 정보 수정 **/
        companyBasicVO.setRgsnUserId(user.getUsername());
        companyRepo.mergeCompanyInvestBasic(companyBasicVO);

        // TODO : 기존 메인박스 정보 수정이 필요한 경우 관련 정보 IBK 측으로부터 수령

        /** 관심분야 태그 정보 저장 **/

        // 기존 태그 정보 삭제
        companyRepo.deleteCompanyInterestTagList(user.getUserGroupId());

        // 태그 정보 갱신
        if (companyBasicVO.getCnrnFildList() != null && companyBasicVO.getCnrnFildList().size() > 0) {
            // 시퀀스 세팅
            int seq = 1;
            for (CompanyInterestVO item : companyBasicVO.getCnrnFildList()) {
                // 기본 등록정보 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setCnrnFildSqn(seq);

                companyRepo.insertCompanyInterestTag(item);
                seq++;
            }
        }
    }

    /**
     * 기업 주요제품 입력/수정
     *
     * @param companyProductVO
     * @throws Exception
     */
    public void saveCompanyProduct(CompanyProductVO companyProductVO) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 물품 제한 개수 체크
        List<CompanyProductSummaryVO> beforeProductList = companyRepo.selectCompanyProductList(user.getUserGroupId());
        if (beforeProductList != null && beforeProductList.size() >= 10) {
            throw new BizException(StatusCode.BIZ0001);
        }

        // 회원, 기업 아이디 정보 세팅
        companyProductVO.setAmnnUserId(user.getUsername());
        companyProductVO.setUtlinsttId(user.getUserGroupId());

        // 등록 / 수정 확인
        boolean isRegist;
        // 기존 제품 아이디가 있는지 확인
        if (!StringUtils.hasLength(companyProductVO.getPrdtId())) {
            isRegist = true;
        }
        // 유효한 제품 코드가 있는 경우
        else if (companyRepo.selectCompanyProduct(user.getUserGroupId(), companyProductVO.getPrdtId()) != null) {
            isRegist = false;
        }
        // 유효하지 않은 제품코드일 경우
        else {
            throw new BizException(StatusCode.COM0005);
        }

        /** 등록 / 수정 **/
        // 등록
        if (isRegist) {
            // 등록자 아이디 세팅
            companyProductVO.setRgsnUserId(user.getUsername());
            // 제품코드 설정 (임시로 UUID 세팅)
            companyProductVO.setPrdtId(UUID.randomUUID().toString());
            companyRepo.insertCompanyProduct(companyProductVO);
        }
        // 수정
        else {
            // 이미지 파일 변경 체크
            CompanyProductVO beforeData = companyRepo.selectCompanyProduct(user.getUserGroupId(), companyProductVO.getPrdtId());
            // 파일 아이디가 변경되었을 경우 기존 파일 삭제 처리
            if (StringUtils.hasLength(beforeData.getFileId()) && !beforeData.getFileId().equals(companyProductVO.getFileId())) {
                fileService.deleteFile(beforeData.getFileId(), null);
            }
            companyRepo.updateCompanyProduct(companyProductVO);

            // 기존 제품 키워드 목록 삭제
            companyRepo.deleteProductKeywordList(user.getUserGroupId(), companyProductVO.getPrdtId());
        }

        // 제품 키워드 등록
        if (companyProductVO.getKeywordList() != null && companyProductVO.getKeywordList().size() > 0) {
            int keywordSqn = 1;

            for (ProductKeywordVO item : companyProductVO.getKeywordList()) {
                // pk 값 세팅
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setPrdtId(companyProductVO.getPrdtId());
                item.setKwrSqn(keywordSqn);

                companyRepo.insertProductKeyword(item);

                keywordSqn++;
            }
        }
    }

    /**
     * 기업제품 삭제
     */
    public void deleteCompanyProduct(String productId) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 아이디 유효셩 검사
        CompanyProductVO productVO = companyRepo.selectCompanyProduct(user.getUserGroupId(), productId);
        if (productVO == null) {
            throw new BizException(StatusCode.COM0005);
        }

        // 파일 정보 논리삭제
        if (StringUtils.hasLength(productVO.getFileId())) {
            fileService.deleteFile(productVO.getFileId(), null);
        }

        // 제품정보 논리삭제
        companyRepo.deleteCompanyProduct(user.getUserGroupId(), productId, user.getUsername());

        // 논리 삭제이므로 키워드 리스트는 유지
    }

    /**
     * 투자정보  입력/수정
     *
     * @param companyInvestVO
     * @throws Exception
     */
    public void saveCompanyInvestHope(CompanyInvestVO companyInvestVO) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        /** 투자희망 정보 입력/수정 **/

        // 투자희망 정보 오브젝트 확인
        if (companyInvestVO.getInvestHope() == null) {
            throw new BizException(StatusCode.COM0005);
        }

        CompanyInvestHopeVO investHopeVO = companyInvestVO.getInvestHope();

        // 회원, 기업 아이디 정보 세팅
        investHopeVO.setUtlinsttId(user.getUserGroupId());
        investHopeVO.setAmnnUserId(user.getUsername());

        // 유효성 검사
        if (!investHopeVO.getOppbYn().equals(IvtCode.YnTypeEnum.Y.name())
                && !investHopeVO.getOppbYn().equals(IvtCode.YnTypeEnum.N.name())) {
            throw new BizException(StatusCode.COM0005);
        }
        if (!investHopeVO.getOsivHopeyn().equals(IvtCode.YnTypeEnum.Y.name())
                && !investHopeVO.getOsivHopeyn().equals(IvtCode.YnTypeEnum.N.name())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 등록
        if (companyRepo.selectCompanyInvestHope(user.getUserGroupId()) == null) {
            investHopeVO.setRgsnUserId(user.getUsername());
            companyRepo.insertCompanyInvestHope(investHopeVO);
        }
        // 수정
        else {
            companyRepo.updateCompanyInvestHope(investHopeVO);
        }

        /** 투자분야(비즈니스 분야) 등록 **/

        // 기존 투자분야 정보 삭제
        companyRepo.deleteCompanyInvestFieldList(user.getUserGroupId());

        // 비즈니스 분야 리스트 등록
        if (companyInvestVO.getInvestFieldList() != null && companyInvestVO.getInvestFieldList().size() > 0) {
            int seq = 1;
            for (CompanyInvestFieldVO item : companyInvestVO.getInvestFieldList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setIvflSqn(seq);

                companyRepo.insertCompanyInvestField(item);
                seq++;
            }
        }

        /** 활용기술 등록 **/

        // 기존 활용기술 정보 삭제
        companyRepo.deleteCompanyUtilTechList(user.getUserGroupId());

        // 활용기술 리스트 등록
        if (companyInvestVO.getUtilTechList() != null && companyInvestVO.getUtilTechList().size() > 0) {
            int seq = 1;
            for (CompanyUtilTechVO item : companyInvestVO.getUtilTechList()) {
                item.setUtlinsttId(user.getUserGroupId());
                item.setRgsnUserId(user.getUsername());
                item.setUtlzTchnSqn(seq);

                companyRepo.insertCompanyUtilTech(item);
                seq++;
            }
        }
    }

    /**
     * 팀원정보 입력/수정
     *
     * @param memberList
     * @throws Exception
     */
    public void saveCompanyMember(List<CompanyMemberVO> memberList) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기존 팀원정보 조회
        List<CompanyMemberVO> beforeList = companyRepo.selectCompanyMemberList(user.getUserGroupId());
        beforeList = beforeList == null ? new ArrayList<>() : beforeList;

        // 팀원 등록 인원수 제한 체크
        if (beforeList.size() >= 10) {
            throw new BizException(StatusCode.BIZ0001);
        }

        // 삭제될 팀원정보 아이디, 파일아이디 후보 리스트 세팅
        List<String> deleteMemberList = new ArrayList<>(beforeList.size());
        List<String> deleteFileList = new ArrayList<>(beforeList.size());

        beforeList.forEach(x -> {
            deleteMemberList.add(x.getTmmbId());
            if (StringUtils.hasLength(x.getFileId())) {
                deleteFileList.add(x.getFileId());
            }
        });

        /** 등록 | 수정 처리 **/
        for (CompanyMemberVO item : memberList) {

            // 공통 정보 세팅
            item.setAmnnUserId(user.getUsername());
            item.setUtlinsttId(user.getUserGroupId());

            // 팀원 아이디가 있는 경우 -> 수정처리
            if (StringUtils.hasLength(item.getTmmbId())) {
                // 삭제후보아이디 리스트에서 항목 제외
                if (!deleteMemberList.remove(item.getTmmbId())) {
                    // false일 경우 기존에 없는 잘못된 아이디
                    throw new BizException(StatusCode.MNB0003);
                }
                // 파일아이디 삭제후보에서 항목 제거
                deleteFileList.remove(item.getFileId());

                // 팀원정보 업데이트
                companyRepo.updateCompanyMember(item);
            }

            // 아이디가 없는 경우 -> 신규 등록처리
            else {
                item.setTmmbId(UUID.randomUUID().toString());
                item.setRgsnUserId(user.getUsername());

                companyRepo.insertCompanyMember(item);
            }
        }

        /** 삭제 처리 **/
        for (String memberId : deleteMemberList) {
            companyRepo.deleteCompanyMember(user.getUserGroupId(), memberId);
        }
        for (String fileId : deleteFileList) {
            fileService.deleteFile(fileId, null);
        }
    }

    /**
     * 소개영상 입력/수정
     *
     * @param introMediaList
     * @throws Exception
     */
    public void saveCompanyIntroMedia(List<CompanyIntroMediaVO> introMediaList) throws Exception {

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기업회원 체크
        if (!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            throw new BizException(StatusCode.COM0005);
        }

        // 기존 소개영상 정보 삭제
        companyRepo.deleteCompanyIntroMediaList(user.getUserGroupId());

        int seq = 1;

        /** 등록&수정 **/
        for (CompanyIntroMediaVO item : introMediaList) {
            // 기업, 로그인ID 등 기본정보 세팅
            item.setUtlinsttId(user.getUserGroupId());
            item.setInrdPictSqn(seq);

            item.setRgsnUserId(user.getUsername());
            item.setAmnnUserId(user.getUsername());

            companyRepo.insertCompanyIntroMedia(item);
            seq++;
        }
    }

}
