package com.ibk.sb.restapi.app.config.httpentity;

import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class MultipartInputStreamFileResource extends InputStreamResource {

    /**
     * 클라이언트로부터 받은 MultipartFile을 org.springframework.core.io.Resource I/F 구현체로 변환하기 위함
     *
     * InputStreamResource 상속처리
     * 1. InputStreamResource에서 상속하는 return null처리된 getFilename override
     * 2. contentLength method의 경우 상황에 따라 override 주석처리를 할 것
     *
     * -> spring 5.1부터 MutlipartFile에 getResource로 구현체 반환이 추가됨 (단 getOriginalFilename은 주의)
     */

    private final String multipartFileName;
    private final long multipartFileSize;

    public MultipartInputStreamFileResource(MultipartFile multipartFile) throws Exception {
        this(
                multipartFile.getInputStream(),
                // IE, Edge 브라우저 환경에서는 전체 경로가 들어옴
                multipartFile.getOriginalFilename().substring(
                        multipartFile.getOriginalFilename().lastIndexOf("\\" + 1)
                ),
                multipartFile.getSize()
        );
    }

    public MultipartInputStreamFileResource(InputStream inputStream, String multipartFileName, long multipartFileSize) {
        super(inputStream);
        this.multipartFileName = multipartFileName;
        this.multipartFileSize = multipartFileSize;
    }

    @Override
    public String getFilename() {
        return this.multipartFileName;
    }

    /**
     * 스트림을 한번만 읽을 경우 -1로 반환 or
     * 혹은 multipart의 fileSize를 저장시켜 리턴하는걸 추천 (AbstractReousrce 주석확인)
     * @return
     * @throws IOException
     */
    @Override
    public long contentLength() throws IOException {
//        return -1;
        return this.multipartFileSize;
    }
}
