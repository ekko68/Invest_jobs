# IBK BOX Invest — Backend API

> The official backend REST API server for **IBK BOX Invest**, a startup investment matching platform by IBK Industrial Bank of Korea.  
> Built on Spring Boot, it handles all core business logic including investment reviews, NDA processing, IR data management, and external platform integrations.

---

## 📌 Project Overview

| Item         | Details                            |
| ------------ | ---------------------------------- |
| Project Name | IBK BOX Invest Backend API         |
| artifactId   | `ibk-box-invest-api`               |
| groupId      | `com.ibk`                          |
| Version      | `1.0.0`                            |
| Packaging    | WAR (external Tomcat deployment)   |
| Build Output | `ibkbox_ivi.war`                   |
| Framework    | Spring Boot `2.5.3`                |
| Java Version | Java 8 (1.8)                       |
| Database     | Tibero 6 (Oracle-compatible RDBMS) |
| ORM / SQL    | MyBatis                            |
| Build Tool   | Maven                              |

---

## 🛠 Tech Stack

### Core Framework

- **Spring Boot** `2.5.3` — Main application framework
- **Spring Security** — Authentication & authorization (JWT-based)
- **Spring Batch** — Scheduled batch job processing
- **Spring AOP** `2.5.2` — Cross-cutting concerns (logging, permission checks)
- **Spring MVC** — REST API endpoint handling

### Data Access

- **MyBatis** `2.2.0` — SQL mapping ORM (with automatic camelCase conversion)
- **Spring JDBC** `2.5.3` — JDBC abstraction layer
- **Tibero 6 JDBC** — IBK in-house DB driver (local system JAR)

### Authentication / Security

- **jjwt** `0.9.1` — JWT token generation and validation
- **jasypt-spring-boot** `3.0.2` — Encrypt sensitive values in configuration files
- **RSA Key Pair** — `ivt_public_key.der` / `ivt_private_key.der` for API communication encryption

### External Integration (FeignClient)

- **Spring Cloud OpenFeign** `3.0.3` — Declarative HTTP client for IBK platform APIs
  - IBK Common Login API (`box-open-api-login`)
  - IBK File API (`box-open-api-file`)
  - IBK Alarm/Notification API (`box-open-api-cm-alarm`)
  - KIPRIS IP Registry API (`box-kipris-api`)
  - IBK Seal/Stamp API (`box-open-api-stamp`)
  - IBK Document API (`box-open-api-doc`)

### Utilities

- **Lombok** — Boilerplate code elimination (`@Data`, `@Builder`, etc.)
- **MapStruct** `1.4.2.Final` — VO/DTO object mapping
- **Apache POI** `3.15` — Excel file generation and parsing (`poi` + `poi-ooxml`)
- **Apache PDFBox** `2.0.18` — PDF file processing (NDA documents, etc.)
- **Commons Lang3** `3.11` — String utilities, serial number generation
- **Commons BeanUtils** `1.9.2` — Bean conversion utilities
- **json-simple** `1.1.1` — JSON processing for data migration

### Mail / Templates

- **Spring Boot Mail** `2.2.6` — Email delivery
- **Thymeleaf** — HTML email template rendering

### API Documentation

- **Springfox Swagger** `3.0.0` — Automatic REST API documentation (`/swagger-ui/`)

---

## 📁 Project Structure

