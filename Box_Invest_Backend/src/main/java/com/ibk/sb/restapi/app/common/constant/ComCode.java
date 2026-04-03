package com.ibk.sb.restapi.app.common.constant;


public enum ComCode {

    /** 공통코드 Enum **/
    /**
     * 서버에서 직접적으로 입력되는 코드값들 상수처리
     * 코드 변경시 ComCode, ComGroupCode, ConsultMapper, InvestAuditMapper, MessageMapper 수정 확인할 것
     */

    // 컨설팅 상태
    CONSULT_STANDBY("CNS01000", "대기", "CNS01", "컨설팅상태"),
    CONSULT_COMPLETE("CNS01001", "완료", "CNS01", "컨설팅상태"),
    CONSULT_CANCEL("CNS01002", "취소", "CNS01", "컨설팅상태"),

    // 메시지 유형
    // 일반 문의
    MESSAGE_AUDIT("MSG00000", "투자심사", "MSG00", "일반문의"),
    MESSAGE_INQUIRY("MSG00001", "사업문의", "MSG00", "일반문의"),

    // 투자심사 진행단계
    AUDIT_SUGGEST("EXN00000", "제안", "EXN00", "투자심사단계"),
    AUDIT_REQUEST("EXN00001", "요청", "EXN00", "투자심사단계"),
    AUDIT_EVALUATE("EXN00002", "심사중", "EXN00", "투자심사단계"),
    AUDIT_COMPLETE("EXN00003", "심사완료", "EXN00", "투자심사단계"),
    AUDIT_EXPIRED("EXN00004", "기간만료", "EXN00", "투자심사단계"),
    AUDIT_CANCEL("EXN00005", "요청취소", "EXN00", "투자심사단계"),

    // 투자심사 결과
    AUDIT_RESULT_ACCEPT("EXN01000", "승인", "EXN01", "투자심사결과"),
    AUDIT_RESULT_HOLD("EXN01001", "보류", "EXN01", "투자심사결과"),
    AUDIT_RESULT_REFUSE("EXN01002", "거절", "EXN01", "투자심사결과"),

    // 고객센터 Q&A 상태
    QA_STANDBY("SQA00000", "대기", "SQA00", "Q&A상태"),
    QA_COMPLETE("SQA00001", "완료", "SQA00", "Q&A상태"),
    QA_CANCEL("SQA00002", "취소", "SQA00", "Q&A상태"),

    // 배너타입코드
    MAIN_BANNER_TOP("BNR00000", "상단", "BNR00", "메인페이지배너"),
    MAIN_BANNER_BOTTOM("BNR00001", "하단", "BNR00", "메인페이지배너"),
    COMPANY_BANNER_BOTTOM("BNR01000", "하단", "BNR01", "기업목록페이지배너"),
    MYPAGE_BANNER_COMPANY("BNR02000", "기업", "BNR02", "마이페이지배너"),
    MYPAGE_BANNER_VC("BNR02001", "투자사", "BNR03", "마이페이지배너"),

    // 투자사전환상태코드
    CONVERT_VC_STANDBY("RCV00000", "대기", "RCV00", "투자사신청전환상태"),
    CONVERT_VC_COMPLETE("RCV00001", "완료", "RCV00", "투자사신청전환상태"),
    CONVERT_VC_CANCEL("RCV00002", "취소", "RCV00", "투자사신청전환상태"),

    // 투자사 유형
    VC_TYPE_AC("CMP02000", "엑셀러레이터", "CMP02", "투자사유형"),
    VC_TYPE_VC("CMP02001", "VC", "CMP02", "투자사유형"),
    VC_TYPE_ANGEL("CMP02002", "엔젤투자", "CMP02", "투자사유형"),

    // NDA 처리상태코드
    NDA_STANDBY("NDA00000", "대기", "NDA00", "NDA처리상태"),
    NDA_COMPLETE("NDA00001", "체결", "NDA00", "NDA처리상태"),
    NDA_CANCEL("NDA00002", "미체결", "NDA00", "NDA처리상태"),

    // 투자희망단계 (for 데이터 이관)
    IVT_HOPE_STG_SEED("INV00000", "Seed", "INV00", "투자단계"),
    IVT_HOPE_STG_SERIES_A("INV00001", "Series-A", "INV00", "투자단계"),
    IVT_HOPE_STG_SERIES_B("INV00002", "Series-B", "INV00", "투자단계"),
    IVT_HOPE_STG_SERIES_C("INV00003", "Series-C", "INV00", "투자단계"),
    IVT_HOPE_STG_SERIES_D("INV00004", "Series-D", "INV00", "투자단계"),

    IVT_HOPE_AMT_UNDER_HALFBILL("INV01000", "5억 이하", "INV01", "투자금액"),
    IVT_HOPE_AMT_UNDER_1BILL("INV01001", "10억 이하", "INV01", "투자금액"),
    IVT_HOPE_AMT_UNDER_3BILL("INV01002", "30억 이하", "INV01", "투자금액"),
    IVT_HOPE_AMT_UNDER_5BILL("INV01003", "50억 이하", "INV01", "투자금액"),
    IVT_HOPE_AMT_UNDER_10BILL("INV01004", "100억 이하", "INV01", "투자금액"),
    IVT_HOPE_AMT_UP_10BILL("INV01005", "100억 초과", "INV01", "투자금액");


    // 투자희망금액 (for 데이터 이관)

    private final String code;
    private final String name;
    private final String groupCode;
    private final String groupName;

    ComCode(String code, String name, String groupCode, String groupName) {
        this.code = code;
        this.name = name;
        this.groupCode = groupCode;
        this.groupName = groupName;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public String getGroupName() {
        return groupName;
    }
}
