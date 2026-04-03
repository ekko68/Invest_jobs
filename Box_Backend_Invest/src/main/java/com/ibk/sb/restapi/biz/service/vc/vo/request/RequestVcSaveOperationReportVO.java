package com.ibk.sb.restapi.biz.service.vc.vo.request;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Getter
@Setter
@Alias("RequestVcSaveOperationReportVO")
public class RequestVcSaveOperationReportVO {

    // 투자사ID
    private String invtId;

    // 보고서구분
    private String rptDsnc;

    // 기존_보고서구분 (수정 때 사용)
    private String rptDsncPrev;

    // 최종제출일
    private String lada;

    private List<MultipartFile> reqReportList;
}
