package com.ibk.sb.restapi.biz.service.admin;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVncmLoanRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminRCmdExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVCmdExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanAplcVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxpBprFileCrtRealtimeOutVo;
import com.ibk.sb.restapi.biz.service.admin.vo.BprFileCrtRealtimeVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BprRequestVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.repo.CommonCodeRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.EtcInptItmMngmVO;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.FundIrStockExcelVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoPageVO;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenAlarmFeign;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenCommonFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.vncmloan.repo.VncmLoanRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminVncmLoanService {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    private final AdminVncmLoanRepo repo;
    private final CommonFileService fileService;
    private final BoxOpenCommonFeign boxOpenCommonFeign;
    private final CommonCodeRepo commonCodeRepo;
    private final VncmLoanRepo vncmLoanRepo;
    private final BoxOpenAlarmFeign alarmFeign;

    private final static String BRANCH_CODE        = "0701";   //지점코드(4)
    private final static String EMP_NO             = "000000"; //직원번호(6)
    private final static String SCAN_ID            = "01";     //스캔ID(2)
    private final static String JOB_CODE           = "01";     //업무코드(2)
    private final static String JOB_DETAIL_CODE    = "6013";   //세부업무코드(4)

    /**
     * 운영자 포탈 - 벤처대출추천접수 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<AdminVncmLoanVO> searchVncmLoanList(RequestVncmLoanVO params) throws Exception  {

        // 벤처대출추천접수 리스트 조회
        List<AdminVncmLoanVO> vnemtrlonReqsList = repo.searchVncmLoanList(params);
        vnemtrlonReqsList = vnemtrlonReqsList == null ? new ArrayList<>() : vnemtrlonReqsList;

        return new PagingVO<>(params, vnemtrlonReqsList);
    }

    /**
     * 운영자 포탈 - 벤처대출추천접수 상세 조회
     * @param vnentrlonId
     * @return
     * @throws Exception
     */
    public AdminVncmLoanVO searchVncmLoan(String vnentrlonId, String rcmdEnprBzn) throws Exception {

        // 벤처대출추천접수 조회
    	AdminVncmLoanVO adminVncmLoanVO = repo.searchVncmLoan(vnentrlonId, rcmdEnprBzn);
    	List<ComCodeVO> codeList = commonCodeRepo.selectComCode("RST01");
    	
        if(adminVncmLoanVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }
        
        // 파일 리스트 조회
        List<BoxIvtFileVO> fileList01 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100601", "BSD01006");
        adminVncmLoanVO.setInvtFactPrufPapersAtchList(fileList01 == null ? new ArrayList<>() : fileList01);
        
        List<BoxIvtFileVO> fileList02 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100602", "BSD01006");
        adminVncmLoanVO.setInvtAnalsReprtAtchList(fileList02 == null ? new ArrayList<>() : fileList02);
        
        List<BoxIvtFileVO> fileList03 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100603", "BSD01006");
        adminVncmLoanVO.setEtcFileAtchList(fileList03 == null ? new ArrayList<>() : fileList03);
        
        //공통코드
        adminVncmLoanVO.setRecomendSttusCdList(codeList);
        
        return adminVncmLoanVO;
    }
    /**
     * 운영자 포탈 - 벤처대출 코드 조회
     * @return
     * @throws Exception
     */
    public List<ComCodeVO> searchVncmLoanCodes() throws Exception {

        List<ComCodeVO> codeList1 = commonCodeRepo.selectComCode("RST01");
        List<ComCodeVO> codeList2 = commonCodeRepo.selectComCode("RST02");
        codeList1.addAll(codeList2);

        return codeList1;
    }
    /**
     * 간접투자 - 벤처대출 신청 내역 페이징 리스트 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<AdminVncmLoanAplcVO> searchVncmLoanAplcList(RequestVncmLoanVO params) throws Exception  {
    	// 로그인 정보 조회
//        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        params.setSearchUtlinsttId(user.getUserGroupId()); // 의뢰기관 아이디

        // 벤처대출추천접수 리스트 조회
        List<AdminVncmLoanAplcVO> vnemtrlonAplcList = repo.searchVncmLoanAplcList(params);
        vnemtrlonAplcList = vnemtrlonAplcList == null ? new ArrayList<>() : vnemtrlonAplcList;

        return new PagingVO<>(params, vnemtrlonAplcList);
    }

    /**
     * 운영자 포탈 - 벤처대출신청 상세 조회
     * @param vnentrlonId
     * @return
     * @throws Exception
     */
    public AdminVncmLoanAplcVO searchVncmLoanAplc(String vnentrlonId, String bzn) throws Exception {

        // 벤처대출추천접수 조회
    	AdminVncmLoanAplcVO adminVncmLoanAplcVO = repo.searchVncmLoanAplc(vnentrlonId, bzn);
    	
        if(adminVncmLoanAplcVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }


        // 파일 리스트 조회
        List<BoxIvtFileVO> fileList01 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100101", "BSD01001");
        adminVncmLoanAplcVO.setResBizrnoList(fileList01 == null ? new ArrayList<>() : fileList01);
        
        List<BoxIvtFileVO> fileList02 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100102", "BSD01001");
        adminVncmLoanAplcVO.setResVatStdtaxProofList(fileList02 == null ? new ArrayList<>() : fileList02);
        
        List<BoxIvtFileVO> fileList03 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100103", "BSD01001");
        adminVncmLoanAplcVO.setResCprRgistMatterAllCrtfList(fileList03 == null ? new ArrayList<>() : fileList03);
        
        List<BoxIvtFileVO> fileList04 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100104", "BSD01001");
        adminVncmLoanAplcVO.setResStchInfoMngmNoList(fileList04 == null ? new ArrayList<>() : fileList04);
        
        List<BoxIvtFileVO> fileList05 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100105", "BSD01001");
        adminVncmLoanAplcVO.setResCmpnyIntrcnList(fileList05 == null ? new ArrayList<>() : fileList05);
        
        List<BoxIvtFileVO> fileList06 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100106", "BSD01001");
        adminVncmLoanAplcVO.setResInnfInqCosnList(fileList06 == null ? new ArrayList<>() : fileList06);
        
        List<BoxIvtFileVO> fileList07 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100107", "BSD01001");
        adminVncmLoanAplcVO.setResInnfClusCosnList(fileList07 == null ? new ArrayList<>() : fileList07);
        
        List<BoxIvtFileVO> fileList08 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100108", "BSD01001");
        adminVncmLoanAplcVO.setResAtcscAtchmnflList(fileList08 == null ? new ArrayList<>() : fileList08);
        
        List<BoxIvtFileVO> fileList09 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100109", "BSD01001");
        adminVncmLoanAplcVO.setResGmtsckAnactList(fileList09 == null ? new ArrayList<>() : fileList09);
        
        List<BoxIvtFileVO> fileList10 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100110", "BSD01001");
        adminVncmLoanAplcVO.setResInvtCnfrmnList(fileList10 == null ? new ArrayList<>() : fileList10);
        
        List<BoxIvtFileVO> fileList11 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100111", "BSD01001");
        adminVncmLoanAplcVO.setResCptalUsgplnList(fileList11 == null ? new ArrayList<>() : fileList11);
        
        List<BoxIvtFileVO> fileList12 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100112", "BSD01001");
        adminVncmLoanAplcVO.setResSprnApfrList(fileList12 == null ? new ArrayList<>() : fileList12);

        List<BoxIvtFileVO> fileList13 = repo.selectVncmLoanFileList(vnentrlonId, "BSD0100113", "BSD01001");
        adminVncmLoanAplcVO.setResGitaList(fileList13 == null ? new ArrayList<>() : fileList13);

        return adminVncmLoanAplcVO;
    }

    /**
     * 운영자 포탈 - 벤처대출추천접수 상태 등록
     * @param requestBodyAdminVO
     * @return
     */
    public boolean saveVncmLoan(RequestBodyAdminVO<AdminVncmLoanVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        // 벤처대출추천접수 정보 저장
        int insCnt = 0;
        int insCnt2 = 0;
        
        // 관리자 아이디 설정
        requestBodyAdminVO.getParams().setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        requestBodyAdminVO.getParams().setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        if(StringUtils.hasLength(requestBodyAdminVO.getParams().getVnentrlonId())) {
        	insCnt = repo.updateVncmLoanInfo(requestBodyAdminVO.getParams());

            // 벤처대출추천접수 조회
        	AdminVncmLoanAplcVO adminVncmLoanAplcVO = repo.searchVncmLoanAplc(requestBodyAdminVO.getParams().getVnentrlonId(), "");
        	
            if(adminVncmLoanAplcVO == null) {
                insCnt2 = repo.insertVncmLoanAplc(requestBodyAdminVO.getParams());
            }else {
            	insCnt = repo.updateVncmLoanInfo(requestBodyAdminVO.getParams());
            }
        }

        return true;
    }

    /**
     * BPR 파일 저장
     * @param
     * @return
     */
    public boolean saveBpr(BprRequestVO bprRequestVO) throws Exception {

        boolean isNewBprIdxNo = false;

        if (ObjectUtils.isEmpty(bprRequestVO) || ObjectUtils.isEmpty(bprRequestVO.getVnentrlonId())) {
            logger.error("벤처대출신청번호가 유효하지 않습니다.");
            throw new BizException(StatusCode.COM0005);
        }

        //정보를 불러옴
        AdminVncmLoanVO vncmLoanVo = repo.searchVncmLoan(bprRequestVO.getVnentrlonId(),"");

        if (ObjectUtils.isEmpty(vncmLoanVo)) {
            logger.error("벤처대출신청정보가 유효하지 않습니다.");
            throw new BizException(StatusCode.COM0005);
        }

        //bpr no 채번
        if(ObjectUtils.isEmpty(vncmLoanVo.getBprIdxNo().trim())){
            vncmLoanVo.setBprIdxNo(getBprIdxNo());
            isNewBprIdxNo = true;
        }

        //bpr전송
        String bizNo = String.valueOf(vncmLoanVo.getRcmdEnprBzn()); //사업자번로
        String csm = String.valueOf(vncmLoanVo.getEtnm());          //기업명
        String bprIdxNo = String.valueOf(vncmLoanVo.getBprIdxNo());

        List<BprFileCrtRealtimeVO.DocListItem> docList = new ArrayList<BprFileCrtRealtimeVO.DocListItem>();

        //to hexString
        for(BprRequestVO.BprItem bpr : bprRequestVO.getBprItems()){
            docList.add(fileToPdfHexString(bpr));
        }

        //bpr api 호출
        BprFileCrtRealtimeVO.BprVO brpVo = BprFileCrtRealtimeVO.BprVO.builder().indexKey(bprIdxNo).bizNo(bizNo).csm(csm).edpsCsn("").docList(docList).build();
        BoxpBprFileCrtRealtimeOutVo response = boxOpenCommonFeign.bprFileCrtRealtime(brpVo);

        //실패시 throw new
        if(response == null) throw new BizException(StatusCode.MNB0001);

        //bpr저장 isNewBprIdxNo true일경우 저장
        if(isNewBprIdxNo){
            repo.insertVncmLoanBprIdxNo(vncmLoanVo);
        }

        return true;

    }

    public BprFileCrtRealtimeVO.DocListItem fileToPdfHexString(BprRequestVO.BprItem bprRequestVO) {

        logger.debug("서류제출  PDF 파일 변환 docCd :: {}", bprRequestVO.getDocCd());
        logger.debug("서류제출  PDF 파일 변환 File Count :: {}", bprRequestVO.getFiles());

        List<String> pdfHex = new ArrayList<String>();

        for(MultipartFile file : bprRequestVO.getFiles()){
            //빈값 일경우
            if(file.isEmpty()) return null;
            try {
                //확장자 체크
                String fileNm = file.getOriginalFilename(); //원본 파일명
                if (fileNm!=null && fileNm.trim().length() > 0) {
                    String ext = (fileNm.substring(fileNm.lastIndexOf(".") + 1)).toUpperCase();
                    StringBuilder hexString = new StringBuilder();				  //bprVo에 넣을 hex String
                    logger.debug("BPR 전송 대상 파일 확장자 CHECK >> " + ext);
                    if ("PDF".equals(ext)) {
                        for(byte b : file.getBytes()){
                            hexString.append(String.format("%02x", b));
                            pdfHex.add(hexString.toString());
                        }
                    }else if ("PNG".equals(ext) || "JPEG".equals(ext) || "JPG".equals(ext)) { // 확장자 White List 추가시.
                        //제출 파일이 PDF가 아닐경우 PDF로 변환하여 16진수로.
                        ByteArrayOutputStream byteArr =  new ByteArrayOutputStream(); //hex로 변환할 바이트 스트림
                        InputStream in = file.getInputStream();
                        BufferedImage bimg = ImageIO.read(in);

                        float width = bimg.getWidth();
                        float height = bimg.getHeight();

                        //Image to PDF
                        PDDocument doc=new PDDocument();;
                        PDPage page = new PDPage(new PDRectangle(width, height));

                        doc.addPage(page);

                        PDImageXObject pdImage = LosslessFactory.createFromImage(doc, bimg);
                        PDPageContentStream contentStream = new PDPageContentStream(doc, page);
                        contentStream.drawImage(pdImage, 0, 0, width, height);
                        contentStream.close();
                        doc.save(byteArr);
                        doc.close();

                        for(byte b : byteArr.toByteArray()){
                            hexString.append(String.format("%02x", b));
                        }
                        pdfHex.add(hexString.toString());
                    }else{
                        throw new BizException(StatusCode.COM0008);
                    }
                }else{
                    throw new BizException(StatusCode.COM0010);
                }
            } catch (IOException e) {
                logger.error(String.valueOf(e));
                throw new BizException(StatusCode.COM0009);
            }
        }

        return BprFileCrtRealtimeVO.DocListItem.builder()
                .docCd(bprRequestVO.getDocCd())
                .pdfHex(pdfHex)
                .build();
    }

    /**
     * BPR인덱스번호 채번
     * @return rtn
     */
    protected String getBprIdxNo(){

        String rtn = "";
        // bpr인덱스 키 관련 로직
        String docSeq = String.format("%06d", (int)( Math.random() * 1000000 ));
        String ymd = new SimpleDateFormat("yyyyMMdd").format(new Date());
        rtn = JOB_CODE + JOB_DETAIL_CODE + BRANCH_CODE + EMP_NO + ymd + SCAN_ID + docSeq;

        logger.info("BRP인덱스번호 채번 =>{}", rtn);

        return rtn;
    }



    /**
     * 벤처대출 신청 등록 상태 저장
     */
    public void saveVncmLoanAplc(RequestBodyAdminVO<AdminVncmLoanAplcVO> requestBodyAdminVO) throws Exception {
        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        // 벤처대출추천접수 정보 저장
        int insCnt = 0;

        // 관리자 아이디 설정
        requestBodyAdminVO.getParams().setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        requestBodyAdminVO.getParams().setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        if(StringUtils.hasLength(requestBodyAdminVO.getParams().getVnentrlonId())) {
            insCnt = repo.updateVncmLoanAplc(requestBodyAdminVO.getParams());
        }

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);


    }

    /**
   	 * 운영자 포탈 - 협약 벤처투자기관 관리 페이징 리스트 조회
   	 *
   	 * @param params
   	 * @return
   	 * @throws Exception
   	 */
   	public PagingVO<AdminAgisVO> searchAgisList(RequestVncmLoanVO params) throws Exception {

   		// 벤처대출추천접수 리스트 조회
   		List<AdminAgisVO> agisListList = repo.searchAgisList(params);
   		agisListList = agisListList == null ? new ArrayList<>() : agisListList;
   		int argremY =  repo.searchAgremY();
   		int argremN =  repo.searchAgremN();
   		
   		for(int i=0;i<agisListList.size();i++) {
   			agisListList.get(i).setAgremY(argremY);
   			agisListList.get(i).setAgremN(argremN);
   		}
   	
   		
   		return new PagingVO<>(params, agisListList);
   	}

   	/**
	 * 운영자 포탈 - 협약 벤처투자기관 관리 상세 조회
	 *
	 * @param agremVnentrSeq
	 * @return
	 * @throws Exception
	 */
	public AdminAgisVO searchAgisDetail(int agremVnentrSeq) throws Exception {

		// 협약 벤처투자기관 관리
		AdminAgisVO adminAgisVO = repo.searchAgisDetail(agremVnentrSeq);

		if (adminAgisVO == null) {
			throw new BizException(StatusCode.MNB0003);
		}
		
		if (adminAgisVO.getAgrmntAtchmnfl() != null) {
			List<ComFileInfoVO> fileList01 = new ArrayList<>();

			String atchmnfl = adminAgisVO.getAgrmntAtchmnfl();

			String[] arrTemp01 = atchmnfl.split(",");

			for (int i = 0; i < arrTemp01.length; i++) {
				String fileId = arrTemp01[i].trim();
				if (!fileId.equals("")) {
					fileList01.add(fileService.searchFile(fileId));
				}
			}

			adminAgisVO.setAgrmntAtchmnfl2(fileList01 == null ? new ArrayList<>() : fileList01);
		}

		return adminAgisVO;
	}


   	/**
     * 운영자 포탈 - 벤처대출추천접수 상태 등록
     * @param adminAgisVO
     * @return
     */
    public boolean saveAgis(List<MultipartFile> file ,AdminAgisVO adminAgisVO) throws Exception {


    	// 관리자 계정 확인
        if(!(adminAgisVO.getAdminUser() != null)) throw new BizException(StatusCode.COM0005);

        if(adminAgisVO == null) throw new BizException(StatusCode.MNB0002);
        String agrmntAtchmnfl = "";
        // 벤처대출추천접수 정보 저장
        int insCnt = 0;
        
        int agremVnentrSeq = repo.selectAgisSeqInfo();
        logger.info("##########################################");
        logger.info("#### adminAgisVO.getAgremVnentrSeq() : {} " + adminAgisVO.getAgremVnentrSeq());
        logger.info("##########################################");
        
        if(file != null){
	        if(adminAgisVO.getAgremVnentrSeq() == 0){
	        	logger.info("################등록등록등록###################");
		        for( MultipartFile files : file){
		            ComFileInfoVO fileInfoVO = fileService.uploadFile(files, IvtCode.YnTypeEnum.N);
		           
		            BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();
	
					boxIvtFileVO.setInvtId(String.valueOf((agremVnentrSeq + 1)));
					boxIvtFileVO.setAtchDsnc("BSD0100114");
					boxIvtFileVO.setFileId(fileInfoVO.getFileId());
					boxIvtFileVO.setBsdsCd("BSD01001");
					boxIvtFileVO.setRgsnUserId(adminAgisVO.getAdminUser());
	
					vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
		            
		            agrmntAtchmnfl +=fileInfoVO.getFileId()+",";
		        }
	        }else if(adminAgisVO.getAgremVnentrSeq() != 0){
	        	logger.info("################수정수정수정###################");
		        for( MultipartFile files : file){
		            ComFileInfoVO fileInfoVO = fileService.uploadFile(files, IvtCode.YnTypeEnum.N);
		           
		            BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();
	
					boxIvtFileVO.setInvtId(String.valueOf(adminAgisVO.getAgremVnentrSeq()));
					boxIvtFileVO.setAtchDsnc("BSD0100114");
					boxIvtFileVO.setFileId(fileInfoVO.getFileId());
					boxIvtFileVO.setBsdsCd("BSD01001");
					boxIvtFileVO.setRgsnUserId(adminAgisVO.getAdminUser());
	
					vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO);
		            
		            agrmntAtchmnfl +=fileInfoVO.getFileId()+",";
		        }
	        }
        }
        
        if(agrmntAtchmnfl != "" && agrmntAtchmnfl != null){
        	adminAgisVO.setAgrmntAtchmnfl(agrmntAtchmnfl);
        }
        
        insCnt = repo.updateAgisInfo(adminAgisVO);

        if(insCnt < 1) throw new BizException(StatusCode.MNB0002);

        return true;
    }

    /**
     * 이메일 보내기
     * @param requestBodyAdminVO
     * @return
     * @throws Exception
     */
    public BoxListResponseVO<ReceiveEmailVO> emlSndgInq(RequestBodyAdminVO<RequestEmailVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        requestBodyAdminVO.getParams().setDsmsEad("webmaster@ibk.co.kr"); // 발신 이메일
        String nowStr = new SimpleDateFormat("yyMMddHHmmsss").format(new Date());
        String emlSndgRqstSrn = nowStr.concat( RandomStringUtils.randomNumeric(5) );
        requestBodyAdminVO.getParams().setEmlSndgRqstSrn(emlSndgRqstSrn);
        requestBodyAdminVO.getParams().setEmlTtlNm("IBK 투자BOX 알림");
        StringBuffer emailSb = new StringBuffer();
        emailSb.append("투자BOX 플랫폼에서 알려드립니다. \r\n");
        emailSb.append("안녕하세요. IBK기업은행 혁신금융부입니다. \r\n");
        emailSb.append("IBK벤처대출 심사에 필요한 자료 요청드립니다. \r\n");
        emailSb.append("순서대로 작성 및 업로드 부탁드리겠습니다. \r\n");
        emailSb.append("* 외감기업의 경우 감사보고서도 기타첨부파일로 함께 제출부탁드립니다. \r\n");
        emailSb.append("서류를 신속하게 보내주실수록, 빠른 심사에 도움이 됩니다. \r\n");
        emailSb.append("서류 작성 시 궁금한 사항이 있으시면 언제든지 연락 부탁드리겠습니다. \r\n");
        emailSb.append("[IBK벤처대출 담당자] \r\n");
        emailSb.append("이상윤 차장 : (02)729-6837 / rywnlee@ibk.co.kr \r\n");
        emailSb.append("강정호 과장 : (02)6322-5345 / hoya9090@ibk.co.kr \r\n");
        emailSb.append("김오상 대리 : (02)2031-3658 / fiveprizes@ibk.co.kr \r\n");
        emailSb.append("감사합니다. \r\n");

        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encByte = encoder.encode( emailSb.toString().getBytes() );
        String encEmlConStr = new String(encByte);
        requestBodyAdminVO.getParams().setEmlThtxCon1(encEmlConStr);

        // api 호출
        BoxListResponseVO<ReceiveEmailVO> response = alarmFeign.sendPlatformEmail(requestBodyAdminVO.getParams());
        // 투자박스 알림 수신 유무 체크 (리랜더링 필요할 경우를 위해)
        return response;
    }
    
    /**
     * SMS 보내기
     * @param requestBodyAdminVO
     * @return
     * @throws Exception
     */
    public BoxListResponseVO<ReceiveSmsVO> sndgSms(RequestBodyAdminVO<RequestSmsVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);
        StringBuffer smsSb = new StringBuffer();
        requestBodyAdminVO.getParams().setSmsDsmsNo("027297633");
        requestBodyAdminVO.getParams().setMmsTtlNm("[IBK 투자BOX 알림]");
        smsSb.append("투자BOX 플랫폼에서 알려드립니다.\r\n");
        smsSb.append("안녕하세요. IBK기업은행 혁신금융부입니다.\r\n");
        smsSb.append("IBK벤처대출 심사에 필요한 자료 요청드립니다.\r\n");
        smsSb.append("순서대로 작성 및 업로드 부탁드리겠습니다.\r\n");
        smsSb.append("* 외감기업의 경우 감사보고서도 기타첨부파일로 함께 제출부탁드립니다.\r\n");
        smsSb.append("서류를 신속하게 보내주실수록, 빠른심사에 도움이 됩니다.\r\n");
        smsSb.append("서류작성 시 궁금한 사항이 있으시면 언제든지 연락 부탁드리겠습니다.\r\n");
        smsSb.append("[IBK벤처대출 담당자] \r\n");
        smsSb.append("이상윤 차장 : (02)729-6837 / rywnlee@ibk.co.kr \r\n");
        smsSb.append("강정호 과장 : (02)6322-5345 / hoya9090@ibk.co.kr \r\n");
        smsSb.append("김상오 대리 : (02)2031-3658 / fiveprizes@ibk.co.kr \r\n");
        smsSb.append("감사합니다. \r\n");
        requestBodyAdminVO.getParams().setMmsDsmsCon(smsSb.toString());

        // api 호출
        BoxListResponseVO<ReceiveSmsVO> response = alarmFeign.sendPlatformSms(requestBodyAdminVO.getParams());
        // 투자박스 알림 수신 유무 체크 (리랜더링 필요할 경우를 위해)
        return response;
    }
    
    /**
     * 협약 벤처 투자기관 엑셀 다운로드
     * @param searchParams
     * @param response
     * @throws Exception
     */
    public void excelDownload(RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {

    	// 투자사전환 요청 목록 전체 조회
    	searchParams.setPage(null);
    	searchParams.setRecord(null);
    	List<AdminAgisExcelVO> agisListList = repo.searchExcelAgisList(searchParams);
    	
    	for (int i=0 ; i<agisListList.size() ; i++) {
        	if(agisListList.get(i).getAgremYn().equals("Y")) {
        		agisListList.get(i).setAgremYnNm("협약");   		
        	}else {
        		agisListList.get(i).setAgremYnNm("협약 해제");
        	}
        	
        	if(!agisListList.get(i).getAgrmntAtchmnfl().equals("")) {
        		agisListList.get(i).setAgrmntAtchmnflYn("Y");
        	}else {
        		agisListList.get(i).setAgrmntAtchmnflYn("N");
        	}
        	
        	if(agisListList.get(i).getBzn().length() == 10) {
        		String bznNo = agisListList.get(i).getBzn().substring(0,3) + "-" + agisListList.get(i).getBzn().substring(3,5) + "-" + agisListList.get(i).getBzn().substring(5,10);
        		agisListList.get(i).setBznRes(bznNo);
        	}

        }
    	
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminAgisExcelVO.class, agisListList, "협약 벤처 투자기관 ");
        excelFormVO.setHeaderTitle("협약 벤처 투자기관 ");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
    
    /**
     * IBK 벤처대출 추천 접수(VC) 엑셀 다운로드
     * @param searchParams
     * @param response
     * @throws Exception
     */
    public void excelDownloadVC(RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {

    	// 투자사전환 요청 목록 전체 조회
    	searchParams.setPage(null);
    	searchParams.setRecord(null);
    	List<AdminVCmdExcelVO> vnemtrlonReqsList = repo.searchVncmLoanExcelList(searchParams);
    	
    	for (int i=0 ; i<vnemtrlonReqsList.size() ; i++) {
    		vnemtrlonReqsList.get(i).setAgremVnentrSeq(vnemtrlonReqsList.size()-i);
    		String year = String.valueOf(vnemtrlonReqsList.get(i).getRgsnTs()).substring(0,4);
    		String month = String.valueOf(vnemtrlonReqsList.get(i).getRgsnTs()).substring(5,7);
    		String days = String.valueOf(vnemtrlonReqsList.get(i).getRgsnTs()).substring(8,10);
    		String date = year + "-" + month + "-" + days;
    		vnemtrlonReqsList.get(i).setRgsnDt(date);
        	if(vnemtrlonReqsList.get(i).getRcmdEnprBzn().length() == 10) {
        		String bznNo = vnemtrlonReqsList.get(i).getRcmdEnprBzn().substring(0,3) + "-" + vnemtrlonReqsList.get(i).getRcmdEnprBzn().substring(3,5) + "-" + vnemtrlonReqsList.get(i).getRcmdEnprBzn().substring(5,10);
        		vnemtrlonReqsList.get(i).setBznRes(bznNo);
        	}
        	
        }
    	
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminVCmdExcelVO.class, vnemtrlonReqsList, "IBK 벤처대출 접수(VC)");
        excelFormVO.setHeaderTitle("IBK 벤처대출 접수(VC)");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
    
    /**
     * IBK 벤처대출 추천 접수(기업) 엑셀 다운로드
     * @param searchParams
     * @param response
     * @throws Exception
     */
    public void excelDownloadRC(RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {

    	// 투자사전환 요청 목록 전체 조회
    	searchParams.setPage(null);
    	searchParams.setRecord(null);
    	
    	List<AdminRCmdExcelVO> vnemtrlonAplcList = repo.searchVncmLoanAplcExcelList(searchParams);
    	
    	for (int i=0 ; i<vnemtrlonAplcList.size() ; i++) {
    		vnemtrlonAplcList.get(i).setSeq(i+1);
    		
    		String year = String.valueOf(vnemtrlonAplcList.get(i).getRgsnTs()).substring(0,4);
    		String month = String.valueOf(vnemtrlonAplcList.get(i).getRgsnTs()).substring(5,7);
    		String days = String.valueOf(vnemtrlonAplcList.get(i).getRgsnTs()).substring(8,10);
    		String date = year + "-" + month + "-" + days;
    		vnemtrlonAplcList.get(i).setRgsnDt(date);
    		
        	if(vnemtrlonAplcList.get(i).getBzn().length() == 10) {
        		String bznNo = vnemtrlonAplcList.get(i).getBzn().substring(0,3) + "-" + vnemtrlonAplcList.get(i).getBzn().substring(3,5) + "-" + vnemtrlonAplcList.get(i).getBzn().substring(5,10);
        		vnemtrlonAplcList.get(i).setBznRes(bznNo);
        	}
        }
    	
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminRCmdExcelVO.class, vnemtrlonAplcList, "IBK 벤처대출 접수(기업)");
        excelFormVO.setHeaderTitle("IBK 벤처대출 접수(기업)");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

}
