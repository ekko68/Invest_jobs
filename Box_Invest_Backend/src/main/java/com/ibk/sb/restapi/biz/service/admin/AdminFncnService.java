package com.ibk.sb.restapi.biz.service.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminFncnRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.*;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.fncn.vo.FncnBsnsJntOpcmVO;
import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenDocumentFeign;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFncnService {

    public final AdminFncnRepo adminFncnRepo;

    private final FundRepo fundRepo;

    private final BoxOpenDocumentFeign documentFeign;

    /**
     * 출자사업 공고 목록 조회
     * @param adminFncnBsnsPageVO
     * @return
     * @throws Exception
     */
    public PagingVO<AdminFncnBsnsPbanBasicVO> searchAdminFncnBsnsPbanList(AdminFncnBsnsPageVO adminFncnBsnsPageVO) throws Exception  {
        // 펀드제안 목록 조회
        List<AdminFncnBsnsPbanBasicVO> fncnBsnsList = adminFncnRepo.searchAdminFncnBsnsPbanList(adminFncnBsnsPageVO);
        fncnBsnsList = fncnBsnsList == null ? new ArrayList<>() : fncnBsnsList;

        return new PagingVO<>(adminFncnBsnsPageVO, fncnBsnsList);
    }

    /**
     * 출자사업 공고 상세 조회
     * @param fncnId
     * @return
     * @throws Exception
     */
    public AdminFncnBsnsPbanBasicVO searchAdminFncnBsnsPbanDetail(String fncnId) throws Exception  {

        AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasic = adminFncnRepo.searchAdminFncnBsnsPbanDetail(fncnId);
        List<AdminFncnBsnsEnlsFildVO> adminFncnBsnsEnlsFild = adminFncnRepo.searchFncnBsnsPbanEnlsFild(fncnId);
        // 첨부된 파일 정보 불러오기
        String[] strFileList = adminFncnBsnsPbanBasic.getFileUnqNo().toString().split(",");
        List<ComFileInfoVO> fileList = new ArrayList<>();

        for(int i=0 ; i<strFileList.length ; i++) {
            ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
            if(fileInfoVO != null) {
                fileList.add(i, fileInfoVO);
            }
        }

        adminFncnBsnsPbanBasic.setAdminFncnBsnsEnlsFild(adminFncnBsnsEnlsFild);
        adminFncnBsnsPbanBasic.setFileList(fileList);

        return adminFncnBsnsPbanBasic;
    }

    /**
     * 출자사업 공고 등록
     * @param adminFncnBsnsPbanBasicVO
     * @return
     * @throws Exception
     */
    public HashMap<String, Object> insertAdminFncnBsnsPban(AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception  {
        // 출자사업 공고목록 카운트
        HashMap<String, Object> result = new HashMap<>();
        String isUpdate = "N";
        int fncnId = adminFncnRepo.countAdminFncnBsnsPbanTotal();
        LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        String currentYm = String.valueOf(getDate).replace("-", "");
        if(adminFncnBsnsPbanBasicVO.getFncnBsnsPbanNo().equals("") || adminFncnBsnsPbanBasicVO.getFncnBsnsPbanNo() == null) {
            // 출자사업 공고번호 세팅
            adminFncnBsnsPbanBasicVO.setFncnBsnsPbanNo("BFP" + currentYm.substring(2,6) +String.format("%03d", fncnId));
        }else {
            adminFncnBsnsPbanBasicVO.setIibsLsmdId(adminFncnBsnsPbanBasicVO.getIibsFrrgId());
            isUpdate = "Y";
        }
        adminFncnBsnsPbanBasicVO.setIsUpdate(isUpdate);

        // 출자사업 공고 등록
        adminFncnRepo.insertAdminFncnBsnsPban(adminFncnBsnsPbanBasicVO);

        // 모집분야 저장 시 모두 삭제 후 재등록
        adminFncnRepo.deleteAdminFncnBsnsEnlsFildList(adminFncnBsnsPbanBasicVO.getFncnBsnsPbanNo());
        // 출자사업 모집분야 데이터 셋팅
        for (int i=0 ; i < adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().size() ; i++) {
            adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).setFncnBsnsPbanNo(adminFncnBsnsPbanBasicVO.getFncnBsnsPbanNo());

            if(StringUtils.hasLength(adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getFncnBsnsEnlsFildUqn())) {
                adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).setIibsFrrgId(adminFncnBsnsPbanBasicVO.getIibsFrrgId());
                adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).setRgsnSqn(i+1);
                adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).setFncnBsnsEnlsFildUqn(
                    adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getFncnBsnsEnlsFildUqn().replace("FBN0",""));
                adminFncnRepo.insertAdminEnlsFild(adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i));
            }
        }
        result.put("pban", adminFncnBsnsPbanBasicVO);
        return result;
    }

    /**
     * 출자사업 공고 목록 엑셀 다운로드
     * @param adminFncnBsnsPageVO
     * @param response
     * @throws Exception
     */
    public void excelDownloadFncnPban(AdminFncnBsnsPageVO adminFncnBsnsPageVO, HttpServletResponse response) throws Exception {

        adminFncnBsnsPageVO.setPage(null);
        adminFncnBsnsPageVO.setRecord(null);

        List<AdminFncnPbanExcelVO> fncnExcelList = adminFncnRepo.excelDownloadFncnPban(adminFncnBsnsPageVO);

        for (int i=0 ; i<fncnExcelList.size() ; i++) {
            fncnExcelList.get(i).setSeq(fncnExcelList.size()-i);

            if(fncnExcelList.get(i).getFncnBsnsPbanDcd().equals("01")) {
                fncnExcelList.get(i).setFncnBsnsPbanDcd("선정공고");
            }else if(fncnExcelList.get(i).getFncnBsnsPbanDcd().equals("02")) {
                fncnExcelList.get(i).setFncnBsnsPbanDcd("접수현황");
            }else if(fncnExcelList.get(i).getFncnBsnsPbanDcd().equals("03")) {
                fncnExcelList.get(i).setFncnBsnsPbanDcd("선정결과");
            }
            fncnExcelList.get(i).setRspbEmn(fncnExcelList.get(i).getRgsrNm());
        }

        ExcelFormVO excelFormVO = new ExcelFormVO(AdminFncnPbanExcelVO.class, fncnExcelList, "출자사업 공고");
        excelFormVO.setHeaderTitle("출자사업 공고");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

    /**
     * 출자사업 공고 상태 변경
     * @param adminFncnBsnsPbanBasicVO
     * @throws Exception
     */
    public void updateAdminFncnBsnsPbanState(AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception {
        adminFncnRepo.updateAdminFncnBsnsPbanState(adminFncnBsnsPbanBasicVO);
    }

    /**
     * 출자사업 공고 OAP등록 데이터 전송
     * @param adminFncnBsnsPbanBasicVO
     * @throws Exception
     */
    public void adminFncnBsnsPbanReq(AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception {
        HashMap<String, Object> map = new HashMap<>();

        map.put("fncnBsnsPbanNo", adminFncnBsnsPbanBasicVO.getFncnBsnsPbanNo());    // 출자사업 공고번호
        map.put("fncnBsnsPbanTtlNm", adminFncnBsnsPbanBasicVO.getFncnBsnsPbanTtlNm());  // 출자사업 공고제목명
        map.put("fncnBsnsNm", adminFncnBsnsPbanBasicVO.getFncnBsnsNm());    // 출자사업명
        map.put("fncnBsnsPbanDcd", adminFncnBsnsPbanBasicVO.getFncnBsnsPbanDcd());  // 출자사업공고구분코드
        map.put("prdoRccgYmd", adminFncnBsnsPbanBasicVO.getPrdoRccgYmd());  // 제안서 접수마감년월일
        map.put("pbanYmd", adminFncnBsnsPbanBasicVO.getPbanYmd());  // 공고년월일
        map.put("rprsCnplCon", adminFncnBsnsPbanBasicVO.getRprsCnplCon().replaceAll("-", ""));  // 대표연락처내용
        map.put("pbanDtlCon", adminFncnBsnsPbanBasicVO.getPbanDtlCon());    // 공고상세내용

        // 지원분야 조회
        List<Object> adminFncnBsnsEnlsFildList = new ArrayList<>();
        for(int i=0 ; i<adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsPbanNo", adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getFncnBsnsPbanNo());
            hashMap.put("fncnBsnsEnlsFildUqn", adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getFncnBsnsEnlsFildUqn());
            hashMap.put("fncnBsnsChcOpcmCnt", adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getFncnBsnsChcOpcmCnt());
            hashMap.put("orcyFncnAmt", String.valueOf(adminFncnBsnsPbanBasicVO.getAdminFncnBsnsEnlsFild().get(i).getOrcyFncnAmt()));

            adminFncnBsnsEnlsFildList.add(i, hashMap);
        }
        map.put("fncnBsnsSprnFildListRowcount", String.valueOf(adminFncnBsnsEnlsFildList.size()));
        map.put("fncnBsnsSprnFildList", adminFncnBsnsEnlsFildList);

        documentFeign.postFncnBsnsPbanData(map);
    }

    // 공고
    //----------------------------------------------------------------------------------
    // 접수

    /**
     * 출자사업 접수 목록 조회
     * @param adminFncnBsnsPageVO
     * @return
     * @throws Exception
     */
    public PagingVO<AdminFncnBsnsRcipVO> searchAdminFncnBsnsRcipList(AdminFncnBsnsPageVO adminFncnBsnsPageVO) throws Exception  {
        // 출자사업 접수 목록 조회
        List<AdminFncnBsnsRcipVO> fncnBsnsRcipList = adminFncnRepo.searchAdminFncnBsnsRcipList(adminFncnBsnsPageVO);
        fncnBsnsRcipList = fncnBsnsRcipList == null ? new ArrayList<>() : fncnBsnsRcipList;

        return new PagingVO<>(adminFncnBsnsPageVO, fncnBsnsRcipList);
    }

    /**
     * 출자사업 접수 상세 조회
     * @param fncnId
     * @return
     * @throws Exception
     */
    public AdminFncnBsnsRcipVO searchAdminFncnBsnsRcipDetail(String fncnId) throws Exception  {
        // 출자사업 접수 기본 항목 조회
        AdminFncnBsnsRcipVO adminFncnBsnsRcipBasic = adminFncnRepo.searchAdminFncnBsnsRcipDetail(fncnId);

        // 공동 GP정보 조회

        List<AdminFncnBsnsJntOpcmVO> adminFncnBsnsJntOpcm = adminFncnRepo.searchAdminFncnBsnsJntOpcmDetail(fncnId);
        adminFncnBsnsRcipBasic.setAdminFncnBsnsJntOpcm(adminFncnBsnsJntOpcm);

        // 펀드참여인력 조회
        List<AdminFncnBsnsInvvVO> adminFncnBsnsInvv = adminFncnRepo.searchAdminFncnBsnsInvvDetail(fncnId);
        adminFncnBsnsRcipBasic.setAdminFncnBsnsInvv(adminFncnBsnsInvv);
        // 출자자 모집현황 조회
        List<AdminFncnBsnsEnlsVO> adminFncnBsnsEnls = adminFncnRepo.searchAdminFncnBsnsEnlsDetail(fncnId);
        adminFncnBsnsRcipBasic.setAdminFncnBsnsEnls(adminFncnBsnsEnls);
        // 주목적 추가항목 조회
        List<AdminFncnBsnsPmglVO> adminFncnBsnsPmgl = adminFncnRepo.searchAdminFncnBsnsPmglDetail(fncnId);
        adminFncnBsnsRcipBasic.setAdminFncnBsnsPmgl(adminFncnBsnsPmgl);
        // 선정우대 항목 조회
        List<AdminFncnBsnsChcPrnlVO> adminFncnBsnsChcPrnl = adminFncnRepo.searchAdminFncnBsnsChcPrnlDetail(fncnId);
        adminFncnBsnsRcipBasic.setAdminFncnBsnsChcPrnl(adminFncnBsnsChcPrnl);

        // 첨부된 파일 정보 불러오기
        String[] strFileList = adminFncnBsnsRcipBasic.getFileUnqNo().toString().split(",");
        List<ComFileInfoVO> fileList = new ArrayList<>();

        for(int i=0 ; i<strFileList.length ; i++) {
            ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
            if(fileInfoVO != null) {
                fileList.add(i, fileInfoVO);
            }
        }
        adminFncnBsnsRcipBasic.setFileList(fileList);

        return adminFncnBsnsRcipBasic;
    }

    /**
     * 출자사업 접수 목록 엑셀 다운로드
     * @param adminFncnBsnsPageVO
     * @param response
     * @throws Exception
     */
    public void excelDownloadFncnRcip(AdminFncnBsnsPageVO adminFncnBsnsPageVO, HttpServletResponse response) throws Exception {

        adminFncnBsnsPageVO.setPage(null);
        adminFncnBsnsPageVO.setRecord(null);

        List<AdminFncnRcipExcelVO> fncnExcelList = adminFncnRepo.excelDownloadFncnRcip(adminFncnBsnsPageVO);

        for (int i=0 ; i<fncnExcelList.size() ; i++) {
            fncnExcelList.get(i).setSeq(fncnExcelList.size()-i);

            if(fncnExcelList.get(i).getFncnBsnsPgrsScd().equals("2")) {
                fncnExcelList.get(i).setFncnBsnsPgrsScd("접수완료");
            }else if(fncnExcelList.get(i).getFncnBsnsPgrsScd().equals("3")) {
                fncnExcelList.get(i).setFncnBsnsPgrsScd("접수취소");
            }else if(fncnExcelList.get(i).getFncnBsnsPgrsScd().equals("4")) {
                fncnExcelList.get(i).setFncnBsnsPgrsScd("심사중");
            }else if(fncnExcelList.get(i).getFncnBsnsPgrsScd().equals("5")) {
                fncnExcelList.get(i).setFncnBsnsPgrsScd("심사완료");
            }
        }

        ExcelFormVO excelFormVO = new ExcelFormVO(AdminFncnRcipExcelVO.class, fncnExcelList, "출자사업 접수");
        excelFormVO.setHeaderTitle("출자사업 접수");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

    /**
     * 출자사업 접수 상태 변경
     * @param adminFncnBsnsRcipVO
     * @throws Exception
     */
    public void updateAdminFncnBsnsRcipState(AdminFncnBsnsRcipVO adminFncnBsnsRcipVO) throws Exception {
        adminFncnRepo.updateAdminFncnBsnsRcipState(adminFncnBsnsRcipVO);
    }

    /**
     * 출자사업 모집분야 항목 조회
     * @throws Exception
     */
    public List<ComCodeVO> searchAdminFncnBsnsEnlsFildList() throws Exception {
        String grpId = "FBN00";
        List<ComCodeVO> resList = adminFncnRepo.searchAdminFncnBsnsEnlsFildList(grpId);

        return resList;
    }

    /**
     * 출자사업 모집분야 항목 등록 및 수정
     * @param comCodeVO
     * @throws Exception
     */
    public void saveAdminFncnBsnsEnlsFild(List<ComCodeVO> comCodeVO) throws Exception {
        for(int i=0 ; i<comCodeVO.size() ; i++) {
            int countNum = adminFncnRepo.countAdminFncnBsnsEnlsFildTotal("FBN00");
            if(comCodeVO.get(i).getComCdId().equals("") && !comCodeVO.get(i).getComCdNm().equals("")) {
                comCodeVO.get(i).setComCdId("FBN" + String.format("%05d", countNum));
                comCodeVO.get(i).setLnpSqn(String.valueOf(countNum));
                comCodeVO.get(i).setGrpCdId("FBN00");
                comCodeVO.get(i).setComCdDesc("모집분야코드");
                comCodeVO.get(i).setUseYn("Y");

                adminFncnRepo.saveAdminFncnBsnsEnlsFild(comCodeVO.get(i));
            }
        }
    }

    /**
     * 출자사업 모집분야 항목 삭제
     * @throws Exception
     */
    public void deleteAdminFncnBsnsEnlsFild(ComCodeVO comCodeVO) throws Exception {
        adminFncnRepo.deleteAdminFncnBsnsEnlsFild(comCodeVO);
    }

}
