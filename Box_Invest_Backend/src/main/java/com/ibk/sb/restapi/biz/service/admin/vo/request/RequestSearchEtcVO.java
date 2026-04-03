package com.ibk.sb.restapi.biz.service.admin.vo.request;

import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("RequestSearchEtcVO")
public class RequestSearchEtcVO extends PageVO {

    private String bzn;                 // 사업자번호
    private String cmpnNm;              // 회사명
    private String dsnc;                // 기타항목구분
    private String utlinsttId;          // 이용기관ID
    private String amnnUserId;          // 관리자 ID

}
