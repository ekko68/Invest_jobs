# IBK 투자박스 (IBK BOX Invest) - Backend API

> IBK기업은행의 스타트업 투자 매칭 플랫폼 **투자박스(BOX)** 의 백엔드 REST API 서버입니다.  
> Spring Boot 기반으로 구현되었으며, 기업(스타트업)과 투자자(VC) 간의 투자 심사, NDA, IR 자료 등 모든 핵심 비즈니스 로직을 처리합니다.

---

## 📌 프로젝트 개요

| 항목         | 내용                       |
| ------------ | -------------------------- |
| 프로젝트명   | IBK BOX Invest Backend API |
| artifactId   | `ibk-box-invest-api`       |
| groupId      | `com.ibk`                  |
| 버전         | `1.0.0`                    |
| 패키징       | WAR (외장 Tomcat 배포)     |
| 빌드 파일명  | `ibkbox_ivi.war`           |
| 프레임워크   | Spring Boot `2.5.3`        |
| Java 버전    | Java 8 (1.8)               |
| 데이터베이스 | Tibero 6 (Oracle 호환)     |
| ORM / SQL    | MyBatis                    |
| 빌드 도구    | Maven                      |

---

## 🛠 기술 스택

### Core Framework

- **Spring Boot** `2.5.3` — 메인 애플리케이션 프레임워크
- **Spring Security** — 인증/인가 처리 (JWT 기반)
- **Spring Batch** — 배치 작업 처리
- **Spring AOP** `2.5.2` — 공통 관심사 분리 (로깅, 권한 체크 등)
- **Spring MVC** — REST API 엔드포인트 처리

### 데이터 접근

- **MyBatis** `2.2.0` — SQL 매핑 ORM (Camel Case 자동 변환)
- **Spring JDBC** `2.5.3` — JDBC 추상화 레이어
- **Tibero 6 JDBC** — IBK 내부 DB 드라이버 (로컬 시스템 JAR)

### 인증 / 보안

- **jjwt** `0.9.1` — JWT 토큰 생성 및 검증
- **jasypt-spring-boot** `3.0.2` — 설정 파일 민감 정보 암호화 (Jasypt)
- **RSA 키 쌍** — `ivt_public_key.der` / `ivt_private_key.der` (API 통신 암호화)

### 외부 연동 (FeignClient)

- **Spring Cloud OpenFeign** `3.0.3` — IBK 플랫폼 API 연동 HTTP 클라이언트
  - IBK 공통 로그인 API (`box-open-api-login`)
  - IBK 파일 API (`box-open-api-file`)
  - IBK 알림 API (`box-open-api-cm-alarm`)
  - KIPRIS 지적재산권 API (`box-kipris-api`)
  - IBK 인감 API (`box-open-api-stamp`)
  - IBK 문서 API (`box-open-api-doc`)

### 유틸리티

- **Lombok** — 보일러플레이트 코드 제거 (`@Data`, `@Builder` 등)
- **MapStruct** `1.4.2.Final` — VO/DTO 객체 매핑
- **Apache POI** `3.15` — 엑셀 파일 생성 및 파싱 (`poi` + `poi-ooxml`)
- **Apache PDFBox** `2.0.18` — PDF 파일 처리 (NDA 등)
- **Commons Lang3** `3.11` — 문자열 유틸리티, 일련번호 생성
- **Commons BeanUtils** `1.9.2` — Bean 변환 유틸리티
- **json-simple** `1.1.1` — 데이터 이관용 JSON 처리

### 메일 / 템플릿

- **Spring Boot Mail** `2.2.6` — 이메일 발송
- **Thymeleaf** — 메일 HTML 템플릿 렌더링

### API 문서

- **Springfox Swagger** `3.0.0` — REST API 자동 문서화 (`/swagger-ui/`)

---

## 📁 프로젝트 구조

