package com.ibk.sb.restapi.biz.service.vncmloan;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVcRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminConvertVcHistoryVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.VncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.repo.CommonFileRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.common.vo.RequestBinaryFileSaveVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.constant.CmmScpConst;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechContentVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.RequestCmmScpVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.InfotechClientKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapBizLicenseSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapTxtnVatCerlsnVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import com.ibk.sb.restapi.biz.service.vncmloan.repo.VncmLoanRepo;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcCountVO;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

@Service
@RequiredArgsConstructor
public class VncmLoanService {

    private final VncmLoanRepo vncmLoanRepo;
    private final CommonFileRepo commonFileRepo;
    private final CommonFileService fileService;
	private final PlatformDocumentService platformDocumentService;
    private final CompanyService companyService;
    private final CommonFileService commonFileService;
    private final AdminVcRepo adminVcRepo;
    
    Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 간접투자 - 벤처대출 추천 내역 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<VncmLoanVO> searchVncmLoanList(RequestVncmLoanVO params) throws Exception  {
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        params.setSearchUtlinsttId(user.getUserGroupId()); // 의뢰기관 아이디

        // 벤처대출추천접수 리스트 조회
        List<VncmLoanVO> vnemtrlonReqsList = vncmLoanRepo.searchVncmLoanList(params);
        vnemtrlonReqsList = vnemtrlonReqsList == null ? new ArrayList<>() : vnemtrlonReqsList;

        return new PagingVO<>(params, vnemtrlonReqsList);
    }

    /**
     * 간접투자 - 벤처대출 추천 내역 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<VncmLoanVO> searchVncmLoanMyList(RequestVncmLoanVO params) throws Exception  {
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        params.setSearchUtlinsttId(user.getUserGroupId()); // 의뢰기관 아이디

        // 벤처대출추천접수 리스트 조회
        List<VncmLoanVO> vnemtrlonReqsMyList = vncmLoanRepo.searchVncmLoanMyList(params);
        vnemtrlonReqsMyList = vnemtrlonReqsMyList == null ? new ArrayList<>() : vnemtrlonReqsMyList;

        return new PagingVO<>(params, vnemtrlonReqsMyList);
    }

    /**
     * 간접투자 - 벤처대출 신청 내역 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<VncmLoanAplcVO> searchVncmLoanAplcList(RequestVncmLoanVO params) throws Exception  {
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        params.setSearchUtlinsttId(user.getUserGroupId()); // 의뢰기관 아이디
        params.setSearchRcmdEnrpBzn(user.getUserGroupBizNum()); // 제안 기업 사업자번호
        
        // 벤처대출추천접수 리스트 조회
        List<VncmLoanAplcVO> vnemtrlonAplcList = vncmLoanRepo.searchVncmLoanAplcList(params);
        vnemtrlonAplcList = vnemtrlonAplcList == null ? new ArrayList<>() : vnemtrlonAplcList;

        return new PagingVO<>(params, vnemtrlonAplcList);
    }
    /**
     * 간접투자 - 벤처대출 추천 여부 및 자료요청 확인
     * @return
     * @throws Exception
     */
    public VncmLoanAplcCountVO getCountByRecommendStatus() throws Exception  {
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user == null){
            return null;
        }
        String bzn = user.getUserGroupBizNum();
        String searchStatus = "RST01004"; // 자료요청

        VncmLoanAplcCountVO countData = vncmLoanRepo.countVncmLoanAplcByRecommendStatus(bzn, searchStatus);

