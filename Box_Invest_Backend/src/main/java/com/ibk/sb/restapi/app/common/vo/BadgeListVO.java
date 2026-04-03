package com.ibk.sb.restapi.app.common.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BadgeListVO<T> {

    private Integer badgeCnt = 0;

    private String isMoreYn;

    private String unreadYn;

    private List<T> list;
}