```
Box_Backend_Invest/
├── pom.xml                                 # Maven build configuration
├── mvnw / mvnw.cmd                         # Maven Wrapper scripts
├── lib/                                    # Local library dependencies
│
└── src/
    ├── main/
    │   ├── java/com/ibk/
    │   │   ├── IbkBoxInvestApiApplication.java   # Spring Boot main entry point
    │   │   └── sb/restapi/
    │   │       ├── app/                           # Infrastructure / cross-cutting config
    │   │       │   ├── annotation/                # Custom annotations
    │   │       │   ├── aop/                       # AOP aspects (logging, auth interceptors)
    │   │       │   ├── config/                    # Spring configuration classes
    │   │       │   │   ├── AppConfig.java
    │   │       │   │   ├── BatchConfig.java
    │   │       │   │   ├── DBConfiguration.java   # DataSource / MyBatis config
    │   │       │   │   ├── JasyptConfig.java       # Property encryption config
    │   │       │   │   ├── MvcConfig.java         # MVC / CORS configuration
    │   │       │   │   ├── SecurityConfig.java    # Spring Security + JWT filter chain
    │   │       │   │   ├── SwaggerConfig.java     # Swagger / OpenAPI config
    │   │       │   │   ├── feign/                 # FeignClient configurations
    │   │       │   │   └── httpentity/            # Common HTTP entity definitions
    │   │       │   └── common/
    │   │       │       ├── constant/              # System-wide constants
    │   │       │       ├── exception/             # Global exception handling
    │   │       │       ├── jwt/                   # JWT token utilities
    │   │       │       ├── login/                 # Login processing logic
    │   │       │       ├── util/                  # Shared utility classes
    │   │       │       └── vo/                    # Common value objects (response wrappers, etc.)
    │   │       │
    │   │       └── biz/                           # Business domain layer
    │   │           ├── api/                       # REST API controllers
    │   │           │   ├── admin/                 # Admin API
    │   │           │   ├── batch/                 # Batch trigger API
    │   │           │   ├── bizrno/                # Business registration number API
    │   │           │   ├── common/                # Common codes / file / alarm API
    │   │           │   ├── company/               # Company info API
    │   │           │   ├── consult/               # Consulting API
    │   │           │   ├── fncn/                  # Financial business program API
    │   │           │   ├── fund/                  # Fund proposal API
    │   │           │   ├── main/                  # Main page API
    │   │           │   ├── mypage/                # My page API
    │   │           │   ├── prplcm/                # IBK Proposal Center API
    │   │           │   ├── support/               # Customer support API
    │   │           │   ├── test/                  # Test/debug API
    │   │           │   ├── vc/                    # Investor (VC) API
    │   │           │   └── vncmloan/              # Venture loan API
    │   │           │
    │   │           └── service/                   # Service layer (business logic)
    │   │               ├── admin/
    │   │               ├── audit/                 # Investment review service
    │   │               ├── banner/                # Banner service
    │   │               ├── batch/                 # Batch job service
    │   │               ├── common/                # Common service
    │   │               ├── company/               # Company service
    │   │               ├── consult/               # Consulting service
    │   │               ├── fncn/                  # Financial business service
    │   │               ├── fund/                  # Fund proposal service
    │   │               ├── ir/                    # IR data service
    │   │               ├── kipris/                # KIPRIS IP registry service
    │   │               ├── message/               # Messaging service
    │   │               ├── nda/                   # NDA service
    │   │               ├── platform/              # IBK platform integration service
    │   │               ├── prplcm/                # Proposal center service
    │   │               ├── seal/                  # Electronic seal service
    │   │               ├── support/               # Customer support service
    │   │               ├── user/                  # User service
    │   │               ├── vc/                    # Investor (VC) service
    │   │               └── vncmloan/              # Venture loan service
    │   │
    │   ├── resources/
    │   │   ├── application.properties             # Common configuration
    │   │   ├── application-dev.properties         # Development environment config
    │   │   ├── application-stage.properties       # Staging environment config
    │   │   ├── application-prod.properties        # Production environment config
    │   │   ├── messages.properties                # Common message definitions
    │   │   ├── ivt_public_key.der / .pem          # RSA public key
    │   │   ├── ivt_private_key.der / .pem         # RSA private key
    │   │   └── database/mappers/                  # MyBatis XML mapper files
    │   │       ├── admin/
    │   │       ├── audit/
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
    │       └── tibero6-jdbc-14.jar                # Tibero JDBC driver (system scope)
    │
    └── test/                                      # Unit & integration tests
```

---

## 🌐 Key API Domains

### Authentication & Common

| Endpoint                            | Description            |
| ----------------------------------- | ---------------------- |
| `POST /api/login`                   | User login             |
| `POST /api/login/logout`            | User logout            |
| `GET /api/login/jwt/check`          | JWT token validation   |
| `GET /api/common/code/all`          | Fetch all common codes |
| `POST /api/file/upload`             | File upload            |
| `GET /api/file/download`            | File download          |
| `GET /api/common/alarm/invest/list` | Notification list      |

### Company Information