```
Box_Backend_Invest/
├── pom.xml                            # Maven 빌드 설정
├── mvnw / mvnw.cmd                    # Maven Wrapper
├── lib/                               # 로컬 라이브러리
│
└── src/
    ├── main/
    │   ├── java/com/ibk/
    │   │   ├── IbkBoxInvestApiApplication.java   # Spring Boot 메인 클래스
    │   │   └── sb/restapi/
    │   │       ├── app/                           # 인프라 / 공통 설정
    │   │       │   ├── annotation/                # 커스텀 어노테이션
    │   │       │   ├── aop/                       # AOP (로깅, 권한 인터셉터)
    │   │       │   ├── config/                    # Spring 설정 클래스
    │   │       │   │   ├── AppConfig.java
    │   │       │   │   ├── BatchConfig.java
    │   │       │   │   ├── DBConfiguration.java   # DataSource / MyBatis 설정
    │   │       │   │   ├── JasyptConfig.java       # 암호화 설정
    │   │       │   │   ├── MvcConfig.java         # MVC / CORS 설정
    │   │       │   │   ├── SecurityConfig.java    # Spring Security / JWT 필터
    │   │       │   │   ├── SwaggerConfig.java     # Swagger 설정
    │   │       │   │   ├── feign/                 # FeignClient 설정
    │   │       │   │   └── httpentity/            # HTTP 엔티티 공통 정의
    │   │       │   └── common/
    │   │       │       ├── constant/              # 시스템 상수
    │   │       │       ├── exception/             # 공통 예외 처리
    │   │       │       ├── jwt/                   # JWT 토큰 유틸리티
    │   │       │       ├── login/                 # 로그인 처리 로직
    │   │       │       ├── util/                  # 공통 유틸리티
    │   │       │       └── vo/                    # 공통 VO (응답 형식 등)
    │   │       │
    │   │       └── biz/                           # 비즈니스 도메인 레이어
    │   │           ├── api/                       # REST API 컨트롤러
    │   │           │   ├── admin/                 # 관리자 API
    │   │           │   ├── batch/                 # 배치 API
    │   │           │   ├── bizrno/                # 사업자번호 API
    │   │           │   ├── common/                # 공통 코드/파일/알림 API
    │   │           │   ├── company/               # 기업 정보 API
    │   │           │   ├── consult/               # 컨설팅 API
    │   │           │   ├── fncn/                  # 금융사업 공모 API
    │   │           │   ├── fund/                  # 펀드 제안 API
    │   │           │   ├── main/                  # 메인 화면 API
    │   │           │   ├── mypage/                # 마이페이지 API
    │   │           │   ├── prplcm/                # IBK 제안센터 API
    │   │           │   ├── support/               # 고객지원 API
    │   │           │   ├── test/                  # 테스트 API
    │   │           │   ├── vc/                    # 투자기관 API
    │   │           │   └── vncmloan/              # 벤처대출 API
    │   │           └── service/                   # 서비스 레이어 (비즈니스 로직)
    │   │               ├── admin/
    │   │               ├── audit/                 # 투자심사 서비스
    │   │               ├── banner/                # 배너 서비스
    │   │               ├── batch/                 # 배치 서비스
    │   │               ├── common/                # 공통 서비스
    │   │               ├── company/               # 기업 서비스
    │   │               ├── consult/               # 컨설팅 서비스
    │   │               ├── fncn/                  # 금융사업 서비스
    │   │               ├── fund/                  # 펀드 서비스
    │   │               ├── ir/                    # IR 자료 서비스
    │   │               ├── kipris/                # KIPRIS 지재권 서비스
    │   │               ├── message/               # 메시지 서비스
    │   │               ├── nda/                   # NDA 서비스
    │   │               ├── platform/              # IBK 플랫폼 연동 서비스
    │   │               ├── prplcm/                # 제안센터 서비스
    │   │               ├── seal/                  # 인감 서비스
    │   │               ├── support/               # 고객지원 서비스
    │   │               ├── user/                  # 사용자 서비스
    │   │               ├── vc/                    # 투자기관 서비스
    │   │               └── vncmloan/              # 벤처대출 서비스
    │   │
    │   ├── resources/
    │   │   ├── application.properties             # 공통 설정
    │   │   ├── application-dev.properties         # 개발 환경 설정
    │   │   ├── application-stage.properties       # 스테이징 환경 설정
    │   │   ├── application-prod.properties        # 운영 환경 설정
    │   │   ├── messages.properties                # 공통 메시지 정의
    │   │   ├── ivt_public_key.der / .pem          # RSA 공개키
    │   │   ├── ivt_private_key.der / .pem         # RSA 개인키
    │   │   └── database/mappers/                  # MyBatis XML 매퍼
    │   │       ├── admin/
    │   │       ├── audit/                         # 투자심사 쿼리
    │   │       ├── batch/
    │   │       ├── common/
    │   │       ├── company/
    │   │       ├── consult/
    │   │       ├── fncn/
    │   │       ├── fund/
    │   │       ├── ir/
    │   │       ├── message/
    │   │       ├── nda/
    │   │       ├── platform/
    │   │       ├── prplcm/
    │   │       ├── user/
    │   │       ├── vc/
    │   │       └── vncmloan/
    │   │
    │   └── webapp/WEB-INF/lib/
    │       └── tibero6-jdbc-14.jar                # Tibero JDBC 드라이버
    │
    └── test/                                      # 단위 테스트
```

