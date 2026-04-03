package com.ibk.sb.restapi.biz.service.vc.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Getter
@Setter
@Alias("RequestSearchVcVO")
public class RequestSearchVcVO extends PageVO {

    // 투자사명
    private String bplcNm;

    // 투자분야 코드 리스트
    private String[] invmFildCdList;

    // 활용기술 코드 리스트
    private String[] utlzTchnCdList;

    // 투자단계 코드 리스트
    private String[] invmStgCdList;

    // 지역 코드 리스트
    private String[] invmAreaCdList;
}
