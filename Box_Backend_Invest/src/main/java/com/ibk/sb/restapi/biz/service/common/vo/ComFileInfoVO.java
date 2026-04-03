package com.ibk.sb.restapi.biz.service.common.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("ComFileInfoVO")
@JsonIgnoreProperties({
        "delYn", "amnnUserId", "amnnTs",
        "totalCnt", "rnum",
        "athrUtlinsttId", "athrInvmCmpUtlinsttId", "athr"
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComFileInfoVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_FILE_ATCH_M
     * DESC : 첨부파일 정보
     */

    // 파일 관리번호
//    private String fileMngmNo;
    private String fileId;

    // 파일명
    private String fileNm;

    // 파일경로
//    private String filePathNm;
    private String filePath;

    // MIME 타입 (파일 유형)
//    private String fileMime;
    private String filePtrn;

    // 파일 확장자
//    private String fileExt;
    private String fileEtns;

    // 파일 용량
//    private Long flszVl;
    private Long fileSize;

    // 수정 사용자 ID
    private String amnnUserId;

    // 등록 사용자 ID
    private String rgsnUserId;

//    /** 파일 조회 권한 관련 필드 **/
//    /** 해당 필드는 업로드 이후 실제 데이터 입력 서비스에서 업데이트 처리 **/
//    // 조회 가능 기업 아이디
//    private String athrUtlinsttId;
//
//    // 조회 가능 투자사 아이디
//    private String athrInvmCmpUtlinsttId;
//
//    // 조회 가능 권한
//    private String athr;

    /** 프론트에서 업로드한 이미지 파일을 보여줘야할 경우를 위한 필드 **/
    private String imgUrl;
}
