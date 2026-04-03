package com.ibk.sb.restapi.app.common.vo;


import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("BaseCodeTableVO")
public class BaseCodeTableVO extends BaseTableVO{

    // 코드 테이블은 delYn이 아니라 useYn (사용여부) 사용
    private String useYn;

    /** 프론트 공통 협의 사항 
     * -> id, value로 하여 code, name 값 같이 보내줌
     * */
    private String id; // cd = code (코드)
    
    private String value; // nm = name (코드명)
}
