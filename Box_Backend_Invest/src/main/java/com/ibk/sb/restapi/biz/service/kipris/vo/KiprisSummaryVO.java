package com.ibk.sb.restapi.biz.service.kipris.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rvsRnum", "totalCnt"
})
public class KiprisSummaryVO extends BaseTableVO {

    // 발명명
    private String inventionName;

    // 출원번호
    private String applicationNumber;

    // 출원일자
    private String applicationDate;

    // 등록번호
    private String registrationNumber;

    // 등록일자
    private String registrationDate;

    // 초록, 창작내용
    private String applicationCon;

    // 출원인번호
    private String applicantNumber;

    // 큰 이미지 경로
    private String bgImgUrl;

    // 작은 이미지 경로
    private String smImgUrl;

    // 디자인 육면도 이미지 경로 리스트
    private List<String> bgImgUrlList;
    private List<String> smImgUrlList;

}
