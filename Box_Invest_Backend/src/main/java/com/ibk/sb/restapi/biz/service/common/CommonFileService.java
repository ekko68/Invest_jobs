package com.ibk.sb.restapi.biz.service.common;

import com.ibk.sb.restapi.app.common.constant.FileWhiteList;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.biz.service.common.repo.CommonFileRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.common.vo.RequestBinaryFileSaveVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CommonFileService {

    private final FileUtil fileUtil;
    private final CommonFileRepo commonFileRepo;

    /**
     * 파일 업로드 Service
     * @param file
     * @return 파일 ID
     * @throws Exception
     */
    public ComFileInfoVO uploadFile(MultipartFile file, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        ComFileInfoVO fileInfoVO = fileUtil.saveFile(file, isNdaYnEnum);

        saveFile(fileInfoVO, null);

        if(fileInfoVO.getFilePtrn().startsWith("image")) {
            fileInfoVO.setImgUrl(fileUtil.setImageUrl(fileInfoVO.getFileId()));
        }

        return fileInfoVO;
    }

    public ComFileInfoVO uploadBinaryFile(RequestBinaryFileSaveVO saveFileInfo, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        ComFileInfoVO fileInfoVO = fileUtil.saveBinaryFile(saveFileInfo, isNdaYnEnum);

        saveFile(fileInfoVO, null);

        if(fileInfoVO.getFilePtrn().startsWith("image")) {
            fileInfoVO.setImgUrl(fileUtil.setImageUrl(fileInfoVO.getFileId()));
        }

        return fileInfoVO;
    }

    /**
     * 파일 다운로드 Service
     * @param fileId
     * @throws Exception
     */
    public void downloadFile(String fileId, HttpServletResponse response, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        // response 버퍼에 남아있는 데이터 삭제
        response.reset();

        // 파일 정보 조회
        ComFileInfoVO fileInfoVO = commonFileRepo.selectFileInfo(fileId);

        // 파일아이디 유효성 검증
        if(fileInfoVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // TODO : 권한 체크 추후 마저 세팅하기

        // 파일 스트림 다운로드
        fileStreamDownload(fileInfoVO, response, isNdaYnEnum);
    }

    /**
     * 파일 이미지 태그 스트림 전송
     * @param fileId
     * @param response
     * @throws Exception
     */
    public void downloadImageFile(String fileId, HttpServletResponse response) throws Exception {

        // response 버퍼에 남아있는 데이터 삭제
        response.reset();

        // 파일 정보 조회
        ComFileInfoVO fileInfoVO = commonFileRepo.selectFileInfo(fileId);

        if(fileInfoVO == null) {
            response.getOutputStream().close();
        }

        if(!FileWhiteList.IMAGE.mimeContains(fileInfoVO.getFilePtrn())) {
            response.getOutputStream().close();
        }

        // 파일 스트림 다운로드
        fileStreamDownload(fileInfoVO, response, IvtCode.YnTypeEnum.N);
    }

    /**
     * 파일 스트림 다운로드
     * @param fileInfoVO
     * @param response
     * @throws Exception
     */
    public void fileStreamDownload(ComFileInfoVO fileInfoVO, HttpServletResponse response, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {
        // 파일정보 헤더 세팅
        response.setHeader("Content-Type", fileInfoVO.getFilePtrn());
        response.setHeader("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(fileInfoVO.getFileNm(), "UTF-8") + "\"");
        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");

        // 파일 다운로드 CORS 처리를 위한 헤더 세팅
        response.setHeader("Access-Control-Allow-Origin", "*");

        // 파일 스트림 다운로드
        try (OutputStream outputStream = response.getOutputStream()) {
            fileUtil.fileDownload(fileInfoVO, outputStream, isNdaYnEnum);
        }
    }

    /**
     * 바이너리 파일 다운로드
     * @param binaryStr
     * @param fileName
     * @param mime
     * @param response
     * @throws Exception
     */
    public void binaryStrFileDownload(String binaryStr, String fileName, String mime, HttpServletResponse response) throws Exception {
        // set response header
        response.setContentType(mime);
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=\"" + new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1) + "\"");

        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");

        // 파일 다운로드 CORS 처리를 위한 헤더 세팅
        response.setHeader("Access-Control-Allow-Origin", "*");

        // 파일 스트림 다운로드
        try (OutputStream outputStream = response.getOutputStream()) {
            fileUtil.binaryFileDownload(binaryStr, outputStream);
        }
    }

    /**
     * PDF Hex 변환 및 파일 다운로드
     * @param pdfHexStr
     * @param fileName
     * @param response
     * @throws Exception
     */
    public void pdfHexStrFileDownload(String pdfHexStr, String fileName, HttpServletResponse response) throws Exception {
        // set response header
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=\"" + new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1) + "\"");

        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");

        // 파일 다운로드 CORS 처리를 위한 헤더 세팅
        response.setHeader("Access-Control-Allow-Origin", "*");

        // pdf 변환 및 파일 다운로드
        try (OutputStream outputStream = response.getOutputStream()) {
            fileUtil.pdfHexStrDownload(pdfHexStr, outputStream);
        }
    }
    /**
     * 이미지 Base64 변환
     * @param fileId
     * @return
     * @throws Exception
     */
    public String getImageBase64(String fileId, boolean typeAttachFlg) throws Exception {
        
        // 파일 정보 조회
        ComFileInfoVO fileInfoVO = commonFileRepo.selectFileInfo(fileId);
        
        if(fileInfoVO == null) {
            return null;
        }
        
        return fileUtil.imageFileEncodeBase64(fileInfoVO, typeAttachFlg);
    }

    /**
     * 파일 정보 조회
     */
    public ComFileInfoVO searchFile(String fileId) throws Exception {

        if(!StringUtils.hasLength(fileId)) {
            throw new BizException(StatusCode.COM0005);
        }

        ComFileInfoVO fileInfoVO = commonFileRepo.selectFileInfo(fileId);

        if(fileInfoVO.getFilePtrn().startsWith("image")) {
            fileInfoVO.setImgUrl(fileUtil.setImageUrl(fileInfoVO.getFileId()));
        }

        return fileInfoVO;
    }

    /**
     * 파일 정보 DB 저장
     * @param fileInfoVO
     * @throws Exception
     */
    public void saveFile(ComFileInfoVO fileInfoVO, String adminUsername) throws Exception {
        if( SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CustomUser
            && !StringUtils.hasLength(adminUsername)
        ) {
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            fileInfoVO.setRgsnUserId(user.getUsername());
            fileInfoVO.setAmnnUserId(user.getUsername());
        } else if (StringUtils.hasLength(adminUsername)) {
            fileInfoVO.setRgsnUserId(adminUsername);
            fileInfoVO.setAmnnUserId(adminUsername);
        }

        commonFileRepo.insertFileInfo(fileInfoVO);
    }

    /**
     * 파일 논리 삭제
     */
    public Integer deleteFile(String fileId, String adminUsername) throws Exception {

        if(!StringUtils.hasLength(fileId)) throw new BizException(StatusCode.COM0005);
        String userId;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof  CustomUser) {
            CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userId = user.getUsername();
        } else if(StringUtils.hasLength(adminUsername)) {
            userId = adminUsername;
        } else {
            throw new BizException(StatusCode.COM0005);
        }

        return commonFileRepo.deleteFileInfo(fileId, userId);
    }

    /**
     * 파일 물리 삭제 + 파일 레코드 물리 삭제
     */
    public Integer deleteFilePhysical(String fileId, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {
        // 파일 정보 조회
        ComFileInfoVO fileInfoVO = commonFileRepo.selectFileInfo(fileId);
        if(StringUtils.hasLength(fileInfoVO.getFilePath())) {
            // 파일 아이디 디렉터리 + 파일 삭제
            if(fileUtil.deleteFileIdDir(fileInfoVO, isNdaYnEnum)) {
                return commonFileRepo.deleteFilePhysical(fileId);
            }
        }

        return 0;
    }
}