package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.IvtJsonBackup;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Getter
@Setter
public class NwIvtBaseVO implements IvtJsonBackup {

    /*
    JSON Data의 String을 파싱하여 Insert 시키기 위해
    LocalDateTime 사용
     */

    @JsonProperty("RGSN_USER_ID")
    private String rgsnUserId;

    @JsonProperty("RGSN_TS")
    private Timestamp rgsnTs;

    @JsonProperty("AMNN_USER_ID")
    private String amnnUserId;

    @JsonProperty("AMNN_TS")
    private Timestamp amnnTs;

    public void setRgsnTs(Timestamp rgsnTs) {
        this.rgsnTs = rgsnTs;
    }
    public void setRgsnTs(String rgsnTs) throws Exception {
        this.rgsnTs = convertJsonStringToTimestampMilli(rgsnTs);
    }

    public void setAmnnTs(Timestamp amnnTs) {
        this.amnnTs = amnnTs;
    }
    public void setAmnnTs(String amnnTs) throws Exception {
        this.amnnTs = convertJsonStringToTimestampMilli(amnnTs);
    }

    /**
     * Json String date, timestamp data -> LocalDateTime -> Timestamp 처리
     * @param timestampStr
     * @throws Exception
     */
    protected Timestamp convertJsonStringToTimestampMilli(String timestampStr) throws Exception {
        if(StringUtil.hasLengthWithTrim(timestampStr)) {
            timestampStr = timestampStr.replace("'", "");

            // milliSec 처리
            int commaIdx = timestampStr.lastIndexOf(".");
            if(commaIdx != -1) {
                int milliSecLength = timestampStr.length() - commaIdx - 1;
                if(timestampStr.substring(commaIdx).equals(".0") || milliSecLength == 0) { // .0으로 떨어지는 경우 parse error가 발생하므로 소수점 이하를 삭제
                    // Mybatis 버전은 3.5 이상이지만 티베로 JDBC 버전이 LocalDate, LocalDateTime 매핑이 안되고 있으므로 Timestamp.values() 사용처리
                    return Timestamp.valueOf(LocalDateTime.parse(timestampStr.substring(0, commaIdx), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                }

                String pattern = "";
                if(milliSecLength > 3) { // milliSec이 소수점 4자리 이상일 경우 SSS까지만 자른다. (SSS 이상이면 LocalDateTime 파싱이 잘 되지 않음)
                    timestampStr = timestampStr.substring(0, commaIdx + 4);
                    milliSecLength = timestampStr.length() - commaIdx - 1;
                }

                switch (milliSecLength) {
                    case 1:
                        pattern = "yyyy-MM-dd HH:mm:ss.S";
                        break;
                    case 2:
                        pattern = "yyyy-MM-dd HH:mm:ss.SS";
                        break;
                    case 3:
                        pattern = "yyyy-MM-dd HH:mm:ss.SSS";
                        break;
                    default:
                        return null;
                }

                return Timestamp.valueOf(LocalDateTime.parse(timestampStr, DateTimeFormatter.ofPattern(pattern)));
            }
            // miiliSec이 없는 경우는 초까지만 처리
            else {
                return Timestamp.valueOf(LocalDateTime.parse(timestampStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }
        } else {
            return null;
        }
    }
}
