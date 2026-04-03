package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestTransferInvmVO {
    // 이관시 설정될 투자사 BOX 이용기관 ID
    private String settingTranferInvmId;

    // 운영서버 데이터가 많아 타임 아웃 등의 문제가 발생할 수 있음
    // 범위 지정 추가
    // 투자심사 요청 등록을 기준으로 작업한다.
    private Integer startRange = null;
    private Integer endRange = null;

    // 이관 대상 타입 (ALL : 전체 / EXNT : 투자심사 / USIS : 기업정보 / SCRAPPING : 스크래핑)
    private String transferType;
}
