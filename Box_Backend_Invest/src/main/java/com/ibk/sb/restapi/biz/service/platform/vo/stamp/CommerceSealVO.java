package com.ibk.sb.restapi.biz.service.platform.vo.stamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
public class CommerceSealVO {

    // 이용기관(회사) ID
    private String utlinsttId;

    // 인감 이미지 파일 ID
    private String rgslImgFileId;

    // 인감 이미지 base64
    private String signBase64File;

    // 등록 사용자 ID
    private String rgsnUserId;

    // 등록 사용자 명
    private String rgsnUserName;

    /** 이미지가 있는 경우 경로 필드 **/
    private String imgFileId;
    private String imgUrl;

    // 등록 일시
    private Timestamp rgsnTs;

    // 커머스 rgsnTs는 ISO BASIC 포맷이 안 이뤄짐
    private String rgsnTsStr;

    // 수정 사용자 ID
    private String amnnUserId;

    // 수정 사용자 명
    private String amnnUserName;

    // 수정 일시
    private Timestamp amnnTs;

    // 커머스 amnnTs는 ISO BASIC 포맷이 안 이뤄짐
    private String amnmTsStr;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String uploadSignFileBase64UrlEnc;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CommerceFileInfoVO uploadFileInfo;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommerceFileInfoVO {
        // 파일 ID
        private String fileId;

        // 파일명
        private String fileNm;

        // 파일 경로
        private String filePath;

        // 파일 확장자
        private String fileEtns;

        // 파일 유형
        private String filePtrn;

        // 파일 크기
        private Long fileSize;
    }
}