---

## 🌐 주요 API 도메인

### 공통

| 경로                                | 설명                 |
| ----------------------------------- | -------------------- |
| `POST /api/login`                   | 로그인               |
| `POST /api/login/logout`            | 로그아웃             |
| `GET /api/login/jwt/check`          | JWT 토큰 유효성 확인 |
| `GET /api/common/code/all`          | 전체 공통 코드 조회  |
| `POST /api/file/upload`             | 파일 업로드          |
| `GET /api/file/download`            | 파일 다운로드        |
| `GET /api/common/alarm/invest/list` | 알림 목록 조회       |

### 기업 정보

| 경로                                   | 설명             |
| -------------------------------------- | ---------------- |
| `GET /api/company/info/list`           | 기업 목록 조회   |
| `GET /api/company/info/detail`         | 기업 상세 조회   |
| `POST /api/company/business/ask`       | 사업문의 요청    |
| `POST /api/company/like/toggle/save`   | 기업 좋아요 토글 |
| `POST /api/company/audit/suggest/save` | 투자심사 제안    |

### 투자기관 (VC)

| 경로                                   | 설명                 |
| -------------------------------------- | -------------------- |
| `GET /api/vc/info/list`                | 투자기관 목록 조회   |
| `GET /api/vc/info/detail`              | 투자기관 상세 조회   |
| `GET /api/vc/portfolio/list`           | 포트폴리오 목록 조회 |
| `POST /api/vc/audit/request/save`      | 투자심사 요청        |
| `GET /api/vc/audit/company/ir/preview` | IR 미리보기          |

### 마이페이지 - 기업

| 경로                                      | 설명                  |
| ----------------------------------------- | --------------------- |
| `POST /api/my/company/basic/info/save`    | 기본정보 등록/수정    |
| `POST /api/my/company/ir/basic/save`      | IR 기본정보 등록/수정 |
| `GET /api/my/company/audit/receive/list`  | 받은 투자심사 목록    |
| `GET /api/my/company/nda/receive/list`    | 받은 NDA 목록         |
| `GET /api/my/company/kipris/ip/list`      | 지적재산권 목록       |
| `POST /api/my/company/vc/convert/request` | 투자사 전환 요청      |

### 마이페이지 - 투자사

