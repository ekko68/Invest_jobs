package com.ibk.sb.restapi.app.common.util;

import com.ibk.sb.restapi.app.annotation.PropertyComponent;
import com.ibk.sb.restapi.app.common.constant.FileWhiteList;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.common.vo.RequestBinaryFileSaveVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@PropertyComponent // 경로 정보를 properties에서 profile 별로 가져오기 위해 bean으로 처리함
public class FileUtil {

    // upload path가 실질 3케이스 정도 밖에 안되므로 configuration properties 보다는 생성자에 @value로 처리를 함
    public FileUtil(@Value("${com.ibk.api.upload.img.path:}") String imgPath,
                    @Value("${com.ibk.api.upload.doc.path:}") String docPath,
                    @Value("${com.ibk.api.upload.nda.path:}") String ndaPath,
                    @Value("${com.ibk.content.img.path.ivt-v1}") String imgContentPathIvt,
                    @Value("${com.ibk.content.img.path.mnb-v1}") String imgContentPathMnb) {

        // properties file upload path는 final로 두고 초기화 시점에 unix 체크를 한다.
        boolean isUnix = File.separator.equals("/");

        // file upload path 초기화
        this.imgUploadPath = isUnix ? imgPath.replace("\\", File.separator) : imgPath.replace("/", File.separator);
        this.docUploadPath = isUnix ? docPath.replace("\\", File.separator) : docPath.replace("/", File.separator);
        this.ndaUploadPath = isUnix ? ndaPath.replace("\\", File.separator) : ndaPath.replace("/", File.separator);

        // path manipulation 대응을 위해 사용된 whitelist를 생성자에서 final 변수에 unmodifiableList 초기화한다
        // isUnix 체크는 미리 처리해놓는다.
        this.fileSaveWhiteList = Collections.unmodifiableList(Arrays.asList(
                this.imgUploadPath, this.docUploadPath, this.ndaUploadPath
        ));

        log.info("imgPath : {}", this.imgUploadPath);
        log.info("docPath : {}", this.docUploadPath);
        log.info("ndaPath : {}", this.ndaUploadPath);

        // img content path 변수 설정
        this.imgContentPathIvt = imgContentPathIvt;
        this.imgContentPathMnb = imgContentPathMnb;
    }

    //    private final String tmpUploadPath;
    private final String imgUploadPath;
    private final String docUploadPath;
    private final String ndaUploadPath;

    private final List<String> fileSaveWhiteList;

    private final String imgContentPathIvt;
    private final String imgContentPathMnb;


    // 이미지 경로 설정
    public String setImageUrl(String imgFileId) throws Exception {
        return StringUtils.isNotBlank(imgFileId) ? imgContentPathIvt + imgFileId : "";
    }

    // 리스트 이미지 경로 설정
    public List setImageUrlList(List<? extends BaseTableVO> list) throws Exception {

        list = list == null ? new ArrayList<>() : list;
        list.forEach(x -> {
            x.setImgUrl(StringUtils.isNotBlank(x.getImgFileId())
                    ? imgContentPathIvt + x.getImgFileId()
                    : "");
        });

        return list;
    }

    // 메인 박스 기업 로고 이미지 경로 설정
    public String setMainboxLogoUrl(String logoFileId) throws Exception {
        // MNB의 파일 로고는 디폴트가 ' '임
        // -> null이 뜨는 경우가 생기므로 hasLength 체크 후 trim처리
        return StringUtils.isNotBlank(logoFileId) ? imgContentPathMnb + logoFileId : "";
    }

    /**
     * 파일 경로 whitelist 점검 <br/>
     *
     * 시큐어코딩 file manipulation 대응 <br/>
     * 프로세스상 properties의 지정된 이외 경로로 접근할 경우는 없지만, <br/>
     * 보안 프로세스상 협의된 메뉴얼 기준으로 추가 확인 프로세스를 추가함
     *
     * @caution apache common 라이브러리 FilenameUtils.normalizeNoEndSeparator 유틸 사용
     * @caution 잘못된 path값을 입력할 경우 null로 반환, null 체크로 throw 처리를 할지 등 호출 서비스에서 판단.
     * @caution 검증 화이트리스트 기준은 프로퍼티의 upload 경로를 기준으로 startwith 비교를 함
     *
     * @return
     * @throws Exception
     */
    public String normalizeFilePathAndWhiteListCheck(String fileFullPath) throws Exception {

        // fileFullPath 값이 비어있는 경우 null 반환
        if(StringUtils.isBlank(fileFullPath)) return null;

        // unix system check 및 신규 변수에 할당
        boolean isUnix = File.separator.equals("/");
        String checkPath = isUnix ? fileFullPath.replace("\\", File.separator) : fileFullPath.replace("/", File.separator);

        // 파일 경로 normalize 처리
        String normalized = FilenameUtils.normalizeNoEndSeparator(checkPath, isUnix);
        // normalize 결과가 null이거나 기존 path와 달라진 경우 null 반환
        if(normalized == null || !normalized.equals(checkPath)) return null;

        // fileWhitelist로 시작되는 파일경로인지 확인 후 그 외의 경로로 잡힐 경우 null 반환
        if(fileSaveWhiteList.stream().anyMatch(normalized::startsWith)) return normalized;
        else return null;
    }