| Endpoint                               | Description                  |
| -------------------------------------- | ---------------------------- |
| `GET /api/company/info/list`           | Company list                 |
| `GET /api/company/info/detail`         | Company detail               |
| `POST /api/company/business/ask`       | Business inquiry request     |
| `POST /api/company/like/toggle/save`   | Toggle company like          |
| `POST /api/company/audit/suggest/save` | Investment review suggestion |

### Investor (VC)

| Endpoint                               | Description               |
| -------------------------------------- | ------------------------- |
| `GET /api/vc/info/list`                | Investor list             |
| `GET /api/vc/info/detail`              | Investor detail           |
| `GET /api/vc/portfolio/list`           | Portfolio list            |
| `POST /api/vc/audit/request/save`      | Investment review request |
| `GET /api/vc/audit/company/ir/preview` | IR data preview           |

### My Page — Company

| Endpoint                                  | Description                        |
| ----------------------------------------- | ---------------------------------- |
| `POST /api/my/company/basic/info/save`    | Register/update basic info         |
| `POST /api/my/company/ir/basic/save`      | Register/update IR basic info      |
| `GET /api/my/company/audit/receive/list`  | Received investment review list    |
| `GET /api/my/company/nda/receive/list`    | Received NDA list                  |
| `GET /api/my/company/kipris/ip/list`      | IP (patent/trademark) list         |
| `POST /api/my/company/vc/convert/request` | Request investor status conversion |

### My Page — Investor (VC)

| Endpoint                                  | Description                     |
| ----------------------------------------- | ------------------------------- |
| `POST /api/my/vc/basic/info/save`         | Register/update basic info      |
| `POST /api/my/vc/portfolio/save`          | Register/update portfolio       |
| `GET /api/my/vc/audit/receive/list`       | Received investment review list |
| `POST /api/my/vc/audit/evaluate/complete` | Complete investment review      |
| `GET /api/my/vc/audit/excel/list`         | Export review list to Excel     |

### IBK Proposal Center / Fund / Venture Loan

| Endpoint                       | Description                                |
| ------------------------------ | ------------------------------------------ |
| `GET /api/prplcm/list`         | Investment company recommendation history  |
| `POST /api/prplcm/save`        | Register investment company recommendation |
| `POST /api/fund/info/save`     | Fund proposal Step 1 save                  |
| `GET /api/vncmloan/prpl/list`  | Venture loan recommendation history        |
| `POST /api/vncmloan/aplc/save` | Venture loan application save              |

### Customer Support

| Endpoint                       | Description       |
| ------------------------------ | ----------------- |
| `GET /api/support/notice/list` | Notice board list |
| `GET /api/support/qa/list`     | Q&A list          |
| `POST /api/support/qa/save`    | Submit Q&A        |

---

## ⚙️ Environment Configuration

### Spring Profiles

The application uses Spring Boot profiles to separate environments.

| File                           | Profile  | Port   | Purpose                |
| ------------------------------ | -------- | ------ | ---------------------- |
| `application.properties`       | (common) | —      | Shared configuration   |
| `application-dev.properties`   | `dev`    | `7301` | Local development      |
| `application-stage.properties` | `stage`  | —      | Staging environment    |
| `application-prod.properties`  | `prod`   | —      | Production environment |

### Key Configuration Properties

```properties
# Database (Tibero)
spring.datasource.hikari.driver-class-name=com.tmax.tibero.jdbc.TbDriver
spring.datasource.hikari.jdbc-url=jdbc:tibero:thin:@<HOST>:<PORT>:<SID>

# JWT
jwt.secretKey=<secret>
jwt.validity=300000          # Token lifetime in ms (5 minutes default)

# RSA Key Files
rsa.resource.public-key.file-name=ivt_public_key.der
rsa.resource.private-key.file-name=ivt_private_key.der

# Jasypt Encryption
jasypt.encryptor.bean=jasyptStringEncryptor
jasypt.encryptor.password=<seed>
jasypt.encryptor.algorithm=PBEWithMD5AndDES

# File Upload Paths
com.ibk.api.upload.img.path=<image upload path>
com.ibk.api.upload.doc.path=<document upload path>
com.ibk.api.upload.nda.path=<NDA upload path>

# File Size Limits
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# IBK Platform Integration
feign.box-open-api.url=<IBK Platform API URL>
feign.ivt-api.key=<Invest Box API Key>
```

---

## 🚀 Build & Deployment

### Prerequisites

