package com.ibk.sb.restapi.app.common.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class IvtCode {

    /**
     * Invest Box 내부 로직 처리를 위한 상수 모음
     */

    /**
     * 이용기관 타입
     */
    @AllArgsConstructor
    public enum UsisTypeEnum {
        COMPANY("COM", "기업"),
        VC("VC", "투자사");

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 투자 인력 관리 구분 코드
     */
    @AllArgsConstructor
    public enum HmrsInfo {
        IHI01001("IHI01001", "대표이사정보"),
        IHI01002("IHI01002", "투자인력정보"),
        IHI01003("IHI01003", "관리인력정보");

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 투자사 전환 상태 코드 신 (간접투자 추가)
     */
    @AllArgsConstructor
    public enum CvsStg {
        CVS01001("CVS01001", "요청"),
        CVS01002("CVS01002", "승인완료"),
        CVS01003("CVS01003", "대기");

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 투자 인력 관리 구분 코드
     */
    @AllArgsConstructor
    public enum Etc01Info {
        ETC01001("ETC01001", "관심비즈니스분야"),
        ETC01002("ETC01002", "활용기술"),
        ETC01003("ETC01003", "주요투자업종"),
        ETC01004("ETC01004", "주요투자단계"),;

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 기업 지적재산권 페이징 조회 타입
     */
    @AllArgsConstructor
    public enum KiprisTypeEnum {

        IP("IP", "특허 실용 조회"),
        TRADEMARK("TRADEMARK", "상표 조회"),
        DESIGN("DESIGN", "디자인 조회");

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 이용기관 투자심사 리스트 조회 타입
     */
    @AllArgsConstructor
    public enum AuditListTypeEnum {
        COMPANY_RECEIVE("SUGGEST", "기업 받은 투자심사제안"),
        COMPANY_SEND("REQUEST", "기업 보낸 투자심사요청"),
        VC_RECEIVE("REQUEST", "투자사 받은 투자심사요청"),
        VC_SEND("SUGGEST", "투자사 보낸 투자심사제안");

        @Getter
        private final String startType;
        @Getter
        private final String name;
    }

    /**
     * 목록 구분
     */
    public enum TransmitTypeEnum {
        RECEIVE, SEND
    }

    /**
     * IR 탭 구분
     */
    @AllArgsConstructor
    public enum IrTabTypeEnum {

        IR_BASIC("BASIC", "기본정보"),
        IR_HISTORY("HISTORY", "연혁정보"),
        IR_MEMBER("MEMBER", "팀원정보"),
        IR_STOCKHOLDER("STOCKHOLDER", "주주정보"),
        IR_FINANCE("FINANCE", "재무정보"),
        IR_EXTRA("EXTRA", "제품 / 기술 / 시장"),
        IR_PLAN("PLAN", "성과 및 계획"),
        IR_ALL("ALL", "전체");

        @Getter
        private final String type;
        @Getter
        private final String name;
    }

    /**
     * 메인박스 기업유저 권한 코드
     */
    @AllArgsConstructor
    public enum MainBoxUserUsisAuthEnum {

        CEO("C", "총괄관리자"),
        MANAGER("M", "관리자"),
        USER("U", "직원");

        @Getter
        private final String code;
        @Getter
        private final String name;
    }


    /**
     * 메인박스 기업유저 사업자 구분
     */
    @AllArgsConstructor
    public enum MainBoxUsisCprSeEnum {

        CORPORATION("0001", "법인사업자"),
        INDIVIDUAL("0002", "개인사업자");

        @Getter
        private final String code;
        @Getter
        private final String name;
    }

    public enum YnTypeEnum {
        Y, N
    }

    @AllArgsConstructor
    public enum ProfileNameEnum {

        DEV("dev"), PROD("prod"), STAGE("stage");

        @Getter
        private final String name;
    }

    @AllArgsConstructor
    public enum SortTypeEnum {

        DEFAULT("default", "기본 정렬"),
        RANDOM("random", "랜덤 정렬"),
        PREFERENCE("preference", "인기(선호도)순");

        @Getter
        private final String type;
        @Getter
        private final String desc;
    }
}
