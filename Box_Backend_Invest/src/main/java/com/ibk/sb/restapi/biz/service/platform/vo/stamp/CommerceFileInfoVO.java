package com.ibk.sb.restapi.biz.service.platform.vo.stamp;


import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class CommerceFileInfoVO {

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

    // 삭제여부
    private String delyn;

    // 사용여부
    private String usyn;

    // 등록 사용자 ID
    private String rgsnUserId;

    // 등록 사용자 명
    private String rgsnUserName;

    // 등록 일시
    private Timestamp rgsnTs;

    // 수정 사용자 ID
    private String amnnUserId;

    // 수정 사용자 명
    private String amnnUserName;

    // 수정 일시
    private Timestamp amnnTs;
}
