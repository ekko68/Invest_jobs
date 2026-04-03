package com.ibk.sb.restapi.app.common.util;

import org.springframework.util.StringUtils;

import java.text.NumberFormat;
import java.text.ParsePosition;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 문자 유틸 클레스
 */
public class StringUtil {

    /**
     * 문자열을 숫자(Integer)로 변경
     * @param val
     * @return
     */
    public static Integer toInteger(String val) throws Exception {
        if(!StringUtils.hasLength(val)){
            return 0;
        }
        Integer dec = Integer.parseInt(val);
        return dec;
    }

    public static String splitSimpleResult(String data, String target, int idx) throws Exception {

        String[] splitArr = data.split(target);

        if(splitArr.length <= idx) {
            return "";
        }

        return splitArr[idx];
    }

    /**
     * 빈 문자열 검사 (IBK BOX의 경우 빈 값일 경우 " "가 들어가는 경우 존재
     * @param checkData
     * @return
     * @throws Exception
     */
    public static boolean hasLengthWithTrim(String checkData) throws Exception {
        if(checkData == null) return false;
        return StringUtils.hasLength(checkData.trim());
    }

    /**
     * "," 구분자 Tag String 리스트 변환
     * @param tags
     * @return
     */
    public static List<String> toStringTagList(String tags) throws Exception {
        if(!StringUtils.hasLength(tags)) {
            return new ArrayList<>();
        }
        
        return Arrays.asList(tags.split(","));
    }

    /**
     * Double Wrapper Parser를 통한 isNumber 체크
     * @param str
     * @return
     * @throws Exception
     */
    public static boolean isNumericByDoubleParser (String str) throws Exception {
        // 정규 표현식의 경우 "[-+]?\\d*\\.?\\d+"
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException nfe) {
            return false;
        }
    }

    public static boolean isOnlyNumber (String str) throws Exception {
        if(!StringUtils.hasLength(str)) return false;

        String onlyNum = str.replaceAll("[^0-9]", "");
        return StringUtils.hasLength(onlyNum);
    }

    public static String longNumberCommaFormat(Long number) throws Exception {
        if(number == null) return "0";

        return Long.toString(number).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
    }


    public static final int KR_100MILLION = 10000 * 10000;
    public static final int KR_10THOUSAND = 10000;

    /**
     * numberToUnitString 단위 표기 정보 Enum
     */
    public enum UnitEnum {
        KR_100MILLION_START(Arrays.asList("", "", "억", "조", "경"), 10000),
        KR_10THOUSAND_START(Arrays.asList("", "만", "억", "조", "경"), 10000),
        KR_10THOUSAND(Arrays.asList("", "만"), 10000);

        private List<String> unitList;
        private int splitUnit;

        UnitEnum(List<String> unitList, int splitUnit) {
            this.unitList = unitList;
            this.splitUnit = splitUnit;
        }

        public List<String> getUnitList() { return this.unitList; }
        public int getSplitUnit() { return this.splitUnit; }
    }

    /**
     * Long 값 단위표기 String 변환 Util
     * 기준 변경시 수정처리 필요
     * @param number
     * @param unitEnum
     * @param isSetMinDecimalData 최소 단위 미만의 값일 경우 소수점 이하 첫째자리 표현 여부 (예 : 최소단위 만, 값 9000 -> 0.9만으로 표현할지)
     * @return
     * @throws Exception
     */
    public static String numberToUnitString(Long number, UnitEnum unitEnum, boolean isSetMinDecimalData) throws Exception {

        // null 값에 대해서는 그냥 "0" 리턴
        if(number == null) return "0";

        // 단위 세팅값
        String[] unitListArr = (String[]) unitEnum.getUnitList().toArray();
        int splitUnit = unitEnum.getSplitUnit();

        // 결과값 저장
        StringBuilder sb = new StringBuilder("");

        // 최소설정 단위 이하 값에 대한 소수점 처리 변수
        int notEmptyUnitIdx = 0;
        double roundUnitItem = 0.0;

        // 단위값 배열에 따른 String 변환 처리
        for(int i = 0; i < unitListArr.length; i++) {
            // 다음 단위의 나머지 / 현재 단위
            Double unitItem = (number % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);

            // 최소 설정 단위일 경우에 대해 round 값 처리
            if(notEmptyUnitIdx == 0 && StringUtils.hasLength(unitListArr[i])) {
                notEmptyUnitIdx = i;
                roundUnitItem = Math.round(unitItem * 100) / 100.0;
            }

            unitItem = Math.floor(unitItem);
            if(unitItem > 0 && StringUtils.hasLength(unitListArr[i])) {
                sb.insert(0, unitItem.intValue() + unitListArr[i] + " ");
            }
        }

        // 단위처리 결과값이 있을 경우 반환
        if(StringUtils.hasLength(sb.toString())) {
            return sb.toString();
        }

        // 없는 경우 최소단위에서 소수 첫째자리 반올림 처리한 값 리턴
        else {
            return isSetMinDecimalData ? roundUnitItem + unitListArr[notEmptyUnitIdx] : '0' + unitListArr[notEmptyUnitIdx];
        }
    }
}
