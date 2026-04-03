package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BannerVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rvsRnum"
})
public class BannerVO extends BaseTableVO {

    // 배너 공통 코드 ID
    private String bnnrComCdId;

    // 배너 순번
    private Integer bnnrSqn;

    // 배너 문구 내용
    private String bnnrPhrsCon;

    // 배너 이미지 파일
    private String bnnrImgFileId;
    private String fileId; // 프론트 공통화

    // 버튼 문구 내용
    private String btnPhrsCon;

    // 배너 연결 URL
    private String bnnrLnknUrl;

    // 노출여부
    private String expuYn;

    private ComFileInfoVO fileInfo;

}
