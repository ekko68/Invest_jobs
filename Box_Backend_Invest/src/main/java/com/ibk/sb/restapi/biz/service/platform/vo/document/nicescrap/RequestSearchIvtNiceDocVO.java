package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("RequestNiceDocListVO")
public class RequestSearchIvtNiceDocVO {

    // 필수 항목만 생성자 세팅
    public RequestSearchIvtNiceDocVO(String utlinsttId, String userId) {
        this.utlinsttId = utlinsttId;
        this.userId = userId;
    }

    // 이용기관 ID
    private String utlinsttId;
    // 사용자 ID
    private String userId;

    // 대상 스크래핑 키
    private List<String> targetKeyList;

    // 개수 (최신 기준)
    // 현재 stream에서 해당 항목 제외
    private Long limitObj = (long) 1;
}
