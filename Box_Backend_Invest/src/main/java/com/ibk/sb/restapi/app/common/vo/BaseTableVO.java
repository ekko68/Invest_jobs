package com.ibk.sb.restapi.app.common.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;

@Getter
@Setter
@Alias("BaseTableVO")
public class BaseTableVO {

    /** 테이블 공통 필드 **/

    // 삭제여부
    @ApiModelProperty(hidden = true)
    private String delYn;
    
    // 등록 사용자
    @ApiModelProperty(hidden = true)
    private String rgsnUserId;

    @ApiModelProperty(hidden = true)
    private String rgsnUserNm;

    // 등록 일시
    @ApiModelProperty(hidden = true)
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

    // 수정 사용자
    @ApiModelProperty(hidden = true)
    private String amnnUserId;

    @ApiModelProperty(hidden = true)
    private String amnnUserNm;

    // 수정 일시
    @ApiModelProperty(hidden = true)
    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;

    /** 페이징 조회시 필요한 필드 **/
    // 총 레코드 수
    @ApiModelProperty(hidden = true)
    private Integer totalCnt = 0;

    // 로우넘
    @ApiModelProperty(hidden = true)
    private Integer rnum;

    // 역순 로우넘
    @ApiModelProperty(hidden = true)
    private Integer rvsRnum;
    
    /** 이미지가 있는 경우 경로 필드 **/
    @ApiModelProperty(hidden = true)
    private String imgFileId;

    @ApiModelProperty(hidden = true)
    private String imgUrl;
}
