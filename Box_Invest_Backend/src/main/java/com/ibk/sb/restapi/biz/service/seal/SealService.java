package com.ibk.sb.restapi.biz.service.seal;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.PlatformMktService;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestInfotechCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class SealService {

    private final PlatformMktService platformMktService;
    private final PlatformFileService platformFileService;

    private final PlatformDocumentService platformDocumentService;

    /**
     * 공인인증서 정보 - infotech 사업자등록정보 대조 확인 인증 및 투자박스(커머스) 인감정보 조회
     * @return
     * @throws Exception
     */
    public CommerceSealVO sealInfotechCert(RequestInfotechCertVO requestInfotechCertVO) throws Exception {

        // 인증서 확인
        // 메서드 내부 api 통신을 통해 조회 시점에서 StatusCode.BIZ2001 throw exception 될 수 있음
        if(!platformDocumentService.checkCertInfoInfotechByBizLicense(requestInfotechCertVO)) throw new BizException(StatusCode.BIZ2001);

        // 커머스 인감정보 조회 및 반환
        return searchUsisSealInfo();
    }

    /**
     * 투자박스 (커머스)인감 정보 조회
     * @return
     * @throws Exception
     */
    public CommerceSealVO searchUsisSealInfo() throws Exception {
        CommerceSealVO sealVO = platformMktService.searchCommerceSealInfo();

        if(sealVO != null && sealVO.getRgsnTs() != null) {
            sealVO.setRgsnTsStr(sealVO.getRgsnTs().toLocalDateTime().format(DateTimeFormatter.BASIC_ISO_DATE));
        }
        if(sealVO != null && sealVO.getAmnnTs() != null) {
            sealVO.setAmnmTsStr(sealVO.getAmnnTs().toLocalDateTime().format(DateTimeFormatter.BASIC_ISO_DATE));
        }

        return sealVO;
    }

    /**
     * 투자박스 (커머스)인감 정보 수정
     * : 등록, 수정, 삭제
     * @return
     * @throws Exception
     */
    public CommerceSealVO saveUsisSealInfo(MultipartFile file, CommerceSealVO commerceSealVO) throws Exception {

        /*
        투자박스 프론트 마이페이지 인감정보 수정 :
        최종 저장 버튼 클릭 후 ->
        promise로 파일 업로드 처리 ->
        파일 아이디 response를 받아 이후 인감정보 수정 api 호출
         */

        CommerceSealVO resultVO;

        // 로그인 정보 조회, 설정
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        commerceSealVO.setUtlinsttId(user.getUserGroupId());
        commerceSealVO.setRgsnUserId(user.getUsername());
        commerceSealVO.setAmnnUserId(user.getUsername());

        // 업로드 파일 정보가 null이 아닌 경우 설정
        if(file != null) {
            String fileName = file.getOriginalFilename().substring(
                    file.getOriginalFilename().lastIndexOf("\\") + 1
            );
            String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
            fileName = fileName.substring(0, fileName.lastIndexOf("."));
            fileName = fileName.replace("/", "")
                    .replace("\\\\", "")
                    .replace(".", "")
                    .replace("&", "");

            commerceSealVO.setUploadFileInfo(
                    CommerceSealVO.CommerceFileInfoVO.builder()
                            .fileEtns(fileExt)
                            .filePtrn(file.getContentType())
                            .fileSize(file.getSize())
                            .fileNm(fileName)
                            .build()
            );

            String binaryEnc = "";

            try (InputStream inputStream = file.getInputStream();
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                BufferedImage image = ImageIO.read(inputStream);
                ImageIO.write(image, fileExt, outputStream);

                binaryEnc = Base64.getUrlEncoder().encodeToString(outputStream.toByteArray());
            }

            commerceSealVO.setUploadSignFileBase64UrlEnc(binaryEnc);
        }

        // 1. 업로드 파일 정보가 있는 경우
        // -> 인감 저장 (등록, 갱신) api 호출 및 처리결과 반환
        if(StringUtils.hasLength(commerceSealVO.getUploadSignFileBase64UrlEnc())) {
            return platformMktService.saveCommerceSealInfo(commerceSealVO);
        }

        // 2. 업로드 파일 정보가 없는 경우

        // -> 기존 인감정보 조회
        CommerceSealVO beforeData = searchUsisSealInfo();

        // 기존 인감정보 (인감 파일 아이디 포함)이 존재하고
        // request에 파일 아이디가 없는 경우 -> 삭제 api 호출 및 반환
        if (beforeData != null
                && StringUtils.hasLength(beforeData.getRgslImgFileId())
                && !StringUtils.hasLength(commerceSealVO.getRgslImgFileId())) {

            platformMktService.deleteCommerceSealInfo(beforeData);

            return searchUsisSealInfo();
        }

        // 3. 기존 정보 반환
        return beforeData;
    }
}
