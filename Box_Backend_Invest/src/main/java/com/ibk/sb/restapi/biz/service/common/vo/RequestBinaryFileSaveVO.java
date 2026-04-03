package com.ibk.sb.restapi.biz.service.common.vo;

import lombok.*;
import org.apache.commons.lang3.StringUtils;

import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RequestBinaryFileSaveVO {

    private byte[] binary;

    private String mime;

    private String ext;

    private String fileNm;

    public boolean validateAllField () {
        boolean result =  this.binary != null && this.binary.length > 0  // byte 배열 확인
                && !(StringUtils.isAnyBlank(this.mime, this.ext, this.fileNm)); // 저장될 contentType, 확장자, 파일명 정보 확인

        return result;
    }

    // 파일명 set 시점에 확장자 필드가 비어있고 파일명에서 '.'이 있는 경우 파일명에서 확장자 필드를 set함
    public void setFileNm(String fileNm) {
        this.fileNm = fileNm;

        if(StringUtils.isBlank(this.ext)) {
            if(StringUtils.isNotBlank(fileNm) && fileNm.endsWith(".")) this.ext = fileNm.substring(fileNm.lastIndexOf("."), fileNm.length());
        }
    }

    // vo binary field setter overloading
    public void setBinary(String base64Str, Base64.Decoder decoder) {
        this.binary = decoder.decode(base64Str);
    }

    // vo builder binary field overloading
    public static class RequestBinaryFileSaveVOBuilder {
        private byte[] binary;

        public RequestBinaryFileSaveVOBuilder binary(byte[] binary) {
            this.binary = binary;
            return this;
        }

        public RequestBinaryFileSaveVOBuilder binary(String base64Str, Base64.Decoder decoder) {
            this.binary = decoder.decode(base64Str);
            return this;
        }
    }
}
