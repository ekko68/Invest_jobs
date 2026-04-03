package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.IvtJsonBackup;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class TsIvtBaseVO implements IvtJsonBackup {

    /*
    JSON Data의 String을 파싱하여 Insert 시키기 위해
    LocalDateTime 사용
     */

    @JsonProperty("RGSR_ID")
    private String rgsrId;

    @JsonProperty("RGSN_TS")
    private Timestamp rgsnTs;
//    private LocalDateTime rgsnTs;

    @JsonProperty("SYS_LSMD_ID")
    private String sysLsmdId;

    @JsonProperty("SYS_LSMD_TS")
    private Timestamp sysLsmdTs;
//    private LocalDateTime sysLsmdTs;

    // Date parameter, Timestamp parameter 양쪽 오버로딩을 하면 충돌이 날 수 있음
    public void setRgsnTs(Timestamp rgsnTs) {
        this.rgsnTs = rgsnTs;
    }
    public void setRgsnTs(String rgsnTs) throws Exception {
        this.rgsnTs = convertJsonStringToTimestamp(rgsnTs);
    }

    public void setSysLsmdTs(Timestamp sysLsmdTs) { this.sysLsmdTs = sysLsmdTs; }
    public void setSysLsmdTs(String sysLsmdTs) throws Exception {
        this.sysLsmdTs = convertJsonStringToTimestamp(sysLsmdTs);
    }

    /**
     * Json String date, timestamp data -> LocalDateTime -> Timestamp 처리
     * @param timestampStr
     * @throws Exception
     */
    protected Timestamp convertJsonStringToTimestamp(String timestampStr) throws Exception {
        if(StringUtil.hasLengthWithTrim(timestampStr)) {
            timestampStr = timestampStr.replace("'", "");
            if(timestampStr.lastIndexOf(".") != -1) timestampStr = timestampStr.substring(0, timestampStr.lastIndexOf("."));

            // DB Date 필드지만 Java Date, LocalDate는 시분초 값이 들어가지 않으므로 Timestamp로 설정
            // Mybatis 버전은 3.5 이상이지만 티베로 JDBC 버전이 LocalDate, LocalDateTime 매핑이 안되고 있으므로 Timestamp.values() 사용처리
            return Timestamp.valueOf(LocalDateTime.parse(timestampStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        } else {
            return null;
        }
    }
}
