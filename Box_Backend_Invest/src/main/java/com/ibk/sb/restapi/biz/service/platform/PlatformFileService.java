package com.ibk.sb.restapi.biz.service.platform;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.app.config.httpentity.RestTemplateConfig;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformTerms;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenCommonFeign;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenMnbFileFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.common.BoxFileResVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;
import feign.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformFileService {

    private final BoxOpenMnbFileFeign boxOpenMnbFileFeign;

    private final BoxOpenCommonFeign boxOpenCommonFeign;

    private final CommonFileService fileService;

    private final FileUtil fileUtil;

    @Value("${feign.mkt-api.key}")
    private String mktAppKey;

    @Value("${com.ibk.api.upload.doc.path}")
    private String docFilePath;

    @Value("${com.ibk.api.upload.img.path}")
    private String imgFilePath;

    @Value("${feign.box-open-api.url}")
    private String boxOpenApiUrl;

    /**
     * IBK 이용약관 파일번호 조회
     * @param termsEnum
     * @return
     * @throws Exception
     */
    public String searchTermsFileNumber(PlatformTerms.PlatformTermsEnum termsEnum) throws Exception {
        // set request
        Map<String, String> request = new HashMap<>();
        request.put("dcffStplId", termsEnum.getTermsId());
        request.put("dcffStplDtlSqn", "1"); // 해당 관리번호 첫번째 시퀀스(최신)의 파일을 받게 함

        // 이용약관 파일 넘버 조회
        BoxResponseVO<BoxFileResVO> response = boxOpenCommonFeign.getTermsFileNumber(request);

        if(response == null) throw new BizException(StatusCode.MNB0001);
        if(!response.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("call terms file number err status : {}", response.getSTATUS());
            log.error("call terms file number err message : {}", response.getRSLT_MSG());
            throw new BizException(StatusCode.MNB0003);
        }
        else if(response.getRSLT_DATA() == null || !StringUtils.hasLength(response.getRSLT_DATA().getFileMngmNo())) {
            log.error("there is no file number (terms id : {})", termsEnum.getTermsId());
            throw new BizException(StatusCode.MNB0003);
        }

        return response.getRSLT_DATA().getFileMngmNo();
    }

    /**
     * 커머스박스 파일 업로드
     *
     * @param multipartFile
     * @return
     * @throws Exception
     */
    public Map<String, String> uploadToCommerceFile(MultipartFile multipartFile) throws Exception {

        // 커머스 파일 전송 객체 생성
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        /* ====== 임시파일 저장 후 설정할 resource를 설정할 경우 ====== */
        
        // 임시 파일 경로 설정 및 저장
//        String tmpFilePath = fileUtil.saveTempFile(multipartFile);
        // Resource 경로 입력시 서버 환경에 따라 File seperator는 인식 못할 수 있음
//        String resourcePath =  tmpFilePath.replace(File.separator, "/");
        // 전송객체 정보 설정
//        Resource resource = new FileSystemResource(resourcePath);

        /* ====== multipart에서 resource를 바로 설정할경우 ====== */

        Resource resource = multipartFile.getResource();
        // Resource resource = new MultipartInputStreamFileResource(multipartFile);
        
        body.add("file", resource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("Content-Type", "application/json; charset=utf-8");
        headers.add("Media-Type", "application/json; charset=utf-8");
        headers.add("appKey", mktAppKey);

        // api 호출
        HttpEntity<LinkedMultiValueMap<String, Object>> httpEntity = new HttpEntity<>(body, headers);
        ResponseEntity<ResponseData> responseEntity = RestTemplateConfig
                .getRestTemplate()
                .postForEntity(boxOpenApiUrl + "/api/mk/v1/file/upload", httpEntity, ResponseData.class);
//                    .postForEntity("http://localhost:7401" + "/api/mk/v1/file/upload", httpEntity, ResponseData.class);

        // 통신 에러 발생 검사
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new BizException(StatusCode.MNB0002);
        }

        // 결과값 에러 발생 검사
        if (!responseEntity.getBody().getCode().equals(Integer.toString(HttpStatus.OK.value()))) {
            log.error("File Transfer to Commerce Error (Status Code : {}) : {}"
                    , responseEntity.getBody().getCode()
                    , responseEntity.getBody().getMessage());
            throw new BizException(StatusCode.MNB0002);
        }

        // 임시 파일 삭제 - 위에서 임시파일 저장을 할 경우
//        fileUtil.deleteTempFolder(tmpFilePath);

        return (HashMap) responseEntity.getBody().getData();
    }

    /**
     * AS-IS 투자박스 문서 파일 데이터 이관
     *
     * -> 만약 파일정보 조회시 리스트 요소가 복수일 경우 압축처리하여 하나의 파일로 만들어 넣는다.
     *
     * @param fileMngmNo
     * @return
     * @throws Exception
     */
    public ComFileInfoVO transferIvtDocFile(String fileMngmNo, String zipName) throws Exception {

        // 박스 파일 정보 조회
        if (!StringUtil.hasLengthWithTrim(fileMngmNo)) throw new BizException(StatusCode.COM0005);

        Map<String, String> body = new HashMap<>();
        body.put("fileMngmNo", fileMngmNo);
        BoxFileResVO boxFileResponse = boxOpenCommonFeign.getBoxFileInfo(body);

        // 파일 정보 확인
        if (!(boxFileResponse.getList() != null && boxFileResponse.getList().size() > 0)) {
            // throw new BizException(StatusCode.COM0005);
            // 파일아이디가 잘못된 경우 이관 전체가 멈춰버리므로 해당 아이디를 로깅처리하고 null 리턴
            log.error("No Response File Data : [fileMngmNo : {}]", fileMngmNo);
            return null;
        }

        /* Case 1. 파일이 하나일 경우 */
        if(boxFileResponse.getList().size() == 1) {
            BoxFileResVO.BoxFileInfoVO item = boxFileResponse.getList().get(0);

            // 파일 등록 및 리턴
            return registFile(docFilePath, item);
        }

        /* Case 2. 파일이 복수로 존재할 경우 */
        else {
            final String fileId = UUID.randomUUID().toString();
            String folder = makeFolder(docFilePath, fileId);

            String zipFilePath = StringUtils.hasLength(zipName)
                    ? fileUtil.normalizeFilePathAndWhiteListCheck(fileUtil.combineFilePath(fileUtil.combineFilePath(docFilePath, folder), zipName + ".zip"))
                    : fileUtil.normalizeFilePathAndWhiteListCheck(fileUtil.combineFilePath(fileUtil.combineFilePath(docFilePath, folder), fileId + ".zip"));
            if(zipFilePath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로" );

            File zipFile = new File(zipFilePath);


            try(ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
                // zip 생성시 내부 동일파일명 문제 처리를 위함
                Set<String> zipEntryFileNmSet = new HashSet<>();
                // tmp file list를 만들어 미리 임시저장하고 사용할 경우 zip에 저장된 임시파일들이 손상됨
                // 각 개별로 stream을 받고 바로 저장
                for (BoxFileResVO.BoxFileInfoVO item : boxFileResponse.getList()) {
                    Response downloadResponse = boxOpenMnbFileFeign.getMainFileDownload(item.getFileMngmNo(), item.getFileSqn());
                    if (downloadResponse.status() != HttpStatus.OK.value()) throw new BizException(StatusCode.MNB0003);

                    // 현재 샘플로 조회된 값 중 파일명에 file separator 문자가 들어간 경우를 확인함
                    String ext = item.getFileNm().substring(item.getFileNm().lastIndexOf(".") + 1);
                    String fileNm = item.getFileNm().substring(0, item.getFileNm().lastIndexOf("."));
                    fileNm = fileNm.replace("/", "")
                            .replace("\\\\", "")
                            .replace(".", "")
                            .replace("&", "");

                    // 동일 파일명이 있을 경우 (숫자) 추가
                    int cnt = 1;
                    while(!zipEntryFileNmSet.add(fileNm)) {
                        fileNm = fileNm + "(" + cnt++ + ")";
                    }

                    fileNm = fileNm + "." + ext;

                    try(InputStream inputStream = downloadResponse.body().asInputStream()) {
                        // zip 항목 + 파일 속성 구성
                        ZipEntry zipEntry = new ZipEntry(fileNm);
                        zipEntry.setSize(item.getFlszVl());
                        // zip 항목 추가
                        zos.putNextEntry(zipEntry);
                        StreamUtils.copy(inputStream, zos);
                        // zipEntry close
                        zos.closeEntry();
                    }
                }
                zos.finish();
            }

            String zipFileName =  StringUtils.hasLength(zipName) ? zipName + ".zip" : fileId + ".zip";
            zipFilePath = fileUtil.normalizeFilePathAndWhiteListCheck(zipFilePath);
            if(zipFilePath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로" );

            File resultFile = new File(zipFilePath);

            return ComFileInfoVO.builder()
                    .fileId(fileId)
                    .fileNm(resultFile.getName())
                    .filePath(fileUtil.combineFilePath(folder, zipFileName))
                    .filePtrn("application/zip")
                    .fileEtns("zip")
                    .fileSize(resultFile.getTotalSpace())
                    .build();
        }
    }

    /**
     * AS-IS 투자박스 문서 이미지 데이터 이관
     *  -> 기존 투자박스 제품 / 서비스 이미지 :
     *      최대 5개까지 등록
     *      이미지가 한개일 경우는 파일정보 조회에서 조회되지 않고 이미지 랜더링으로 받는 것만 가능
     *      이미지가 복수개일 경우 랜더링 이미지로 단일 조회도 되고 파일정보 조회 api로 데이터 수신도 가능
     *
     * -> 이미지가 복수개일 경우 현재 신규 투자박스의 경우 제품당 이미지가 하나이므로 해당 리스트 만큼 제품 정보를 생성
     *
     * @param fileMngmNo
     * @return
     * @throws Exception
     */
    public List<ComFileInfoVO> transferIvtImgFile(String fileMngmNo) throws Exception {

        if (!StringUtil.hasLengthWithTrim(fileMngmNo)) throw new BizException(StatusCode.COM0005);

        /* getBoxFileInfo 조회 -> list size가 0이 아닐 경우 -> Case 1. 0일 경우 -> Case 2. */
        Map<String, String> body = new HashMap<>();
        body.put("fileMngmNo", fileMngmNo);
        BoxFileResVO fileResponseVO = boxOpenCommonFeign.getBoxFileInfo(body);
        if(fileResponseVO == null) {
            // fileMngmNo가 잘못된 경우 -> null 리턴
            // throw new BizException(StatusCode.MNB0003);
            log.error("Null Response File Data : [fileMngmNo : {}]", fileMngmNo);
            return null;
        }

        List<ComFileInfoVO> resultList = new ArrayList<>();

        /* Case 1. 이미지 파일이 복수로 존재할 경우 : getBoxFileInfo로 조회가능 -> 각 리스트마다 파일을 생성해야함 */
        if(fileResponseVO.getList() != null && fileResponseVO.getList().size() > 0) {
            for(BoxFileResVO.BoxFileInfoVO item : fileResponseVO.getList()) {
                // 파일 다운로드, 등록 및 파일정보 리턴
                resultList.add(registFile(imgFilePath, item));
            }
        }

        /* Case 2. 소스분석 및 재테스트 결과 위 리스트 크기가 0로 떨어질 경우 다운로드 처리가 되지 않음  */
        else {
            log.error("No File Info List Response File Data : [fileMngmNo : {}]", fileMngmNo);
            return null;
        }

        return resultList;
    }

    /**
     * AS-IS 투자박스 메인박스 파일 TO-BE 투자박스 다운로드 및 등록
     * boxOpenMnbFileFeign.getMainFileDownload
     * (메인박스 /Common/fileDownload.do)로 다운로드 하는 파일 건에 대한 파일 등록 및 정보 반환
     * @param rootPath
     * @param item
     * @return
     * @throws Exception
     */
    public ComFileInfoVO registFile(String rootPath, BoxFileResVO.BoxFileInfoVO item) throws Exception {

        // 파일 다운로드
        Response downloadResponse = boxOpenMnbFileFeign.getMainFileDownload(item.getFileMngmNo(), item.getFileSqn());
        if (downloadResponse.status() != HttpStatus.OK.value()) throw new BizException(StatusCode.MNB0003);

        try(InputStream inputStream = downloadResponse.body().asInputStream()) {
            String fileId = UUID.randomUUID().toString();

            // 현재 샘플로 조회된 값 중 파일명에 file separator 문자가 들어간 경우를 확인함
            String ext = "";
            String fileNm = "";

            // 로고 파일등의 경우 fileNm으로 아이디가 오고 orcpFileNm으로 확장자 정보가 있는 파일 명으로 올 때가 있음
            int extIdx = item.getFileNm().lastIndexOf(".");
            if(extIdx < 0) {
                ext = item.getOrcpFileNm().substring(item.getOrcpFileNm().lastIndexOf(".") + 1);
                fileNm = item.getOrcpFileNm().substring(0, item.getOrcpFileNm().lastIndexOf("."));
            } else {
                ext = item.getFileNm().substring(extIdx + 1);
                fileNm = item.getFileNm().substring(0, extIdx);
            }

            fileNm = fileNm.replace("/", "")
                    .replace("\\\\", "")
                    .replace(".", "")
                    .replace("&", "");

            fileNm = fileNm + "." + ext;

            String filePath = fileUtil.combineFilePath(makeFolder(rootPath, fileId), fileNm);
            String fileFullPath = fileUtil.normalizeFilePathAndWhiteListCheck(fileUtil.combineFilePath(rootPath, filePath));
            if(fileFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로" );

            File file = new File(fileFullPath);
            try(FileOutputStream fos = new FileOutputStream(file, false);) {
                int read;
                byte[] bytes = new byte[8096];
                while((read = inputStream.read(bytes)) != -1) {
                    fos.write(bytes, 0, read);
                }
            }

            return ComFileInfoVO.builder()
                    .fileId(fileId)
                    .fileNm(fileNm)
                    .filePath(filePath)
                    .filePtrn(item.getFilePtrnNm())
                    .fileEtns(ext)
                    .fileSize(item.getFlszVl().longValue())
                    .build();
        }
    }

    /**
     * 폴더 생성
     * @caution 폴더만 생성하고 반환되는 값은 rootPath를 제외한 값임
     *
     * @param rootPath
     * @param uuid
     * @return
     * @throws Exception
     */
    public String makeFolder(String rootPath, String uuid) throws Exception {
        String folderPath = LocalDate.now(ZoneId.of("Asia/Seoul"))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + File.separator + uuid;

        String folderFullPath = fileUtil.normalizeFilePathAndWhiteListCheck(fileUtil.combineFilePath(rootPath, folderPath));
        if(folderFullPath == null) throw new BizException(StatusCode.COM0003, "파일 경로 생성 실패 : 잘못된 파일 경로" );

        File uploadPathFolder = new File(folderFullPath);

        if(!uploadPathFolder.exists()) uploadPathFolder.mkdirs();
        return folderPath;
    }
}
