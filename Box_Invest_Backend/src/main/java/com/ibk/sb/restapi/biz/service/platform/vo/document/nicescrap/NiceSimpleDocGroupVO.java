package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NiceSimpleDocGroupVO {

    private String scpgRqstNo;
    private String papersPresentnDt;

    List<NiceMnbSimpleDocVO> docList;
}
