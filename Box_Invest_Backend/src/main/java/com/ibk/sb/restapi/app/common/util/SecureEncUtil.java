package com.ibk.sb.restapi.app.common.util;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;
import sun.misc.BASE64Decoder;

import javax.crypto.Cipher;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
public class SecureEncUtil {
    @Getter
    public static class RsaKeyData {
        private final PublicKey PUBLIC_KEY;
        private final PrivateKey PRIVATE_KEY;

        public RsaKeyData() throws Exception {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");

            generator.initialize(1024);
            KeyPair keyPair = generator.genKeyPair();

            this.PRIVATE_KEY = keyPair.getPrivate();
            this.PUBLIC_KEY = keyPair.getPublic();
        }

        /**
         * RsaKeyData 인스턴스 공개키 스펙 생성
         * @return
         * @throws Exception
         */
        public RsaPublicSpecData getRsaPublicKeySpec() throws Exception {

            RSAPublicKeySpec publicKeySpec = (RSAPublicKeySpec) KeyFactory.getInstance("RSA")
                    .getKeySpec(this.PRIVATE_KEY, RSAPublicKeySpec.class);

            return new RsaPublicSpecData(
                    publicKeySpec.getModulus().toString(16),
                    publicKeySpec.getPublicExponent().toString(16)
            );
        }
    }

    /**
     * publicKey 스펙 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsaPublicSpecData {
        private String modules;
        private String exponent;
    }

    /**
     * Key 파일 확장자 종류
     */
    public enum KeyFileExtEnum {
        DER, PEM;

        public static KeyFileExtEnum getExtEnumByCheckFileName (String fileName) {
            if(!StringUtils.hasLength(fileName)) return null;

            int idx = fileName.lastIndexOf(".");
            if(idx < 0 || (idx + 1 == fileName.length())) return null;

            String ext = fileName.substring(idx + 1);
            switch (ext) {
                case "der":
                    return KeyFileExtEnum.DER;
                case "pem":
                    return KeyFileExtEnum.PEM;
                default:
                    return null;
            }
        }
    }

    public enum KeyFilePrivacyEnum {
        PRIVATE("-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----")
        , PUBLIC("-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----");

        private final String begin;
        private final String end;
        KeyFilePrivacyEnum(String begin, String end) {
            this.begin = begin;
            this.end = end;
        }
        public String getBegin() {return this.begin;}
        public String getEnd() {return this.end;}
    }

    /**
     * RSA Private Key 조회
     * @return
     * @throws Exception
     */
    public static PrivateKey readRsaPrivateKeyFile(String resourceKeyFileName) throws Exception {

        return KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(
                        readKeyFileToByteArray(resourceKeyFileName, KeyFilePrivacyEnum.PRIVATE)
                ));
    }

    /**
     * RSA Public Key Spec 조회
     * @return
     * @throws Exception
     */
    public static RsaPublicSpecData readRsaPublicKeyFileSpec(String resourceKeyFileName) throws Exception {

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(
                readKeyFileToByteArray(resourceKeyFileName, KeyFilePrivacyEnum.PUBLIC)
        ));

        // 공개키 스펙 (modules, expoenet 리턴)
        RSAPublicKeySpec publicKeySpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
        return new RsaPublicSpecData(
                publicKeySpec.getModulus().toString(16),
                publicKeySpec.getPublicExponent().toString(16)
        );
    }

    // 해당 부분은 static util로 쓰기위한 부분이며 다른 파일경로와 달리
    // 실질적으로 프로파일별로 구분하지 않고 사용하기 때문에 특정 고정값을 unmodifiableList로 화이트리스트 생성
    private static final List<String> KEY_FILENAME_WHITELIST =  Collections.unmodifiableList(Arrays.asList(
            "ivt_public_key.pem",
            "ivt_private_key.pem",
            "ivt_public_key.der",
            "ivt_private_key.der"
    ));

    /**
     * Resource 영역 Key File Byte Array로 읽기
     * @param resourceKeyFileName
     * @return
     * @throws Exception
     */
    private static byte[] readKeyFileToByteArray(String resourceKeyFileName,
                                          KeyFilePrivacyEnum keyFilePrivacyEnum) throws Exception {
        // 조회하는 키파일명이 whitelist에 포함되는지 여부 확인
        if(KEY_FILENAME_WHITELIST.stream().noneMatch(resourceKeyFileName::equals)) {
            throw new BizException(StatusCode.COM0008, "암복호화 키파일명 오류");
        }

        // resource 영역의 key 파일 조회
        ClassPathResource resource = new ClassPathResource(resourceKeyFileName);
        byte[] resourceBytes = Files.readAllBytes(Paths.get(resource.getURI()));

        byte[] keyBytes = null;

        KeyFileExtEnum extEnum = KeyFileExtEnum.getExtEnumByCheckFileName(resourceKeyFileName);

        // .der 확장자일 경우 바로 KeyFactory에서 조회 가능
        if(extEnum == KeyFileExtEnum.DER) {
            keyBytes = resourceBytes;
        }

        // .pem 확장자일 경우 문자열 수정 후 base64 디코딩 처리 후 KeyFactory에서 조회 가능
        else if(extEnum == KeyFileExtEnum.PEM) {
            String keyPem = new String(resourceBytes)
                    .replace(keyFilePrivacyEnum.getBegin(), "")
                    .replace(keyFilePrivacyEnum.getEnd(), "");

            keyBytes = new BASE64Decoder().decodeBuffer(keyPem);
        }

        return keyBytes;
    }


    /**
     * hex 문자열로 변환된 암호화 byte 배열을 다시 byte 배열로 변환처리해주기 위함
     * 서버로 전송된 암호화 값은 위에 해당하는 문자열 데이터
     * @param securedValue
     * @return
     */
    public static String decryptRsa(String securedValue, PrivateKey privateKey) throws Exception {
        String decryptedValue = "";
        try{
            Cipher cipher = Cipher.getInstance("RSA");

            byte[] encryptedBytes = hexToByteArray(securedValue);
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            decryptedValue = new String(decryptedBytes, "utf-8"); // 문자 인코딩 주의.
        }catch(Exception e)
        {
            log.error("Error secured value : {}", securedValue);
            log.error("decryptRsa Exception Error : {}", e.getMessage());
            throw e;
        }
        return decryptedValue;
    }
    /**
     * 16진 문자열을 byte 배열로 변환한다.
     */
    public static byte[] hexToByteArray(String hex) {
        if (hex == null || hex.length() % 2 != 0) {
            return new byte[]{};
        }

        byte[] bytes = new byte[hex.length() / 2];
        for (int i = 0; i < hex.length(); i += 2) {
            byte value = (byte)Integer.parseInt(hex.substring(i, i + 2), 16);
            bytes[(int) Math.floor(i / 2)] = value;
        }
        return bytes;
    }
}
