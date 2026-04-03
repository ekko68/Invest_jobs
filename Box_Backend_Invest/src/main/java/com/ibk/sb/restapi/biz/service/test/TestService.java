package com.ibk.sb.restapi.biz.service.test;

import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminQnaRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.test.repo.TestRepo;
import com.ibk.sb.restapi.biz.service.test.vo.RequestTestPagingVO;
import com.ibk.sb.restapi.biz.service.test.vo.TestConnectDualVO;
import com.ibk.sb.restapi.biz.service.test.vo.TestDataVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.test.vo.TestExcelVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepo testRepo;
    private final AdminQnaRepo qnaRepo;

//    @SkipCheckTxAspect
//    public void testTxTop() throws Exception {
//
//        // Tx1
//        this.testTransaction();
//
//        QnaVO testQna = new QnaVO();
//        testQna.setPgstCd(ComCode.QA_CANCEL.getCode());
//        testQna.setInqrDsncCd(ComCode.QA_CANCEL.getCode());
//
//        // Tx2
////        try {
////            apiTestService.testTransactionPropagation(1, testQna);
////        } catch (Exception e) {
////            log.error(e.getMessage());
////        }
//
//        for(int i = 0; i < 5; i++) {
//            apiTestService.testTransactionPropagation(i, testQna);
////            try {
////                apiTestService.testTransactionPropagation(i, testQna);
//////                testTransactionPropagation(i, testQna);
////            } catch (Exception ex) {
////                log.error(ex.getMessage());
////            }
//        }
//    }
//
////    @SkipCheckTxAspect
////    @Transactional(rollbackFor = {Exception.class})
//    public void testTransaction() throws Exception {
//        QnaVO testQna = new QnaVO();
//        testQna.setInqrSbjcId(UUID.randomUUID().toString());
//        testQna.setPgstCd(ComCode.QA_CANCEL.getCode());
//        testQna.setInqrDsncCd(ComCode.QA_CANCEL.getCode());
//
//        testQna.setInqrSbjcTtl("트랜잭션 테스트 REQUIRES");
//
//        qnaRepo.insertQna(testQna);
//
////        for(int i = 0; i < 5; i++) {
////            try {
////                apiTestService.testTransactionPropagation(i, testQna);
//////                testTransactionPropagation(i, testQna);
////            } catch (Exception ex) {
////                log.error(ex.getMessage());
////            }
////        }
//    }

//    @SkipCheckTxAspect
////    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {Exception.class})
//    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public void testTransactionPropagation(int idx, QnaVO testVO) throws Exception  {
//        try {
//            testVO.setInqrSbjcId(UUID.randomUUID().toString());
//            testVO.setInqrSbjcTtl("트랜잭션 테스트 REQUIRES_NEW : " + idx + "(idx)");
//            qnaRepo.insertQna(testVO);
//            if(idx % 2 == 0) {
//                throw new Exception("Test Tx");
//            }
//        } catch (Exception ex) {
//            log.error(ex.getMessage());
//        }

        testVO.setInqrSbjcId(UUID.randomUUID().toString());
        testVO.setInqrSbjcTtl("트랜잭션 테스트 REQUIRES_NEW : " + idx + "(idx)");
        qnaRepo.insertQna(testVO);
//        if(idx % 2 == 0) {
            throw new Exception("Test Tx");
//        }
    }

    /**
     * DB 접속 테스트
     * @return
     * @throws Exception
     */
    public TestConnectDualVO testConnectDual() throws Exception {
        return testRepo.testConnectDual();
    }

    /**
     * 페이징 테스트
     * @param requestTestPagingVO
     * @return
     * @throws Exception
     */
    public PagingVO<TestDataVO> testPaging(RequestTestPagingVO requestTestPagingVO) throws Exception {
        List<TestDataVO> testDataList = testRepo.testPaging(requestTestPagingVO);

        PagingVO<TestDataVO> testPaging = new PagingVO<>(requestTestPagingVO, testDataList, testDataList.get(0).getTotalCnt());

        return testPaging;
    }

    public CustomUser testCustomUserMapping() throws Exception {
        CustomUser customUser = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return customUser;
    }

    /**
     * 파일 업로드 테스트
     * @param multipartFile
     * @return
     * @throws Exception
     */
//    public FileInfoVO testFileUpload(MultipartFile multipartFile) throws Exception {
//
//        FileInfoVO fileInfoVO = fileUtil.saveFile(multipartFile, "IMG");
//
//        return fileInfoVO;
//    }

    /**
     * 파일 다운로드 테스트
     * @throws Exception
     */
//    public void testFileDownload(String date, String fileId, String fileName, String fileMime, HttpServletResponse response) throws Exception {
//
//        // response 버퍼에 남아있는 데이터 삭제
//        response.reset();
//
//        // DB 입력이 안된 정보이므로 파라미터로 저장소 경로 세팅
//        String filePath = date + File.separator + fileId + File.separator + fileName;
//
//        // 파일정보 헤더 세팅
//        response.setHeader("Content-Type", fileMime);
//        response.setHeader("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
//        response.setHeader("Content-Transfer-Encoding", "binary");
//        response.setHeader("Pragma", "no-cache;");
//        response.setHeader("Expires", "-1;");
//
//        // 파일 스트림 다운로드
//        fileUtil.fileDownload(filePath, response.getOutputStream());
//        response.getOutputStream().close();
//    }

    public void testExcelDownload(HttpServletResponse response) throws Exception {

        response.reset();

        TestExcelVO person1 = TestExcelVO.builder().name("홍길동1").age(Double.parseDouble("29")).jbcl("기획자").build();
        TestExcelVO person2 = TestExcelVO.builder().name("홍길동2").age(Double.parseDouble("30")).jbcl("개발자").build();
        TestExcelVO person3 = TestExcelVO.builder().name("홍길동3").age(Double.parseDouble("31")).jbcl("테스터").build();

        List<TestExcelVO> list = new ArrayList<>();
        list.add(person1);
        list.add(person2);
        list.add(person3);

//        ExcelFormVO formVO = new ExcelFormVO("테스트", list);
//
//        fileService.excelFileDownload(formVO, null, response);
    }


}
