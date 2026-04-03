package com.ibk.sb.restapi.app.common.constant;

public enum ComGroupCode {

    // 기업분류
    COMPANY_TYPE("CMP00", "기업구분"),
    COMPANY_SHAPE("CMP01", "기업형태"),
    INVEST_TYPE("CMP02", "투자사유형"),
    BIZ_ADR("CMP03", "사업장소재지"),

    PRMR_INVM_TPBS("TPBS1","주요투자업종"),

    // 투자정보
    INVEST_HOPE_STEP("INV00", "투자희망단계"),
    INVEST_HOPE_AMT("INV01", "투자희망금액"),

    // 컨설팅
    CONSULT_TYPE("CNS00", "컨설팅유형"),
    CONSULT_STATUS("CNS01", "컨설팅상태"),

    // 메시지
    MESSAGE_TYPE("MSG00", "메시지유형"),

    // 투자심사
    AUDIT_STEP("EXN00", "투자심사진행단계"),

    // 투자심사결과
    AUDIT_RESULT("EXN01", "투자심사결과"),

    // IR 지표
    IR_REGION("IRI00", "지역구분"),
    IR_IP("IRI01", "지적재산권상태"),
    IR_INDICATOR("IRI02", "주요지표"),

    // 고객센터 Q&A
    QNA_STATUS("SQA00", "Q&A상태"),
    QNA_TYPE("SQA01", "Q&A종류"),

    // 배너정보
    BANNER_MAIN("BNR00", "메인페이지배너"),
    BANNER_COMPANY("BNR01", "기업목록페이지배너"),
    BANNER_MYPAGE("BNR02", "마이페이지베너"),

    // 투자사 전환 상태코드
    INVEST_CONVERT_STATUS("RCV00", "투자사전환상태코드"),

    // NDA 상태 그룹코드
    NDA_STATUS("NDA00", "NDA처리상태코드"),


    /** IBK API 공통코드 조회용 그룹코드 (투자박스 내부 공통코드가 아님) */
    IBK_GRP_CD_INDUSTRY("PBIVT0010", "IBK 공통 12대 국가전략기술 분야별 산업기술분류코드");

    private final String code;
    private final String name;

    ComGroupCode(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() { return code; }
    public String getName() { return name; }

}
