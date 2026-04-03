package com.ibk.sb.restapi.biz.service.user.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@Alias("RequestLoginVO")
public class RequestLoginVO {

     private String id;

     private String password;
}
