package com.ibk.sb.restapi.app.common.util;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

@Slf4j
public class DateUtil {

    /**
     * 입력받은 날짜 String 데이터 YYYYMMDD 파싱 및 포맷 검사
     * @param date
     * @return
     * @throws Exception
     */
    public static String checkFormat(String date) throws Exception  {

        // 날짜정보 null 체크
        if(!StringUtils.hasLength(date) || date.equals("Invalid date")) {
            return "";
        }

        // 날짜정보 yyyyMMdd에 맞추기
        String onlyNum = date.replaceAll("[^0-9]","");
        onlyNum = onlyNum.substring(0, 8);

        try {
            // 파싱작업 및 Exception을 통해 yyyyMMdd 양식에 맞는지 점검
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            Date formattedDate = dateFormat.parse(onlyNum);

            return dateFormat.format(formattedDate);

        } catch(ParseException pe) {
            throw new BizException(StatusCode.COM0000, pe.getMessage());
        }
    }

    /**
     * 입력받은 날짜 String 데이터 YYYYMM 파싱 및 포맷 검사
     * @param date
     * @return
     * @throws Exception
     */
    public static String checkFormatWithoutDay(String date) throws Exception {
        // 날짜정보 null 체크
        if(!StringUtils.hasLength(date) || date.equals("Invalid date")) {
            return "";
        }

        // 날짜정보 yyyyMMdd에 맞추기
        String onlyNum = date.replaceAll("[^0-9]","");
        onlyNum = onlyNum.substring(0, 6);

        try {
            // 파싱작업 및 Exception을 통해 yyyyMMdd 양식에 맞는지 점검
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMM");
            Date formattedDate = dateFormat.parse(onlyNum);

            return dateFormat.format(formattedDate);

        } catch(ParseException pe) {
            throw new BizException(StatusCode.COM0000, pe.getMessage());
        }
    }

    /**
     * 입력받은 날짜 String 데이터 타임스탬프 파싱
     * @param dateString
     * @return
     * @throws Exception
     */
//    public static String checkDateToLocalDateTimeFormat(String dateString) throws Exception {
//
//        // 날짜정보 null 체크
//        if(!StringUtils.hasLength(dateString) || dateString.equals("Invalid date")) {
//            return "";
//        }
//
//        // 숫자 외 문자 제거
//        String onlyNum = dateString.replaceAll("[^0-9]", "");
//        onlyNum = onlyNum.substring(0, 6);
//
//        DateTimeFormatter dateFormat = DateTimeFormatter.BASIC_ISO_DATE;
//        LocalDate date = LocalDate.parse(onlyNum, dateFormat);
//        LocalDateTime dateTime = LocalDateTime.of(date, LocalTime.of(00, 00, 00));
//
//        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
//        return dateTime.format(dateTimeFormatter);
//    }

    /**
     * 입력받은 날짜 String 과 날짜포맷 String 으로 String to java.util.Date 로 변환
     * @param dateString
     * @param format
     * @return
     * @throws ParseException
     */
    public static Date convertStringToDate(String dateString, String format) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.parse(dateString);
    }

    /**
     * java.util.Date To java.sql.Date 로 변환
     * @param utilDate
     * @return
     */
    public static java.sql.Date convertUtilDateToSqlDate(Date utilDate) {
        return new java.sql.Date(utilDate.getTime());
    }

    /**
     * 날짜 전후 판단
     * @param beforeStringDate
     * @param afterStringDate
     * @return
     * @throws Exception
     */
    public static boolean compareDate(String beforeStringDate, String afterStringDate) throws Exception {

        try {
            // String 날짜 값 Date로 파싱
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            Date date1 = dateFormat.parse(beforeStringDate);
            Date date2 = dateFormat.parse(afterStringDate);

            // 파싱된 날짜 비교
            if(date1.compareTo(date2) <= 0) {
                return true;
            } else {
                return false;
            }

        } catch(ParseException pe) {
            throw new BizException(StatusCode.COM0000, pe.getMessage());
        }
    }

    /**
     * 날짜 계산 메서드
     * yyyyMMdd 형태의 dateString 대응
     * @param dateString
     * @param year
     * @param month
     * @param day
     * @return
     * @throws Exception
     */
    public static String dateCalc(String dateString, int year, int month, int day) throws Exception {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

            Calendar calendar = Calendar.getInstance();

            Date date = dateFormat.parse(dateString);

            calendar.setTime(date);
            calendar.add(Calendar.YEAR, year);
            calendar.add(Calendar.MONTH, month);
            calendar.add(Calendar.DATE, day);

            return dateFormat.format(calendar.getTime());

        } catch (ParseException pe) {
            throw new BizException(StatusCode.COM0000, pe.getMessage());
        }
    }

    /**
     * 최종수정일 리턴 메서드
     * @param before
     * @param after
     * @return
     * @throws Exception
     */
    public static String compareLastModifiedDate(String before, String after) throws Exception {

        String onlyNumBefore = before.replaceAll("[^0-9]","");
        onlyNumBefore = onlyNumBefore.substring(0, 8);
        String onlyNumAfter = after.replaceAll("[^0-9]", "");
        onlyNumAfter = onlyNumAfter.substring(0, 8);

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

            Date beforeDate = dateFormat.parse(onlyNumBefore);
            Date afterDate = dateFormat.parse(onlyNumAfter);

            if(beforeDate.compareTo(afterDate) <= 0) {
                return dateFormat.format(afterDate);
            } else {
                return dateFormat.format(beforeDate);
            }

        } catch (ParseException pe) {
            throw new BizException(StatusCode.COM0000, pe.getMessage());
        }
    }

    /**
     * 타임스탬프 수정일 비교
     * @param target
     * @param compareTimestamp
     * @return
     * @throws Exception
     */
    public static LocalDate compareLastModifiedDate(LocalDate target, Timestamp compareTimestamp) throws Exception {

        if(compareTimestamp == null) {
            return target;
        }

        LocalDate compareDate = compareTimestamp.toLocalDateTime().toLocalDate();

        LocalDate result =
                target == null
                        ? compareDate
                        : compareDate.isAfter(target) ? compareDate : target;

        return result;
    }
}
