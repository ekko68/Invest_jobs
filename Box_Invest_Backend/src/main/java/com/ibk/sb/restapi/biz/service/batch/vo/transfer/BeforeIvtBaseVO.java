package com.ibk.sb.restapi.biz.service.batch.vo.transfer;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
public class BeforeIvtBaseVO {

    /**
     * Before IVT VO 공통부
     * Key에 해당하는 USIS_ID, INVM_APLC_MNGM_NO 의 경우 각 VO별로 명시함
     */

    // 최초로 등록한 사용자의 ID
    private String rgsrId;

    // 최초로 등록한 일시
    private Date rgsnTs;

    // 시스템 속성으로 해당 정보를 변경한 주체의 최종 정보
    private String sysLsmdId;

    // 시스템 속성으로 해당 정보가 변경된 최정 일시
    private Date sysLsmdTs;


    // Date To Timestamp Cast
    // 서비스단에서 new java.sql.Timestamp( java.sql.Date.getTime() ) 구문으로 처리 하지 않고 DB에서 Cast된 데이터로 입력처리를 위함
    // Date 데이터에 초 단위까지는 기본적으로 포함되므로 Timestamp cast 데이터를 처리하는 더 정확
    private Timestamp castRgsnTs;
    private Timestamp castSysLsmdTs;
}
