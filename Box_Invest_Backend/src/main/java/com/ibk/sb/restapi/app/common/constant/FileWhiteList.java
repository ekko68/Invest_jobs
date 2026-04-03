package com.ibk.sb.restapi.app.common.constant;

import java.util.Arrays;
import java.util.List;

public enum FileWhiteList {

    /** 파일 화이트 리스트 코드 : 허용 MIME TYPE과 확장자 리스트 저장 **/
    /** hwp 확장자의 경우 multipart에서 MIME 타입이 octet으로 오는경우가 있기 때문에 결국 substring으로 확장자 검사도 필요 **/

    IMAGE(
            Arrays.asList(
                    "image/gif",
                    "image/png",
                    "image/jpeg",
                    "image/jpg"
            ),
            Arrays.asList(
                    "gif", "png", "jpg", "jpeg"
            )
    ),

    DOC(
            Arrays.asList(
                    "application/pdf",
                    "application/msword", // .doc
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                    "application/vnd.ms-powerpoint", // .ppt
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                    "application/vnd.ms-excel", // .xls
                    "application/vnd.hancom.hwp", // .hwp
                    "application/x-hwp", // .hwp
                    "application/haansofthwp", // .hwp
                    "application/haansoftpptx", // 한컴 오피스 pptx
                    "application/haansoftxlsx", // 한컴 오피스 xlsx
                    "application/zip", // .zip
                    "application/x-zip-compressed" // .zip
            ),
            Arrays.asList(
                    "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "hwp"
                     , "zip" // zip 확장자 허용 추가
            )
    );



    private final List<String> mimeTypes;
    private final List<String> extensions;

    FileWhiteList(List<String> mimeType, List<String> extensions) {
        this.mimeTypes = mimeType;
        this.extensions = extensions;
    }

    public List<String> getExtensions() {
        return this.extensions;
    }
    public List<String> getMimeTypes() {
        return this.mimeTypes;
    }

    // MIME TYPE 화이트리스트 유효성 검사
    public boolean mimeContains(String mimeType) {
    return mimeTypes.contains(mimeType);
}

    // 파일 확장자 화이트리스트 유효성 검사
    public boolean extensionContains(String extension) {
        return extensions.contains(extension);
    }

}
