package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InfotechScrapRowsVO<T> {

    private List<T> rows;

    /**
     * 사업자등록증명에서 jntBmanRprsCtlInqrOneDVOList의 경우
     * jntBmanCnt가 1일 경우는 rows가 List<T>가 아닌 T로 변경된다.
     * 만약 추후 추가하게 될때는 유의해야함
     */
}
