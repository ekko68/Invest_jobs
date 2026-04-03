package com.ibk.sb.restapi.app.common.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("PageVO")
public class PageVO {

    private Integer page = 1; // pageNum, 현재 페이지

    private Integer record = 10; // amount, 페이지당 보여줄 데이터

    private Integer pageSize = 10; // 하단 표시 page size
}