        return countData;
    }

    /**
     * 간접투자 - 벤처대출신청 상세 조회
     * @param vnentrlonId
     * @return
     * @throws Exception
     */
    public VncmLoanAplcVO searchVncmLoanAplc(String vnentrlonId) throws Exception {

        // 벤처대출추천접수 조회
        VncmLoanAplcVO vncmLoanAplcVO = vncmLoanRepo.searchVncmLoanAplc(vnentrlonId);
        
        if(vncmLoanAplcVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

     // 파일 리스트 조회
        List<BoxIvtFileVO> fileList01 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100101", "BSD01001");
        vncmLoanAplcVO.setResBizrnoList(fileList01 == null ? new ArrayList<>() : fileList01);

        List<BoxIvtFileVO> fileList02 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100102", "BSD01001");
        vncmLoanAplcVO.setResVatStdtaxProofList(fileList02 == null ? new ArrayList<>() : fileList02);

        List<BoxIvtFileVO> fileList03 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100103", "BSD01001");
        vncmLoanAplcVO.setResCprRgistMatterAllCrtfList(fileList03 == null ? new ArrayList<>() : fileList03);

        List<BoxIvtFileVO> fileList04 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100104", "BSD01001");
        vncmLoanAplcVO.setResStchInfoMngmNoList(fileList04 == null ? new ArrayList<>() : fileList04);

        List<BoxIvtFileVO> fileList05 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100105", "BSD01001");
        vncmLoanAplcVO.setResCmpnyIntrcnList(fileList05 == null ? new ArrayList<>() : fileList05);

        List<BoxIvtFileVO> fileList06 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100106", "BSD01001");
        vncmLoanAplcVO.setResInnfInqCosnList(fileList06 == null ? new ArrayList<>() : fileList06);

        List<BoxIvtFileVO> fileList07 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100107", "BSD01001");
        vncmLoanAplcVO.setResInnfClusCosnList(fileList07 == null ? new ArrayList<>() : fileList07);

        List<BoxIvtFileVO> fileList08 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100108", "BSD01001");
        vncmLoanAplcVO.setResAtcscAtchmnflList(fileList08 == null ? new ArrayList<>() : fileList08);

        List<BoxIvtFileVO> fileList09 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100109", "BSD01001");
        vncmLoanAplcVO.setResGmtsckAnactList(fileList09 == null ? new ArrayList<>() : fileList09);

        List<BoxIvtFileVO> fileList10 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100110", "BSD01001");
        vncmLoanAplcVO.setResInvtCnfrmnList(fileList10 == null ? new ArrayList<>() : fileList10);

        List<BoxIvtFileVO> fileList11 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100111", "BSD01001");
        vncmLoanAplcVO.setResCptalUsgplnList(fileList11 == null ? new ArrayList<>() : fileList11);

        List<BoxIvtFileVO> fileList12 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100112", "BSD01001");
        vncmLoanAplcVO.setResSprnApfrList(fileList12 == null ? new ArrayList<>() : fileList12);

        List<BoxIvtFileVO> fileList13 = vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100113", "BSD01001");
        vncmLoanAplcVO.setResGitaList(fileList13 == null ? new ArrayList<>() : fileList13);

        return vncmLoanAplcVO;
    }


    /**
     * 벤처대출추천 저장, 수정
     */
    public void saveVncmLoanApply(VncmLoanVO vncmLoanVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        int agisChk = vncmLoanRepo.selectAgisChk(user.getUserGroupBizNum());

        if(agisChk < 1){
            throw new BizException(StatusCode.MNB0002);
        }

        vncmLoanVO.setUtlinsttId(user.getUserGroupId());    // 의뢰기관 아이디
        if (ObjectUtils.isEmpty(vncmLoanVO.getVnentrlonId())) {
            vncmLoanVO.setVnentrlonId(UUID.randomUUID().toString()); // uuid
            vncmLoanVO.setRecomendSttus("RST01001");            // 추천상태 (RST01001:추천 완료)
            if(!vncmLoanRepo.insertVncmLoanRequest(vncmLoanVO)) throw new BizException(StatusCode.MNB0002);
        }else{
            vncmLoanVO.setRecomendSttus("RST01003");            // 추천상태 (RST01003:보완수정제출(VC))
            if(!vncmLoanRepo.updateVncmLoanRequest(vncmLoanVO)) throw new BizException(StatusCode.MNB0002);
        }


        //수정시 이전에 등록된 데이터 삭제 처리 del_yn = y
        if(!ObjectUtils.isEmpty(vncmLoanVO.getDeleteKeys())) {
            for( String fileId : vncmLoanVO.getDeleteKeys()){
                commonFileRepo.deleteFileInfo(fileId, user.getUsername());
            }
        }

        if(vncmLoanVO.getInvtFactPrufPapersAtch() != null) {
        	for( MultipartFile file : vncmLoanVO.getInvtFactPrufPapersAtch()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01006"+"01");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01006");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);
            }
        }
        if(vncmLoanVO.getInvtAnalsReprtAtch() != null) {
            for( MultipartFile file : vncmLoanVO.getInvtAnalsReprtAtch()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01006"+"02");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01006");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);
            }
        }
        if(vncmLoanVO.getEtcFileAtch() != null) {
        	for( MultipartFile file : vncmLoanVO.getEtcFileAtch()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01006"+"03");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01006");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);
            }
        }
    }

    /**
     * 벤처대출 신청 등록
     */
    public void saveVncmLoanAplc(VncmLoanAplcVO vncmLoanAplcVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//        int agisChk = vncmLoanRepo.selectAgisChk(user.getUserGroupBizNum());
//
//        if(agisChk < 1){
//        	throw new BizException(StatusCode.MNB0002);
//        }

        int insCnt = 0;

        if(StringUtils.hasLength(vncmLoanAplcVO.getVnentrlonId())) {
            insCnt = vncmLoanRepo.updateVncmLoanAplc(vncmLoanAplcVO);
        } else {
            vncmLoanAplcVO.setVnentrlonId(UUID.randomUUID().toString());// uuid
//        	 의뢰기관 아이디
            vncmLoanAplcVO.setUtlinsttId(user.getUserGroupId());
            vncmLoanAplcVO.setRecomendSttusCm("RST02001");  // 추천상태 (RST02001:자료요청)
            insCnt = vncmLoanRepo.insertVncmLoanAplc(vncmLoanAplcVO);
        }

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);

        // 기존 첨부 파일 정보 삭제
        vncmLoanRepo.deleteVncmLoanFileMapping(vncmLoanAplcVO.getVnentrlonId());

        if(vncmLoanAplcVO.getReqBizrnoList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqBizrnoList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"01");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqVatStdtaxProofList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqVatStdtaxProofList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"02");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqCprRgistMatterAllCrtfList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqCprRgistMatterAllCrtfList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"03");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqStchInfoMngmNoList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqStchInfoMngmNoList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"04");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqCmpnyIntrcnList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqCmpnyIntrcnList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"05");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqInnfInqCosnList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqInnfInqCosnList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"06");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqInnfClusCosnList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqInnfClusCosnList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"07");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqAtcscAtchmnflList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqAtcscAtchmnflList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"08");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqGmtsckAnactList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqGmtsckAnactList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"09");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqInvtCnfrmnList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqInvtCnfrmnList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"10");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqCptalUsgplnList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqCptalUsgplnList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"11");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqSprnApfrList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqSprnApfrList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"12");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }
        if(vncmLoanAplcVO.getReqGitaList() != null) {
            for( MultipartFile file : vncmLoanAplcVO.getReqGitaList()){
                ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);
                BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

                boxIvtFileVO.setInvtId(vncmLoanAplcVO.getVnentrlonId());
                boxIvtFileVO.setAtchDsnc("BSD01001"+"13");
                boxIvtFileVO.setFileId(fileInfoVO.getFileId());
                boxIvtFileVO.setBsdsCd("BSD01001");
                boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

                int fileInsCnt = vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
                if(fileInsCnt < 1) throw new BizException(StatusCode.MNB0002);

            }
        }

    }

    /**
     * 벤처대출신청취소
     */
    public void saveVncmLoanAplcCancel(VncmLoanAplcVO vncmLoanAplcVO) throws Exception {

        int insCnt = 0;

        insCnt = vncmLoanRepo.updateVncmLoanAplcSts(vncmLoanAplcVO);

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);

    }

    /**
     * 제안센터 벤처대출 투자사 체크
     * @return VncmLoanVO
     * @throws Exception
     */
    public VncmLoanVO getDetail(String vnentrlonId) throws Exception {

        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //로그인 정보 조회
        if (ObjectUtils.isEmpty(user.getUserGroupBizNum())) {
            logger.error("벤처대출추천 정보가 유효하지 않습니다.");
            throw new BizException(StatusCode.COM0005);
        }

        String invmEnprNm = vncmLoanRepo.searchVncmLoanAuthority(user.getUserGroupBizNum());

        if (ObjectUtils.isEmpty(invmEnprNm)) {
            logger.error("벤처대출추천가능한 기관이 아닙니다. biz no : {}", user.getUserGroupBizNum());
            throw new BizException(StatusCode.COM0005, "벤처대출 추천가능한 기관이 아닙니다.");
        }
        
        //신규등록일경우
        if(ObjectUtils.isEmpty(vnentrlonId)){
            return VncmLoanVO.builder().invtDtlsInvtInstt(invmEnprNm).build();
        }else{
            //수정일경우
            VncmLoanVO vncmLoanVO = vncmLoanRepo.searchVncmLoanDetail(vnentrlonId);
            vncmLoanVO.setInvtFactPrufPapersFileInfo(vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100601", "BSD01006"));
            vncmLoanVO.setInvtAnalsReprtFileInfo(vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100602", "BSD01006"));
            vncmLoanVO.setEtcFileFileInfo(vncmLoanRepo.selectVncmLoanFileList(vnentrlonId, "BSD0100603", "BSD01006"));
            
            return vncmLoanVO;
        }
    }
    
    /**
     * 투자 유치 명세
     * @return VncmLoanVO
     * @throws Exception
     */
    public PagingVO<VncmLoanVO> getVncmInvestList(RequestVncmLoanVO vo) throws Exception {

        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // 투자 유치 내역 조회(최근 2년이내)
    	LocalDate getDate 	= LocalDate.now(ZoneId.of("Asia/Seoul"));
        String currentYm 	= String.valueOf(getDate).replace("-", "");
        String searchYm 	= LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - 2, 
        		LocalDate.now(ZoneId.of("Asia/Seoul")).getMonth(), 
        		LocalDate.now(ZoneId.of("Asia/Seoul")).getDayOfMonth()).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        vo.setStartDate(searchYm);
        vo.setEndDate(currentYm);
        vo.setSearchUtlinsttId(user.getUserGroupId());
        List<VncmLoanVO> vncmLoanInvest = vncmLoanRepo.searchVncmLoanInvestList(vo);
        
        return new PagingVO<>(vo, vncmLoanInvest);
    }
    
    /**
     * 필요서류 자동 제출 사업자등록증
     * @param infotechClientKeyVO
     * @param response
     * @throws Exception
     */
    public HashMap<String, Object> searchInfotechBznFile() throws Exception {
    	CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    	
    	if(!StringUtils.hasLength(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);
        
    	LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        String currentYm = String.valueOf(getDate).replace("-", "");
        HashMap<String, Object> map = new HashMap<String, Object>();
        
    	// 기등록 infotech cloud key 조회
    	CompanyBasicVO companyBasicVO = new CompanyBasicVO();
    	companyBasicVO.setUtlinsttId(user.getUserGroupId());
    	
    	// 사업자번호 조회
        companyBasicVO = companyService.setCompanyBasicPlatformInfo(companyBasicVO);
        String clientKey = platformDocumentService.searchInfotechClientKey(companyBasicVO.getBizrno());
        
        // clientKey가 있는 경우 사업자등록증 pdf 조회
        if(StringUtils.hasLength(clientKey)) {
            // request parameter set
            RequestCmmScpVO baseScpRequest = RequestCmmScpVO.builder()
                    .clientCertKey(clientKey)
                    .bizNo(companyBasicVO.getBizrno())
                    .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
                    .docCd(CmmScpConst.DocTypeEnum.INFOTECH_BIZ_LICENSE.getCode())
                    .build();

            Map<String, String> addParam = new HashMap<>();
            addParam.put("pdfYnE101", IvtCode.YnTypeEnum.Y.name());
            addParam.put("recordYn", "N");
            
            try {
                InfotechContentVO.E101PdfOnly scpRslt = platformDocumentService
                        .searchCmmScpInfotechData(baseScpRequest, InfotechContentVO.E101PdfOnly.class, addParam);
                if(scpRslt != null && StringUtils.hasLength(scpRslt.getPdfHex())) {
                	String getPdfHex = scpRslt.getPdfHex();
                	byte[] decode = DatatypeConverter.parseHexBinary(getPdfHex.toString());
                	
                	RequestBinaryFileSaveVO saveFileInfo = RequestBinaryFileSaveVO.builder()
            			.binary(decode)
            			.mime("application/pdf")
            			.ext("pdf")
            			.fileNm("사업자등록증_"+ currentYm +".pdf")
            			.build();
                	
                	map.put("bznFile", commonFileService.uploadBinaryFile(saveFileInfo, IvtCode.YnTypeEnum.N));
                }
            }
            // 검색실패, 서버 통신 문제 등의 경우 이미지 파일을 전송
            // 그외 exception, bizException의 경우 throw 처리
            catch (BizException bx) {
                logger.error("Scrapping Biz License Error : {}", bx.getErrorMsg());
                if(!bx.getErrorCode().equals(StatusCode.MNB0003)
                    && !bx.getErrorCode().equals(StatusCode.MNB0001)) throw bx;
            }
        }
        return map;
    }
    
    /**
     * 필요서류 자동 제출 부가가치과세 표준 증명
     * @param infotechClientKeyVO
     * @param response
     * @throws Exception
     */
    public HashMap<String, Object> searchInfotechTaxVatFile() throws Exception {
    	CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    	
    	if(!StringUtils.hasLength(user.getUserGroupId())) throw new BizException(StatusCode.COM0005);
       
    	// 기등록 infotech cloud key 조회
    	CompanyBasicVO companyBasicVO = new CompanyBasicVO();
    	companyBasicVO.setUtlinsttId(user.getUserGroupId());
    	HashMap<String, Object> map = new HashMap<String, Object>();
    	
    	// 사업자번호 조회
        companyBasicVO = companyService.setCompanyBasicPlatformInfo(companyBasicVO);
        String clientKey = platformDocumentService.searchInfotechClientKey(companyBasicVO.getBizrno());
        
        //부가가치세 과세 표준 증명서 조회
        // 과세기간 기준 설정 (최근3개년도 1~12)
        String txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - 3, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
        String txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - 1, Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
        
        // clientKey가 있는 경우 사업자등록증 pdf 조회
        if(StringUtils.hasLength(clientKey)) {
            // request parameter set
            RequestCmmScpVO baseScpRequest = RequestCmmScpVO.builder()
                    .clientCertKey(clientKey)
                    .bizNo(companyBasicVO.getBizrno())
                    .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
                    .docCd("E112")
                    .build();

            Map<String, String> addParam = new HashMap<>();
            addParam.put("pdfYnE112", IvtCode.YnTypeEnum.Y.name());
            addParam.put("txnrmStrtYmE112", txnrmStrtYm);
            addParam.put("txnrmEndYmE112", txnrmEndYm);
            addParam.put("recordYn", "N");

            try {
                InfotechContentVO.E101PdfOnly scpRslt = platformDocumentService
                        .searchCmmScpInfotechData(baseScpRequest, InfotechContentVO.E101PdfOnly.class, addParam);
                if(scpRslt != null && StringUtils.hasLength(scpRslt.getPdfHex())){
                	// pdf hex 변환 전송
                	String getPdfHex = scpRslt.getPdfHex();
                	byte[] decode = DatatypeConverter.parseHexBinary(getPdfHex.toString());
                	
                	RequestBinaryFileSaveVO saveFileInfo = RequestBinaryFileSaveVO.builder()
            			.binary(decode)
            			.mime("application/pdf")
            			.ext("pdf")
            			.fileNm("부가가치세 과세 표준 증명_"+ txnrmStrtYm + "~" + txnrmEndYm +".pdf")
            			.build();
                	
                	map.put("vatFile", commonFileService.uploadBinaryFile(saveFileInfo, IvtCode.YnTypeEnum.N));
                }
                
            }
            // 검색실패, 서버 통신 문제 등의 경우 이미지 파일을 전송
            // 그외 exception, bizException의 경우 throw 처리
            catch (BizException bx) {
                logger.error("Scrapping Biz License Error : {}", bx.getErrorMsg());
                if(!bx.getErrorCode().equals(StatusCode.MNB0003)
                    && !bx.getErrorCode().equals(StatusCode.MNB0001)) throw bx;
            }
        }
        return map;
    }
}