| 경로                                      | 설명                    |
| ----------------------------------------- | ----------------------- |
| `POST /api/my/vc/basic/info/save`         | 기본정보 등록/수정      |
| `POST /api/my/vc/portfolio/save`          | 포트폴리오 등록/수정    |
| `GET /api/my/vc/audit/receive/list`       | 받은 투자심사 목록      |
| `POST /api/my/vc/audit/evaluate/complete` | 투자심사 완료 처리      |
| `GET /api/my/vc/audit/excel/list`         | 심사 목록 엑셀 다운로드 |

### IBK 제안센터 / 펀드 / 벤처대출

| 경로                           | 설명                    |
| ------------------------------ | ----------------------- |
| `GET /api/prplcm/list`         | 투자기업 추천 이력 조회 |
| `POST /api/prplcm/save`        | 투자기업 추천 등록      |
| `POST /api/fund/info/save`     | 펀드 제안 Step1 저장    |
| `GET /api/vncmloan/prpl/list`  | 벤처대출 추천 내역 조회 |
| `POST /api/vncmloan/aplc/save` | 벤처대출 신청 저장      |

### 고객지원

| 경로                           | 설명               |
| ------------------------------ | ------------------ |
| `GET /api/support/notice/list` | 공지사항 목록 조회 |
| `GET /api/support/qa/list`     | Q&A 목록 조회      |
| `POST /api/support/qa/save`    | Q&A 등록           |

---

## ⚙️ 환경 설정

### 환경 프로파일

Spring Boot Profile 기반으로 환경을 분리합니다.

| 파일                           | 프로파일 | 포트   | 용도          |
| ------------------------------ | -------- | ------ | ------------- |
| `application.properties`       | (공통)   | —      | 공통 설정     |
| `application-dev.properties`   | `dev`    | `7301` | 개발 환경     |
| `application-stage.properties` | `stage`  | —      | 스테이징 환경 |
| `application-prod.properties`  | `prod`   | —      | 운영 환경     |

### 주요 설정 항목

```properties
# DB (Tibero)
spring.datasource.hikari.driver-class-name=com.tmax.tibero.jdbc.TbDriver
spring.datasource.hikari.jdbc-url=jdbc:tibero:thin:@<HOST>:<PORT>:<SID>

# JWT
jwt.secretKey=<비밀키>
jwt.validity=300000          # 토큰 유효시간 (ms) - 기본 5분

# RSA 키 파일
rsa.resource.public-key.file-name=ivt_public_key.der
rsa.resource.private-key.file-name=ivt_private_key.der

# Jasypt 암호화
jasypt.encryptor.bean=jasyptStringEncryptor
jasypt.encryptor.password=<암호화 시드>
jasypt.encryptor.algorithm=PBEWithMD5AndDES

# 파일 업로드 경로
com.ibk.api.upload.img.path=<이미지 경로>
com.ibk.api.upload.doc.path=<문서 경로>
com.ibk.api.upload.nda.path=<NDA 경로>

# 파일 크기 제한
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# IBK 플랫폼 연동
feign.box-open-api.url=<IBK 플랫폼 API URL>
feign.ivt-api.key=<투자박스 API 키>
```

---

## 🚀 빌드 및 실행

### 사전 요구사항

- Java 8 (JDK 1.8)
- Maven 3.x
- Tibero 6 JDBC 드라이버 (`src/main/webapp/WEB-INF/lib/tibero6-jdbc-14.jar`)

### 빌드

```bash
# 개발 환경 빌드
./mvnw clean package -P dev

# 운영 환경 빌드
./mvnw clean package -P prod

# 빌드 결과물: target/ibkbox_ivi.war
```

### 로컬 실행 (개발)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### 외장 Tomcat 배포

1. `target/ibkbox_ivi.war` 를 Tomcat의 `webapps/` 디렉토리에 복사
2. Tomcat 기동 (`startup.sh` / `startup.bat`)

---

## 🏗 아키텍처

### 계층 구조