- Java 8 (JDK 1.8)
- Maven 3.x
- Tibero 6 JDBC driver (`src/main/webapp/WEB-INF/lib/tibero6-jdbc-14.jar`)

### Build

```bash
# Development build
./mvnw clean package -P dev

# Production build
./mvnw clean package -P prod

# Output: target/ibkbox_ivi.war
```

### Run Locally (Development)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Deploy to External Tomcat

1. Copy `target/ibkbox_ivi.war` to Tomcat's `webapps/` directory
2. Start Tomcat (`startup.sh` / `startup.bat`)

---

## 🏗 Architecture

### Layer Architecture

```
[Client / Frontend]
        ↓  HTTP/HTTPS
[SecurityConfig + JWT Filter]    ← Spring Security authentication & authorization
        ↓
[REST Controller (api/)]         ← Receive requests, return responses
        ↓
[Service Layer (service/)]       ← Business logic processing
        ↓
[MyBatis Mapper + XML]           ← SQL execution
        ↓
[Tibero DB]
```

### Security Flow

```
Incoming Request
  → JWT Token Validation (SecurityConfig.java)
  → RSA Decryption (ivt_private_key.der)
  → Jasypt Config Decryption (ENC(...) values)
  → Spring Security Role Authorization
  → Controller Entry
```

### External API Integration Flow

```
Service Layer
  → FeignClient (platform/service)
      → IBK Platform APIs (box-open-api-*)
          → Login / File / Alarm / Seal / Document
      → KIPRIS API
          → IP lookup (Patent, Trademark, Design)
```

---

## 📂 Business Domain Summary

| Domain     | Package            | Description                                                            |
| ---------- | ------------------ | ---------------------------------------------------------------------- |
| `audit`    | `service/audit`    | Investment review — request, progress, completion                      |
| `ir`       | `service/ir`       | IR data — basic info, financials, history, shareholders, key personnel |
| `nda`      | `service/nda`      | NDA lifecycle — registration, signing, rejection + PDF generation      |
| `kipris`   | `service/kipris`   | KIPRIS API integration for IP asset lookup                             |
| `fund`     | `service/fund`     | IBK fund proposal (Steps 1–3)                                          |
| `prplcm`   | `service/prplcm`   | IBK Proposal Center — investment company recommendations               |
| `vncmloan` | `service/vncmloan` | IBK Venture Loan — recommendation & application processing             |
| `fncn`     | `service/fncn`     | Financial business program applications                                |
| `banner`   | `service/banner`   | Banner management for main & my page                                   |
| `seal`     | `service/seal`     | Electronic seal registration & lookup                                  |
| `message`  | `service/message`  | Company ↔ Investor messaging                                           |
| `platform` | `service/platform` | IBK platform common API integration                                    |
| `batch`    | `service/batch`    | Scheduled batch jobs (Spring Batch)                                    |

---

## 🔌 External System Integrations

| System                  | FeignClient Name        | Purpose                                  |
| ----------------------- | ----------------------- | ---------------------------------------- |
| IBK Platform Login      | `box-open-api-login`    | SSO authentication                       |
| IBK File Server         | `box-open-api-file`     | File upload / download                   |
| IBK Notification System | `box-open-api-cm-alarm` | Push notification delivery               |
| IBK Seal System         | `box-open-api-stamp`    | Electronic seal processing               |
| IBK Document Server     | `box-open-api-doc`      | NICE / INFOTECH simple document scraping |
| KIPRIS                  | `box-kipris-api`        | Patent / trademark / design IP lookup    |
| IBK Account System      | `box-open-api-account`  | Account information lookup               |

---

## 👥 User Types

| Type              | Code    | Description                                       |
| ----------------- | ------- | ------------------------------------------------- |
| **Company**       | company | Startups seeking investment                       |
| **Investor (VC)** | vc      | Venture capital firms and investment institutions |
| **Admin**         | admin   | IBK internal platform operators                   |

---

## 🗃 Database

- **DBMS**: Tibero 6 (Oracle-compatible)
- **Connection Pool**: HikariCP
- **SQL Mapper**: MyBatis XML (automatic camelCase conversion enabled)
- **Mapper Location**: `src/main/resources/database/mappers/`

---

> ⚠️ This project is an internal service of IBK Industrial Bank of Korea.