    /**
     * 파일 경로 합성
     * 양쪽 경로 사이에 구분자의 유무에 따른 File Separator 설정 처리 후 문자열 합성
     * 만약 양쪽 모두 구분자가 사이에 있는 경우 한쪽의 separator을 제외하여 처리한다.
     *
     * @param pre
     * @param suf
     * @return
     * @throws Exception
     */
    public String combineFilePath(String pre, String suf) throws Exception {
        boolean isPreEndWithSeparator = (pre.endsWith("/") || pre.endsWith("\\"));
        boolean isSufStartWithSeparator = (suf.startsWith("/") || suf.startsWith("\\"));

        // 양쪽 사이에 모두 구분자가 있을 경우, 한쪽의 구분자를 없애고 처리
        if(isPreEndWithSeparator && isSufStartWithSeparator) return pre.substring(0, pre.length() - 1) + suf;
        // 양쪽 사이에 모두 구분자가 없는 경우, 구분자 추가
        if(!isPreEndWithSeparator && !isSufStartWithSeparator) return pre + File.separator + suf;
        // 그 외 (어느 한쪽 중 구분자가 있음)
        return pre + suf;
    }

//    /**
//     * 임시 파일 저장 및 경로 반환
//     * @param multipartFile
//     * @return 임시 저장 파일 경로
//     * @throws Exception
//     */
//    public String saveTempFile(MultipartFile multipartFile) throws Exception {
//
//        // 파일명 설정
//        String originalFileName = multipartFile.getOriginalFilename();
//        String fileName = originalFileName.substring(originalFileName.lastIndexOf("\\") + 1); // IE, Edge 브라우저 환경에서는 전체 경로가 들어옴
//
//        String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
//
//        fileName = fileName.substring(0, fileName.lastIndexOf("."));
//        fileName = fileName.replace("/", "")
//                .replace("\\\\", "")
//                .replace(".", "")
//                .replace("&", "");
//
//        fileName = fileName + "." + fileExt;
//
//        // 폴더 경로 설정
//        String tmpFolderId = UUID.randomUUID().toString();
//
//        // 임시 폴더 생성
//        File tmpUploadPathFolder = new File(tmpUploadPath, tmpFolderId);
//        if(!tmpUploadPathFolder.exists()) tmpUploadPathFolder.mkdirs();
//
//        // 임시 파일 생성 및 경로 리턴
//        String tmpFullPath = tmpUploadPath + File.separator +  tmpFolderId + File.separator + fileName;
//        multipartFile.transferTo(Paths.get(tmpFullPath));
//
//        return tmpFullPath;
//    }
//
//    /**
//     * 임시 파일 디렉터리 삭제
//     * 임시 생성한 아이디 폴더와 파일을 삭제하므로
//     * 현재 로직상 재귀 검색 삭제처리 제외
//     * @param tmpUploadPath
//     * @throws Exception
//     */
//    public void deleteTempFolder(String tmpUploadPath) throws Exception {
//        // 폴더 추출
//        String tmpFolderPath = tmpUploadPath.substring(0, tmpUploadPath.lastIndexOf(File.separator));
//        File deleteFolder = new File(tmpFolderPath);
//
//        // 파일 리스트 조회
//        File[] fileList = deleteFolder.listFiles();
//
//        // 파일 리스트 삭제
//        if(fileList != null) {
//            for(File file : fileList) file.delete();
//        }
//
//        // 폴더 삭제
//        deleteFolder.delete();
//    }

