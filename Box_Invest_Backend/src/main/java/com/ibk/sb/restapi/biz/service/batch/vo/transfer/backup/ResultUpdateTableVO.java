package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResultUpdateTableVO {

    public ResultUpdateTableVO(String targetTableNm) {
        this.targetTableNm = targetTableNm;
    }

    // 갱신 테이블 명
    private String targetTableNm;

    // 삭제 레코드 수
    private int deleteRecordCnt = 0;

    // 등록 레코드 수
    private int insertRecordCnt = 0;

    // 파일 삭제 타입
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String deleteType;

    // 삭제 처리 관련 첨부파일 테이블 레코드 수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer deleteNotMatchedBeforeFileListCnt = null;

    // 논리 복구 처리 관련 첨부파일 테이블 레코드 수
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer logicalRecoverNotMatchedBackupFileListCnt = null;

    // 프로세스 진행 메시지
    private String message;
}
