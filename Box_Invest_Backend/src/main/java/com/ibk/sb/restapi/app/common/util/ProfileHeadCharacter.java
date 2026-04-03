package com.ibk.sb.restapi.app.common.util;

import java.util.regex.Pattern;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 이용기관 프로필에서 디폴트 이미지를 사용할 경우,
 * 투자박스에서는 컬러를 랜덤으로 재설정해달라는 요구사항에 따라
 * 프로필의 문자를 다시 추출해서 사용하기 위해 기존 IBK Commons 모듈의 해당 Util을 그대로 가져옴
 *
 * 변경사항 :
 * RandomStringUtils를 사용하기 위한 apache.commons.lang 라이브러리를 apache.commons.lang3으로 버전업함
 */
public class ProfileHeadCharacter {
    private static final Logger logger = LoggerFactory.getLogger(ProfileHeadCharacter.class);
    private static String[] REMOVE_TEXT = new String[]{"\\(주\\)", "\\(유\\)"};
    private static String ORIGINAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public String get(String name) {
        name = this.removeText(name);
        String res = null;

        for(int i = 0; i < name.length(); ++i) {
            res = name.substring(i, i + 1);
            if (logger.isDebugEnabled()) {
                logger.debug(res + ": 한글[" + this.isKorean(res) + "] 영어[" + this.isEnglish(res) + "] 숫자[" + this.isNumeric(res) + "]");
            }

            if (isValidChar(res)) {
                return res;
            }
        }

        return this.randomText();
    }

    private boolean isKorean(String word) {
        return Pattern.matches("^[ㄱ-ㅎ가-힣]", word);
    }

    private boolean isEnglish(String word) {
        return Pattern.matches("^[a-zA-Z]", word);
    }

    private boolean isNumeric(String word) {
        return Pattern.matches("^[0-9]", word);
    }

    private static boolean isValidChar(String word) {
        return Pattern.matches("^[0-9a-zA-Zㄱ-ㅎ가-힣]", word);
    }

    private String removeText(String text) {
        String[] var2 = REMOVE_TEXT;
        int var3 = var2.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            String remove = var2[var4];
            text = text.replaceAll(remove, "");
        }

        return text;
    }

    private String randomText() {
        int randomNum = (Integer)ConvertUtils.convert(RandomStringUtils.randomNumeric(2), Integer.class) % ORIGINAL.length();
        if (logger.isDebugEnabled()) {
            logger.debug(ORIGINAL.substring(randomNum, randomNum + 1));
        }

        return ORIGINAL.substring(randomNum, randomNum + 1);
    }
}
