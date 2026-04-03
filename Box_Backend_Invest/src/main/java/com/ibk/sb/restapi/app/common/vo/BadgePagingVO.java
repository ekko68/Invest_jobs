package com.ibk.sb.restapi.app.common.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class BadgePagingVO<T extends BaseTableVO> extends PagingVO {

    // 카운트 뱃지 값
    private Integer badgeCnt;
    // 카운트 뱃지 Map
    private Map<String, Integer> badgeCntMap;

    public BadgePagingVO(PageVO pageVO, List<T> list, Integer badgeCnt) {
        super(pageVO, list);
        this.badgeCnt = badgeCnt;
    }

    public BadgePagingVO(PageVO pageVO, List<T> list, Map<String, Integer> badgeCntMap) {
        super(pageVO, list);
        this.badgeCntMap = badgeCntMap;
    }

    public BadgePagingVO(PageVO pageVO, List<T> list, Integer badgeCnt, Map<String, Integer> badgeCntMap) {
        super(pageVO, list);
        this.badgeCnt = badgeCnt;
        this.badgeCntMap = badgeCntMap;
    }

}
