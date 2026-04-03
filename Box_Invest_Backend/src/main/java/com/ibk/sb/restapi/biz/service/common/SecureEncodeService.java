package com.ibk.sb.restapi.biz.service.common;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibk.sb.restapi.app.common.util.SecureEncUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.PrivateKey;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SecureEncodeService {

    @Value("${rsa.resource.public-key.file-name}")
    private String rsaPublicKeyFileName;
    @Value("${rsa.resource.private-key.file-name}")
    private String rsaPrivateKeyFileName;

    /**
     * 공개키 파일 모듈 정보 조회
     * @return
     * @throws Exception
     */
    public SecureEncUtil.RsaPublicSpecData searchServerRsaPublicKeyFileSpec() throws Exception {
        return SecureEncUtil.readRsaPublicKeyFileSpec(rsaPublicKeyFileName);
    }

    /**
     * 문자열 개인키 파일 복호화
     * @param encryptedStr
     * @return
     * @throws Exception
     */
    public String decryptByStrRsaPrivateKeyFile(String encryptedStr) throws Exception {
        // 키 파일 -> 오브젝트 생성
        PrivateKey privateKey = SecureEncUtil.readRsaPrivateKeyFile(rsaPrivateKeyFileName);
        return SecureEncUtil.decryptRsa(encryptedStr, privateKey);
    }

    /**
     * 문자열 리스트 개인키 파일 복호화
     * @param encryptedStrList
     * @return
     * @throws Exception
     */
    public List<String> decryptStrListByRsaPrivateKeyFile (List<String> encryptedStrList) throws Exception {
        // 키 파일 -> 오브젝트 생성
        PrivateKey privateKey = SecureEncUtil.readRsaPrivateKeyFile(rsaPrivateKeyFileName);

        // 복호화 리스트 생성
        List<String> decryptedList = new ArrayList<>();
        for(String item : encryptedStrList) decryptedList.add(SecureEncUtil.decryptRsa(item, privateKey));

        return decryptedList;
    }

    /**
     * Map Object 개인키 파일 복호화
     * @param ecryptedFieldMap
     * @return
     * @throws Exception
     */
    public Map<String, String> decryptMapByRsaPrivateKeyFile(Map<String, String> ecryptedFieldMap) throws Exception {
        // 키 파일 -> 오브젝트 생성
        PrivateKey privateKey = SecureEncUtil.readRsaPrivateKeyFile(rsaPrivateKeyFileName);

        // SecureUtil.decryptRsa()에 throw exception이 걸려있어 stream으로 하지 않고 for문 사용
        Map<String, String> decodedMap = new HashMap<>();
        for (String key : ecryptedFieldMap.keySet()) decodedMap.put(key, SecureEncUtil.decryptRsa(ecryptedFieldMap.get(key), privateKey));

        return decodedMap;
    }

    /**
     * Value Object 개인키 복호화
     * <br/> 해당 방식은 1Depth 전체 필드가 암호화 된 VO에만 적용됨
     * @param encryptedAllFieldOneDepthVo
     * @param classInfo
     * @return
     * @param <T>
     * @throws Exception
     */
    public <T> T decryptOneDepthAllFieldVoByRsaPrivateKeyFile(T encryptedAllFieldOneDepthVo, Class<T> classInfo) throws Exception {
        // create mapper instance
        ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        Map<String, String> convertMap = mapper.convertValue(encryptedAllFieldOneDepthVo, Map.class);
        Map<String, String> decodedMap = this.decryptMapByRsaPrivateKeyFile(convertMap);

        return mapper.convertValue(decodedMap, classInfo);
    }
}