    /**
     * 파일 저장
     * TODO : 확인사항 - 파일 확장자 화이트리스트 유무, 파일용량제한 유무,
     * -> 우선 파일 저장 확인을 위해 multipart 만을 받도록 세팅
     *
     * @return
     * @throws Exception
     */
    public ComFileInfoVO saveFile(MultipartFile multipartFile, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        ComFileInfoVO fileInfoVO;

        // 파일정보 추출
        String originalFileName = multipartFile.getOriginalFilename();
        String fileName = originalFileName.substring(originalFileName.lastIndexOf("\\") + 1); // IE, Edge 브라우저 환경에서는 전체 경로가 들어옴

        // 확장자 | mime type
        String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
        String mime = multipartFile.getContentType();

        // 파일 헤더정보 파일명에 시큐어 코딩 점검 관련 경로조작 값 체크
        fileName = fileName.substring(0, fileName.lastIndexOf("."));
        fileName = fileName.replace("/", "")
                .replace("\\\\", "")
                .replace(".", "")
                .replace("&", "");

        fileName = fileName + "." + fileExt;

        String path;

        /** 확장자 화이트리스트 체크 **/
        // NDA + pdf 확장자일 경우
        if (isNdaYnEnum == IvtCode.YnTypeEnum.Y) {
            if (!mime.equals("application/pdf") || !fileExt.equals("pdf")) throw new BizException(StatusCode.MNB0002);
            path = ndaUploadPath;
        }
        // 이미지 파일 체크
        else if (mime.startsWith("image")
                && FileWhiteList.IMAGE.mimeContains(mime)
                && FileWhiteList.IMAGE.extensionContains(fileExt)
        ) {
            path = imgUploadPath;
        }

        // DOC 파일 체크
        else if (FileWhiteList.DOC.mimeContains(mime)
                && FileWhiteList.DOC.extensionContains(fileExt)
        ) {
            path = docUploadPath;
        }

        // octet-type 으로 오는 경우의 hwp 파일 체크
        else if (fileExt.equals("hwp") && FileWhiteList.DOC.extensionContains(fileExt)) {
            path = docUploadPath;
        }

        // 그외 케이스는 exception 처리
        else {
            throw new BizException(StatusCode.MNB0002);
        }

        // TODO : 파일아이디 세팅 기준 협의, 확인
        String fileId = UUID.randomUUID().toString();

        // 현재는 uploadPath/날짜/아이디 로
        String folderPath = makeFolder(path, fileId);

        // 저장 파일경로 normalize 처리 및 whitelist 검증 추가
        // 검증 fail 시 throw StatusCode.COM0003
        // db에 env 경로를 제외한 savePath를 저장하므로 savePath, saveFullPath를 따로 할당한다.
        String savePath = FilenameUtils.normalizeNoEndSeparator(this.combineFilePath(folderPath, fileName), File.separator.equals("/"));
        String saveFullPath = this.normalizeFilePathAndWhiteListCheck(this.combineFilePath(path, savePath));
        if(saveFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로" );
        Path saveFilePath = Paths.get(saveFullPath);

        // 파일저장 처리 및 fileInfoVO 정보 세팅
        // 유저정보 및 DB 저장은 Service단에서 마저 처리
        try {
            // transfer or FileCopyUtil 둘중 하나 사용
            multipartFile.transferTo(saveFilePath);
//            FileCopyUtils.copy(multipartFile.getInputStream(), new FileOutputStream(saveFullPath.toFile()));

            fileInfoVO = ComFileInfoVO.builder()
                    .fileId(fileId)
                    .fileNm(fileName)
                    .filePath(savePath)
                    .filePtrn(multipartFile.getContentType())
                    .fileEtns(fileExt)
                    .fileSize(multipartFile.getSize())
                    .build();

        } catch (IOException ioe) {
            throw new BizException(StatusCode.MNB0002, ioe.getMessage());
        }
        return fileInfoVO;
    }

    public ComFileInfoVO saveBinaryFile(RequestBinaryFileSaveVO saveFileInfo, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        // 파일 확장자 확인 및 경로 설정
        String path = "";
        final String fileExt = saveFileInfo.getExt().replace(".", "");

        /** 확장자 화이트리스트 체크 **/
        // NDA + pdf 확장자일 경우
        if (isNdaYnEnum == IvtCode.YnTypeEnum.Y) {
            if (!saveFileInfo.getMime().equals("application/pdf")) throw new BizException(StatusCode.MNB0002);
            path = ndaUploadPath;
        }
        // 이미지 파일 체크
        else if (saveFileInfo.getMime().startsWith("image") && FileWhiteList.IMAGE.mimeContains(saveFileInfo.getMime())) {
            path = imgUploadPath;
        }
        // DOC 파일 체크
        else if (FileWhiteList.DOC.mimeContains(saveFileInfo.getMime())) {
            path = docUploadPath;
        }
        // octet-type 으로 오는 경우의 hwp 파일 체크
        else if (fileExt.equals("hwp") && FileWhiteList.DOC.extensionContains(fileExt)) {
            path = docUploadPath;
        } else {
            throw new BizException(StatusCode.MNB0002);
        }

        // 파일 아이디 생성
        String fileId = UUID.randomUUID().toString();

        // 최종 입력 파일명 설정
        String fileNm = (StringUtils.isNotBlank(saveFileInfo.getFileNm()) ? saveFileInfo.getFileNm() : fileId);
        fileNm = fileNm.substring(0, saveFileInfo.getFileNm().lastIndexOf("."))
                .replace("/", "")
                .replace("\\\\", "")
                .replace(".", "")
                .replace("&", "") + "." + fileExt;

        // 경로정보 설정
        String folderPath = makeFolder(path, fileId);
        String savePath = this.combineFilePath(folderPath, fileNm);

        // 저장 파일경로 normalize 처리 및 whitelist 검증 추가]
        String fullPath = this.normalizeFilePathAndWhiteListCheck(this.combineFilePath(path, savePath));
        if (fullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로");

        // 파일 생성
        File saveFile = new File(fullPath);
        if (!(saveFile.createNewFile())) throw new BizException(StatusCode.MNB0002);

        try (FileOutputStream fos = new FileOutputStream(saveFile)) {
            fos.write(saveFileInfo.getBinary());
        }

        return ComFileInfoVO.builder()
                .fileId(fileId)
                .fileNm(fileNm)
                .filePath(savePath)
                .filePtrn(saveFileInfo.getMime())
                .fileEtns(fileExt)
                .fileSize(saveFile.length())
                .build();
    }

    /**
     * 파일 다운로드 (스트림)
     *
     * @param fileInfoVO
     * @param os
     * @throws Exception
     */
    public void fileDownload(ComFileInfoVO fileInfoVO, OutputStream os, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        String envUploadPath = "";

        // 유형에 따른 env path set
        if(isNdaYnEnum == IvtCode.YnTypeEnum.Y) envUploadPath = ndaUploadPath;
        else if(fileInfoVO.getFilePtrn().startsWith("image")) envUploadPath = imgUploadPath;
        else envUploadPath = docUploadPath;

        // file 경로 set
        if(StringUtils.isAnyBlank(envUploadPath, fileInfoVO.getFilePath())) throw new BizException(StatusCode.COM0003, "파일 경로 조회 실패 : 잘못된 파일 경로");
        String fileFullPath = this.combineFilePath(envUploadPath, fileInfoVO.getFilePath());

        // 조회 파일경로 normalize 처리 및 whitelist 검증 추가
        fileFullPath = this.normalizeFilePathAndWhiteListCheck(fileFullPath);
        if(fileFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 조회 실패 : 잘못된 파일 경로" );

        try(FileInputStream fis = new FileInputStream(fileFullPath)) {
            byte[] data = new byte[8096]; //버퍼 크기 설정
            int len = -1;
            while ((len = fis.read(data)) != -1) {
                os.write(data, 0, len);
            } // 파일이 남아 있면 읽어서(read) data에 저장(write)
        }
    }

    /**
     * 바이너리 (str) 파일 다운로드
     * @param binary
     * @param os
     * @throws Exception
     */
    public void binaryFileDownload (String binary, OutputStream os) throws Exception {
        // try-with-resources을 통하여 자원 자동 해제 처리
        // exception 발생에 대해서는 throw 하여 aop에서 catch
        try (BufferedOutputStream bos = new BufferedOutputStream(os)) {
            // 바이너리 파일 디코드
            byte[] byteFile = Base64.getDecoder().decode(binary.getBytes(StandardCharsets.UTF_8));
            // 스트림 다운로드
            bos.write(byteFile);
        }
    }

    /**
     * Hex Str Pdf 변환 다운로드
     * @param pdfHexStr
     * @param os
     * @throws Exception
     */
    public void pdfHexStrDownload (String pdfHexStr, OutputStream os) throws Exception {
        byte[] pdfByte = DatatypeConverter.parseHexBinary(pdfHexStr);

        try (  InputStream inputStream = new ByteArrayInputStream(pdfByte);
               PDDocument pdDocument = PDDocument.load(inputStream) ) {

            pdDocument.save(os);
        }
    }

    /**
     * filePath base64 인코딩 메서드
     *
     * @param fileInfoVO
     * @return
     * @throws Exception
     */
    public String imageFileEncodeBase64(ComFileInfoVO fileInfoVO, boolean typeAttachFlg) throws Exception {

        if (!FileWhiteList.IMAGE.mimeContains(fileInfoVO.getFilePtrn())) return null;
        String resourcePath = this.combineFilePath(imgUploadPath, fileInfoVO.getFilePath());

        // 조회 파일경로 normalize 처리 및 whitelist 검증 추가
        resourcePath = this.normalizeFilePathAndWhiteListCheck(resourcePath);
        if(resourcePath == null) throw new BizException(StatusCode.COM0003, "파일 경로 조회 실패 : 잘못된 파일 경로" );

        Path path = Paths.get(resourcePath);

        // 파일 읽기
        Resource resource = new UrlResource(path.toUri());
        File file = ResourceUtils.getFile(resource.getURI().toString());

        // 인코딩
        String encodedPath = Base64.getEncoder().encodeToString(Files.readAllBytes(file.toPath()));

        if (typeAttachFlg) encodedPath = "data:" + fileInfoVO.getFilePtrn() + ";base64, " + encodedPath;

        return encodedPath;
    }

    /**
     * 파일 삭제
     *
     * @param fileInfoVO
     * @throws Exception
     */
    public boolean deleteFile(ComFileInfoVO fileInfoVO, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {

        String envUploadPath = "";

        // 유형에 따른 env path set
        if(isNdaYnEnum == IvtCode.YnTypeEnum.Y) envUploadPath = ndaUploadPath;
        else if(fileInfoVO.getFilePtrn().startsWith("image")) envUploadPath = imgUploadPath;
        else envUploadPath = docUploadPath;

        String fileFullPath = this.combineFilePath(envUploadPath, fileInfoVO.getFilePath());

        // 조회 파일경로 normalize 처리 및 whitelist 검증 추가
        fileFullPath = this.normalizeFilePathAndWhiteListCheck(fileFullPath);
        if(fileFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 조회 실패 : 잘못된 파일 경로" );

        /**
         * 파일 서비스에서 해당 Util 호출시
         * file.exists() == false 일 경우 로깅처리만 함 (파일 서비스에서 repo 논리삭제 commit)
         * 그외 Exception에 대해서는 Transaction rollback
         */
        File file = new File(fileFullPath);
        if (file.exists()) {
            file.delete();
            return true;
        } else {
            log.error("File Not Exist (File ID : {})", fileInfoVO.getFileId());
            return false;
        }
    }

    public boolean deleteFileIdDir(ComFileInfoVO fileInfoVO, IvtCode.YnTypeEnum isNdaYnEnum) throws Exception {
        // 파일 아이디 디렉터리 경로
        String fileIdDirFullPath;

        String dateAndIdDirPath = fileInfoVO.getFilePath()
                .substring(0, fileInfoVO.getFilePath().indexOf(fileInfoVO.getFileId())) + fileInfoVO.getFileId();

        if (isNdaYnEnum == IvtCode.YnTypeEnum.Y) fileIdDirFullPath = this.combineFilePath(ndaUploadPath, dateAndIdDirPath);
        else if (fileInfoVO.getFilePtrn().startsWith("image")) fileIdDirFullPath = this.combineFilePath(imgUploadPath, dateAndIdDirPath);
        else fileIdDirFullPath = this.combineFilePath(docUploadPath, dateAndIdDirPath);

        // 조회 파일경로 normalize 처리 및 whitelist 검증 추가
        fileIdDirFullPath = this.normalizeFilePathAndWhiteListCheck(fileIdDirFullPath);
        if(fileIdDirFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 조회 실패 : 잘못된 파일 경로" );

        File directory = new File(fileIdDirFullPath);

        if(directory.exists()) {
            // apache commons를 사용중이므로 해당 유틸을 사용함
            FileUtils.deleteDirectory(directory);
            return true;
        }
        else {
            log.error("File Directory Not Exist (File ID : {})", fileInfoVO.getFileId());
            return false;
        }
    }

    /**
     * 폴더경로 생성
     *
     * @param uuid
     * @return
     */
    private String makeFolder(String path, String uuid) throws Exception {
        String folderPath = LocalDate.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        folderPath = this.combineFilePath(folderPath, uuid);

        // @Value 경로
        File uploadPathFolder = new File(path, folderPath);

        //기존 경로 같은 폴더 파일이 없을 때만 mkdirs()로 위 폴더들을 생성
        if (!uploadPathFolder.exists()) {
            uploadPathFolder.mkdirs();
        }

        return folderPath;
    }
}