```
[Client / Frontend]
        ↓  HTTP/HTTPS
[SecurityConfig + JWT Filter]    ← Spring Security 인증/인가
        ↓
[REST Controller (api/)]        ← 요청 수신, 응답 반환
        ↓
[Service Layer (service/)]      ← 비즈니스 로직 처리
        ↓
[MyBatis Mapper + XML]          ← SQL 처리
        ↓
[Tibero DB]
```

### 보안 구조

```
요청 수신
  → JWT 토큰 검증 (SecurityConfig.java)
  → RSA 복호화 (ivt_private_key.der)
  → Jasypt 설정값 복호화 (ENC(...))
  → Spring Security 권한 확인
  → Controller 진입
```

### 외부 API 연동 구조

```
Service Layer
  → FeignClient (platform/service)
      → IBK 플랫폼 API (box-open-api-*)
          → 로그인 / 파일 / 알림 / 인감 / 문서
      → KIPRIS API
          → 지적재산권 조회 (특허, 상표, 디자인)
```

---

## 📂 주요 도메인 설명

| 도메인     | 패키지             | 설명                                          |
| ---------- | ------------------ | --------------------------------------------- |
| `audit`    | `service/audit`    | 투자심사 요청/진행/완료 처리                  |
| `ir`       | `service/ir`       | IR 자료 (기본정보, 재무, 연혁, 주주, 인력 등) |
| `nda`      | `service/nda`      | NDA 체결 (등록, 서명, 반려) + PDF 생성        |
| `kipris`   | `service/kipris`   | KIPRIS API 연동 지재권 조회                   |
| `fund`     | `service/fund`     | IBK 펀드 제안 (Step 1~3)                      |
| `prplcm`   | `service/prplcm`   | IBK 제안센터 투자기업 추천 이력               |
| `vncmloan` | `service/vncmloan` | IBK 벤처대출 추천/신청 처리                   |
| `fncn`     | `service/fncn`     | 금융사업 공모                                 |
| `banner`   | `service/banner`   | 메인/마이페이지 배너 관리                     |
| `seal`     | `service/seal`     | 전자 인감 등록/조회                           |
| `message`  | `service/message`  | 기업-투자사 간 메시지                         |
| `platform` | `service/platform` | IBK 플랫폼 공통 API 연동                      |
| `batch`    | `service/batch`    | 스케줄 배치 작업 (Spring Batch)               |

---

## 🔌 외부 시스템 연동

| 시스템            | FeignClient             | 용도                     |
| ----------------- | ----------------------- | ------------------------ |
| IBK 플랫폼 로그인 | `box-open-api-login`    | SSO 인증                 |
| IBK 파일 서버     | `box-open-api-file`     | 파일 업로드/다운로드     |
| IBK 알림 시스템   | `box-open-api-cm-alarm` | 푸시 알림 발송           |
| IBK 인감 시스템   | `box-open-api-stamp`    | 전자 인감 처리           |
| IBK 문서 서버     | `box-open-api-doc`      | NICE/INFOTECH 간편서류   |
| KIPRIS            | `box-kipris-api`        | 특허/상표/디자인 IP 조회 |
| IBK 계정계        | `box-open-api-account`  | 계좌 정보 조회           |

---

## 👥 사용자 유형

| 유형           | 코드    | 설명                           |
| -------------- | ------- | ------------------------------ |
| **기업**       | company | 스타트업 / 투자 유치 희망 기업 |
| **투자사(VC)** | vc      | 벤처캐피탈 / 투자기관          |
| **관리자**     | admin   | IBK 내부 운영자                |

---

## 🗃 데이터베이스

- **DBMS**: Tibero 6 (Oracle 호환 RDBMS)
- **Connection Pool**: HikariCP
- **매퍼**: MyBatis XML (카멜케이스 자동 변환 활성화)
- **매퍼 위치**: `src/main/resources/database/mappers/`

---

_본 프로젝트는 IBK기업은행 내부 서비스입니다._
