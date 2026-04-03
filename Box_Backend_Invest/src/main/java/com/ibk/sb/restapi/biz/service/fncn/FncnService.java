package com.ibk.sb.restapi.biz.service.fncn;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.fncn.repo.FncnRepo;
import com.ibk.sb.restapi.biz.service.fncn.vo.*;
import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FncnEnlsPsstListVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.PrmrLpChcFildVO;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenDocumentFeign;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FncnService {

    public final FncnRepo fncnRepo;

    private final FundRepo fundRepo;

    private final BoxOpenDocumentFeign documentFeign;

    /**
     * 출자사업 목록 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<FncnBsnsPbanBasicVO> searchFncnPbanList(FncnBsnsEnlsPageVO params) throws Exception  {
        List<FncnBsnsPbanBasicVO> fncnBsnsPbanList = fncnRepo.searchFncnPbanList(params);
        fncnBsnsPbanList = fncnBsnsPbanList == null ? new ArrayList<>() : fncnBsnsPbanList;

        return new PagingVO<>(params, fncnBsnsPbanList);
    }

    /**
     * 출자사업 공고 상세
     * @param id
     * @return
     * @throws Exception
     */
    public FncnBsnsPbanBasicVO detailFncnBsnsPban(String id) throws Exception {

        FncnBsnsPbanBasicVO fncnBsnsPbanBasicVO = fncnRepo.detailFncnBsnsPban(id);
        List<FncnBsnsEnlsFildVO> fncnBsnsEnlsFild = fncnRepo.detailFncnBsnsEnlsFild(id);
        // 첨부된 파일 정보 불러오기
        String[] strFileList = fncnBsnsPbanBasicVO.getFileUnqNo().toString().split(",");
        List<ComFileInfoVO> fileList = new ArrayList<>();

        for(int i=0 ; i<strFileList.length ; i++) {
            ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
            if(fileInfoVO != null) {
                fileList.add(i, fileInfoVO);
            }
        }

        fncnBsnsPbanBasicVO.setFncnBsnsEnlsFild(fncnBsnsEnlsFild);
        fncnBsnsPbanBasicVO.setFileList(fileList);

        return fncnBsnsPbanBasicVO;
    }

    /**
     * 출자사업 접수 등록 및 수정
     * @param fncnBsnsRcipVO
     * @return
     * @throws Exception
     */
    public HashMap<String, Object> insertFncnBsnsRcip(FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception  {
        HashMap<String, Object> result = new HashMap<>();
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 출자사업 목록 카운트
        int fncnId = fncnRepo.countFncnBsnsRcipTotal();

        if(fncnBsnsRcipVO.getFncnBsnsRcipNo().equals("") || fncnBsnsRcipVO.getFncnBsnsRcipNo() == null) {
            LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
            String currentYm = String.valueOf(getDate).replaceAll("-", "");
            // 출자사업 접수번호 세팅
            fncnBsnsRcipVO.setFncnBsnsRcipNo("BFR"+ currentYm.substring(2,6) +String.format("%03d", fncnId));
        }else {
            fncnBsnsRcipVO.setIibsLsmdId(fncnBsnsRcipVO.getIibsFrrgId());
        }
        fncnBsnsRcipVO.setOpcmIncrYmd(fncnBsnsRcipVO.getOpcmIncrYmd().replaceAll("-", ""));
        fncnBsnsRcipVO.setOpcmBzn(fncnBsnsRcipVO.getOpcmBzn().replaceAll("-", ""));
        fncnBsnsRcipVO.setOpcmCnplCon(fncnBsnsRcipVO.getOpcmCnplCon().replaceAll("-", ""));
        fncnBsnsRcipVO.setPbanYmd(fncnBsnsRcipVO.getPbanYmd().replaceAll("-", ""));
        fncnBsnsRcipVO.setIibsFrrgId(user.getUsername());
        fncnBsnsRcipVO.setFncnBsnsEnlsFildUqn(fncnBsnsRcipVO.getFncnBsnsEnlsFildUqn().replace("FBN0",""));

        // 출자사업 기본정보 등록 및 수정
        fncnRepo.insertFncnBsnsRcip(fncnBsnsRcipVO);

        // 공동 gp정보 등록 및 수정
        fncnRepo.deleteFncnBsnsComGpInfo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
        for (int i=0 ; i < fncnBsnsRcipVO.getFncnBsnsJntOpcm().size() ; i++) {
            fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).setFncnBsnsRcipNo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
            fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).setCnplCon(fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getCnplCon().replaceAll("-", ""));
            fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).setOpcmBzn(fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmBzn().replaceAll("-", ""));
            fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).setIibsFrrgId(user.getUsername());
            fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).setRgsnSqn(i+1);

            if(StringUtils.hasLength(fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmNm())) {
                fncnRepo.insertFncnBsnsJntOpcm(fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i));
            }
        }

        fncnRepo.deleteFncnBsnsInvvHmrs(fncnBsnsRcipVO.getFncnBsnsRcipNo());
        // 펀드참여 인력 등록 및 수정
        for (int i=0 ; i< fncnBsnsRcipVO.getFncnBsnsInvvHmrs().size() ; i++) {
            fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).setFncnBsnsRcipNo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
            fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).setOpcmRsprCpn(fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmRsprCpn().replaceAll("-", ""));
            fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).setOpcmCmpnTpn(fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmCmpnTpn().replaceAll("-", ""));
            fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).setIibsFrrgId(user.getUsername());
            fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).setRgsnSqn(i+1);

            if(StringUtils.hasLength(fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmNm())) {
                fncnRepo.insertFncnBsnsInvvHmrs(fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i));
            }
        }

        fncnRepo.deleteFncnBsnsfncnEnls(fncnBsnsRcipVO.getFncnBsnsRcipNo());
        // 출자자모집 등록 및 수정
        for (int i=0 ; i<fncnBsnsRcipVO.getFncnEnls().size() ; i++) {
            fncnBsnsRcipVO.getFncnEnls().get(i).setFncnBsnsRcipNo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
            fncnBsnsRcipVO.getFncnEnls().get(i).setIibsFrrgId(user.getUsername());
            fncnBsnsRcipVO.getFncnEnls().get(i).setRgsnSqn(i+1);

            if(StringUtils.hasLength(fncnBsnsRcipVO.getFncnEnls().get(i).getOpcmNm())) {
                fncnRepo.insertFncnEnls(fncnBsnsRcipVO.getFncnEnls().get(i));
            }
        }

        fncnRepo.deleteFncnBsnsPmglList(fncnBsnsRcipVO.getFncnBsnsRcipNo());
        // 주목적 추가항목 등록 및 수정
        for (int i=0 ; i< fncnBsnsRcipVO.getFncnBsnsPmglItm().size() ; i++) {
            fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).setFncnBsnsRcipNo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
            fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).setIibsFrrgId(user.getUsername());
            fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).setRgsnSqn(i+1);

            if(StringUtils.hasLength(fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).getFncnBsnsPmglCon())) {
                fncnRepo.insertFncnBsnsPmglItm(fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i));
            }
        }

        fncnRepo.deleteFncnBsnsChcPrnl(fncnBsnsRcipVO.getFncnBsnsRcipNo());
        // 선정우대 등록 및 수정
        for (int i=0 ; i < fncnBsnsRcipVO.getFncnBsnsChcPrnl().size() ; i++) {
            fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).setFncnBsnsRcipNo(fncnBsnsRcipVO.getFncnBsnsRcipNo());
            fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).setIibsFrrgId(user.getUsername());
            fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).setRgsnSqn(i+1);

            if(StringUtils.hasLength(fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).getFncnBsnsChcPrnlItmNm())) {
                fncnRepo.insertFncnBsnsChcPrnl(fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i));
            }
        }
        result.put("rcip", fncnBsnsRcipVO);

        return result;
    }

    /**
     * 나의 출자사업 신청 목록 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<FncnBsnsRcipVO> searchFncnBsnsMyList(FncnBsnsEnlsPageVO params) throws Exception  {
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        params.setSearchIibsFrrgId(user.getUsername());
        List<FncnBsnsRcipVO> fncnBsnsMyList = fncnRepo.searchFncnBsnsMyList(params);
        fncnBsnsMyList = fncnBsnsMyList == null ? new ArrayList<>() : fncnBsnsMyList;

        return new PagingVO<>(params, fncnBsnsMyList);
    }

    /**
     * 나의 출자사업 공고 상세
     * @param id
     * @return
     * @throws Exception
     */
    public FncnBsnsRcipVO detailMyFncnBsns(String id) throws Exception {
        // 출자사업 기본정보 조회
        FncnBsnsRcipVO fncnBsnsRcip = fncnRepo.detailMyFncnBsns(id);

        // 공동 GP정보 조회
        List<FncnBsnsJntOpcmVO> fncnBsnsJntOpcm = fncnRepo.detailFncnBsnsJntOpcm(id);
        if(fncnBsnsJntOpcm != null) {
            fncnBsnsRcip.setFncnBsnsJntOpcm(fncnBsnsJntOpcm);
        }
        // 펀드 참여 인력 조회
        List<FncnBsnsInvvHmrsVO> fncnBsnsInvvHmrs = fncnRepo.detailFncnBsnsInvvHmrs(id);
        if(fncnBsnsInvvHmrs != null) {
            fncnBsnsRcip.setFncnBsnsInvvHmrs(fncnBsnsInvvHmrs);
        }
        // 출자자 모집현황
        List<FncnEnlsVO> fncnEnls = fncnRepo.detailFncnEnls(id);
        if(fncnEnls != null) {
            fncnBsnsRcip.setFncnEnls(fncnEnls);
        }
        // 주목적 추가항목 조회
        List<FncnBsnsPmglItmVO> fncnBsnsPmglItm = fncnRepo.detailFncnBsnsPmglItm(id);
        if(fncnBsnsPmglItm != null) {
            fncnBsnsRcip.setFncnBsnsPmglItm(fncnBsnsPmglItm);
        }
        // 선정우대 항목 조회
        List<FncnBsnsChcPrnlVO> fncnBsnsChcPrnl = fncnRepo.detailFncnBsnsChcPrnl(id);
        if(fncnBsnsChcPrnl != null) {
            fncnBsnsRcip.setFncnBsnsChcPrnl(fncnBsnsChcPrnl);
        }

        // 첨부된 파일 정보 불러오기
        String[] strFileList = fncnBsnsRcip.getFileUnqNo().toString().split(",");
        List<ComFileInfoVO> fileList = new ArrayList<>();

        for(int i=0 ; i<strFileList.length ; i++) {
            ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
            if(fileInfoVO != null) {
                fileList.add(i, fileInfoVO);
            }
        }

        fncnBsnsRcip.setFileList(fileList);

        return fncnBsnsRcip;
    }

    /**
     * 출자사업 접수 취소
     * @param fncnBsnsRcipVO
     * @return
     * @throws Exception
     */
    public void fncnBsnsRcipCancel(FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception {
        fncnRepo.fncnBsnsRcipCancel(fncnBsnsRcipVO);
    }

    /**
     * 출자사업 접수 지원분야 항목 조회
     * @param id
     * @return
     * @throws Exception
     */
    public List<FncnBsnsEnlsFildVO> searchEnlsFildList(String id) throws Exception {
        List<FncnBsnsEnlsFildVO> resList = fncnRepo.detailFncnBsnsEnlsFild(id);

        return resList;
    }

    /**
     * 출자사업 접수 OAP 데이터 전송
     * @param fncnBsnsRcipVO
     * @return
     * @throws Exception
     */
    public void fncnBsnsReq(FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception {
        HashMap<String, Object> map = new HashMap<>();

        map.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnBsnsRcipNo());  // 출자사업 접수번호
        map.put("fncnBsnsEnlsFildUqn", fncnBsnsRcipVO.getFncnBsnsEnlsFildUqn());    // 출자사업 모집분야 고유번호
        map.put("fncnBsnsPbanNo", fncnBsnsRcipVO.getFncnBsnsPbanNo());  // 출자사업 공고번호
        map.put("fundAsceTrm", String.valueOf(fncnBsnsRcipVO.getFundAsceTrm()));    // 펀드 존속기간
        map.put("fundNm", fncnBsnsRcipVO.getFundNm());  // 펀드명
        map.put("fundOrgzScdlAmt", String.valueOf(fncnBsnsRcipVO.getFundOrgzScdlAmt()));    // 펀드결성예정금액
        map.put("fncnBsnsCprtDcd", fncnBsnsRcipVO.getFncnBsnsCprtDcd());    // 출자사업조합구분코드
        map.put("fnmnPmntMcd", fncnBsnsRcipVO.getFnmnPmntMcd());    // 출자금 납부방법 코드
        map.put("opcmEad", fncnBsnsRcipVO.getOpcmEad());    // 운용사 이메일 주소
        map.put("opcmCnplCon", fncnBsnsRcipVO.getOpcmCnplCon());    // 운용사 연락처
        map.put("opcmIncrYmd", fncnBsnsRcipVO.getOpcmIncrYmd());    // 운용사 설립년월일
        map.put("opcmBzn", fncnBsnsRcipVO.getOpcmBzn());    // 운용사 사업자등록번호
        map.put("opcmNm", fncnBsnsRcipVO.getOpcmNm());      // 운용사명
        map.put("opcmLicsKcd", fncnBsnsRcipVO.getOpcmLicsKcd());    // 운용사 라이선스 종류코드
        map.put("opcmRpprNm", fncnBsnsRcipVO.getOpcmRpprNm());      // 운용사 대표자명
        map.put("opcmRsprNm",fncnBsnsRcipVO.getOpcmRsprNm());       // 운용사 담당자명
        map.put("otcmRmnrCon", fncnBsnsRcipVO.getOtcmRmnrCon());    // 성과보수
        map.put("rmrkCon", fncnBsnsRcipVO.getRmrkCon());        // 비고내용
        map.put("baseEnrtCon", fncnBsnsRcipVO.getBaseEnrtCon());//기준수익률내용
        map.put("mnrmCon", fncnBsnsRcipVO.getMnrmCon());    // 관리보수 내용
        map.put("jntOpcmYn", fncnBsnsRcipVO.getJntOpcmYn());    // 공동운용사여부
        map.put("ibkFncnRqstAmt", String.valueOf(fncnBsnsRcipVO.getIbkFncnRqstAmt()));// IBK출자 요청금액

        // 선정우대 항목 조회
        List<Object> fncnBsnsChcPrnlList = new ArrayList<>();
        for(int i=0 ; i<fncnBsnsRcipVO.getFncnBsnsChcPrnl().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).getFncnBsnsRcipNo());
            hashMap.put("fncnBsnsChcPrnlItmNm", fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).getFncnBsnsChcPrnlItmNm());
            hashMap.put("fncnBsnsChcPrnlCon", fncnBsnsRcipVO.getFncnBsnsChcPrnl().get(i).getFncnBsnsChcPrnlCon());

            fncnBsnsChcPrnlList.add(i, hashMap);
        }
        map.put("fncnBsnsChcPrnlItmListRowcount", String.valueOf(fncnBsnsChcPrnlList.size()));
        map.put("fncnBsnsChcPrnlItmList", fncnBsnsChcPrnlList);

        // 펀드 참여 인력 조회
        List<Object> fncnBsnsInvvHmrsList = new ArrayList<>();
        for(int i=0 ; i<fncnBsnsRcipVO.getFncnBsnsInvvHmrs().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getFncnBsnsRcipNo());
            hashMap.put("opcmCmpnTpn", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmCmpnTpn());
            hashMap.put("opcmHmrsNm", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmHmrsNm());
            hashMap.put("opcmHmrsDcd", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmHmrsDcd());
            hashMap.put("opcmHmrsCrrNyy", String.valueOf(fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmHmrsCrrNyy()));
            hashMap.put("opcmEad", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmEad());
            hashMap.put("opcmNm", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmNm());
            hashMap.put("opcmRsprCpn", fncnBsnsRcipVO.getFncnBsnsInvvHmrs().get(i).getOpcmRsprCpn());

            fncnBsnsInvvHmrsList.add(i, hashMap);
        }
        map.put("fncnBsnsInvvHmrsListRowcount", String.valueOf(fncnBsnsInvvHmrsList.size()));
        map.put("fncnBsnsInvvHmrsList", fncnBsnsInvvHmrsList);

        // 공동 GP정보 조회
        List<Object> fncnBsnsJntOpcmList = new ArrayList<>();
        for(int i=0 ; i<fncnBsnsRcipVO.getFncnBsnsJntOpcm().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getFncnBsnsRcipNo());
            hashMap.put("emlCon", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getEmlCon());
            hashMap.put("opcmIncrYmd", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmIncrYmd());
            hashMap.put("opcmBzn", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmBzn());
            hashMap.put("opcmNm", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmNm());
            hashMap.put("opcmRpprNm", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmRpprNm());
            hashMap.put("cnplCon", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getCnplCon());
            hashMap.put("opcmRsprNm", fncnBsnsRcipVO.getFncnBsnsJntOpcm().get(i).getOpcmRsprNm());

            fncnBsnsJntOpcmList.add(i, hashMap);
        }
        map.put("fncnBsnsJntOpcmHstListRowcount", String.valueOf(fncnBsnsJntOpcmList.size()));
        map.put("fncnBsnsJntOpcmHstList", fncnBsnsJntOpcmList);

        // 주목적 추가항목 조회
        List<Object> fncnBsnsPmglItmList = new ArrayList<>();
        for(int i=0 ; i<fncnBsnsRcipVO.getFncnBsnsPmglItm().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).getFncnBsnsRcipNo());
            hashMap.put("fncnBsnsPmglCon", fncnBsnsRcipVO.getFncnBsnsPmglItm().get(i).getFncnBsnsPmglCon());

            fncnBsnsPmglItmList.add(i, hashMap);
        }
        map.put("fncnBsnsPmglItmListRowcount", String.valueOf(fncnBsnsPmglItmList.size()));
        map.put("fncnBsnsPmglItmList", fncnBsnsPmglItmList);

        // 출자자 모집현황
        List<Object> fncnEnlsList = new ArrayList<>();
        for(int i=0 ; i<fncnBsnsRcipVO.getFncnEnls().size() ; i++) {
            HashMap<String,Object> hashMap = new HashMap<>();
            hashMap.put("fncnBsnsRcipNo", fncnBsnsRcipVO.getFncnEnls().get(i).getFncnBsnsRcipNo());
            hashMap.put("pgstCon", fncnBsnsRcipVO.getFncnEnls().get(i).getPgstCon());
            hashMap.put("fncnAmt", String.valueOf(fncnBsnsRcipVO.getFncnEnls().get(i).getFncnAmt()));
            hashMap.put("opcmNm", fncnBsnsRcipVO.getFncnEnls().get(i).getOpcmNm());
            hashMap.put("isncInttNm", fncnBsnsRcipVO.getFncnEnls().get(i).getIsncInttNm());

            fncnEnlsList.add(i, hashMap);
        }
        map.put("fnnrEnlsPsstListRowcount", String.valueOf(fncnEnlsList.size()));
        map.put("fnnrEnlsPsstList", fncnEnlsList);

        documentFeign.postFncnBsnsRcipData(map);
    }
}
