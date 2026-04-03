package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.sql.Date;

@Getter
@Setter
@Alias("BeforeIvt201MVO")
public class BeforeIvt201MVO extends BeforeIvtBaseVO {

    /**
     * TB_BOX_IVT201M
     * 투자BOX에서 투자를 받기 위해 실시한 서류제출 기본 정보
     */

    // NICE를 통해 스크래핑 요청 내역을 관리하기 위한 KEY
    private String scpgRqstNo;

    // 투자신청관리번호
    private String invmAplcMngmNo;

    // 이용기관ID
    private String usisId;

    // 로그인한 사용자 ID
    private String userId;

    // 스크래핑을 요청한 사업자등록번호
    private String scpgBzn;

    // 서류를 제출한 일시
    private Date docSbmsTs;
}
