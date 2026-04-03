package com.ibk.sb.restapi.app.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
public class JwtTokenUtil {

    // secretKey
    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.validity}")
    private long TOKEN_VALIDITY;

    /**
     * jwt 토큰 작성
     */
    public String makeJwt(String lgnMnbrId, String usisId) throws Exception {

        try {
            //token Header 생성
            Map<String, Object> headerMap = new HashMap<String, Object>();
            headerMap.put("typ", "JWT");
            headerMap.put("alg", "HS256");

            //token Claims 생성
            Map<String, Object> claims = new HashMap<>();
            claims.put("USERID", lgnMnbrId);
            claims.put("UTLINSTTID", usisId);

            @SuppressWarnings("deprecation")
            JwtBuilder builder = Jwts.builder().setHeader(headerMap)
                    .setClaims(claims)
                    .setSubject(lgnMnbrId) // 유효검증용 subject 설정
                    .setIssuedAt(new Date(System.currentTimeMillis())) //생성일
                    .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY)) //만료일
                    .signWith(SignatureAlgorithm.HS256, secretKey);

            String jwtToken = builder.compact();

            return jwtToken;

        } catch (Exception e) {
            log.error("Fail Trace : ", e);
            throw e;
        }
    }

    /**
     * jwt Claim 확인
     * @param token
     * @return
     */
    public Map<String, String> getClaimFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        Map<String, String> claimsMap = new HashMap<>();
        for(Map.Entry<String, Object> entry : claims.entrySet()) {
            claimsMap.put(entry.getKey(), entry.getValue().toString());
        }
        return claimsMap;
    }

    /**
     * jwt Claim 확인
     * @param token
     * @return
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }
}
