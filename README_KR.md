[한국어(Korean)](#-korean) | [English(English)](#-english)

---

# 🇰🇷 Korean

# IBK BOX Invest Platform — Integrated Workspace

> IBK 기업은행의 스타트업 투자 매칭 플랫폼 **IBK BOX Invest**의 연관 프로젝트를 모두 포함하는 통합 워크스페이스입니다.
> 사용자용 프론트엔드, 핵심 비즈니스 로직을 처리하는 백엔드, 그리고 사내 관리자를 위한 운영자 포탈(투자 도메인 한정)로 구성되어 있습니다.

---

## 📌 Workspace Overview

| Project                | Type          | Tech Stack                                   | Description                                                                                                         |
| ---------------------- | ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Box_Invest_Backend** | Java Project  | Spring Boot 2.5.3, Java 8, Tibero 6, MyBatis | 투자 플랫폼의 핵심 비즈니스 로직, 데이터 베이스 접근 및 외부 플랫폼 연동을 담당하는 강력한 REST API 서버            |
| **Box_Invest_Front**   | React Project | React 17, MUI v5, Axios                      | 스타트업(기업) 및 투자자(VC)가 이용하는 메인 사용자용 프론트엔드 웹 애플리케이션                                    |
| **Box_Manager_Front**  | React Project | React                                        | IBK 투자BOX 고도화 시스템의 운영자 포탈 프론트엔드 (본 워크스페이스에서는 **Invest(투자) 관련 도메인**에 집중 적용) |

---

## 🏗 Platform Architecture & Relationship (프로젝트 간 연관성)

이 세 개의 프로젝트는 유기적으로 상호 작용하여 전체 투자 매칭 라이프사이클 환경을 제공합니다.

1. **사용자 인터랙션 (Box_Invest_Front)**
   - 일반 고객(스타트업, VC)이 시스템에 접속하여 IR 정보 등록, 투자 심사 요청, NDA 서명, 펀드 제안 및 벤처 대출 신청 등의 프론트엔드 기능을 수행합니다.
   - Axios를 통해 `Box_Invest_Backend`의 API를 호출하여 고객의 행동 데이터를 처리합니다.

2. **비즈니스 로직 및 데이터 통제 (Box_Invest_Backend)**
   - 프론트엔드(`Box_Invest_Front`) 및 운영자 포탈(`Box_Manager_Front`)로부터 오는 모든 HTTP REST API 요청의 중심 처리를 담당합니다.
   - JWT 기반의 Spring Security 토큰 인증, RSA 데이터 암호화 해독, Tibero DB 트랜잭션을 수행합니다.
   - KIPRIS, IBK 공통 로그인, 문서 전자 도장, 알람(Notification) 등 IBK 외부 레거시/오픈 플랫폼 시스템들과의 통합(FeignClient) 역할을 수행합니다.

3. **플랫폼 통합 추적 및 관리 (Box_Manager_Front - Invest 부문 결합)**
   - IBK 플랫폼 내부 운영자 및 업무 담당자(BA)들이 사용하는 관리자용 프론트엔드 백오피스입니다.
   - **Invest(투자) 도메인 특화**: `Box_Invest_Front`에서 발생하는 회원 가입, 투자 심사 현황, 펀드 및 벤처 대출 접수 현황 등을 모니터링합니다. 백엔드의 기업 인증 및 관리 목적 API(`api/admin/*` 등)를 호출하여 플랫폼의 고객과 데이터를 총괄 통제합니다.

---

## 1. 🖥 Box_Invest_Backend

**IBK BOX Invest Backend API**

- **역할**: 고객(Front) 및 관리자(Manager)의 서비스 요청을 통합 처리하는 핵심 API 백엔드.
- **주요 기술**: Spring Boot 2.5.3, Java 8 (JDK 1.8), Tibero 6 RDBMS, MyBatis 2.2.0.
- **주요 기능**:
  - 기업(Company) 및 투자자(VC) 대상 정보 관리 모델(VO/DTO) 체계.
  - IR 데이터 관리, 비밀유지계약서(NDA) PDF 렌더링, IBK 제안센터 등 비즈니스 요구사항 구현.
  - 메일/알람 전송 및 Batch 스케줄링 처리.
- **구조**: `Controller -> Service -> Mapper/XML -> Tibero DB` 의 표준 계층형 3-tier 아키텍처.

---

## 2. 💻 Box_Invest_Front

**IBK BOX Invest Frontend**

- **역할**: 기업고객(구직/투자유치) 및 벤처캐피털 이용자를 위한 단일 페이지 애플리케이션(SPA).
- **주요 기술**: React 17, MUI (Material UI v5), React Router DOM v5, SCSS.
- **주요 기능**:
  - Context API를 이용한 전역 데이터 상태 관리 및 Lazy Loading을 통한 성능 최적화 컴포넌트 라우팅.
  - 차트 플러그인(Chart.js)을 활용한 투자처 재무 및 IR 정보 시각화.
  - NICE 스크래핑 문서 연동 및 기상청 등 다양한 컴포넌트 모듈 통합 UI/UX 제공.

---

## 3. ⚙️ Box_Manager_Front (Invest Domain Focus)

**IBK 투자BOX고도화 운영자 포탈 프론트엔드**

- **역할**: 사내 업무 효율성 및 플랫폼 운영 통제를 위한 백오피스 프론트엔드.
- **연관성 (Invest Only)**:
  - 본 프론트엔드는 여러 거시적인 플랫폼 운영 도메인 중, **Invest(투자 서비스) 분야**에 관여하여 동작합니다.
  - 사용자 채널(`Box_Invest_Front`)을 통해 등록된 IR 자료, 각종 요청서, 매칭 현황을 승인 혹은 반려하고 전체 통계를 조회할 수 있도록 구성되어 있습니다. `Box_Invest_Backend`의 관리자 리소스를 활용하여 투자 매칭의 운영 무결성을 확립합니다.
- **환경 설정**: Cross-Origin / Secure 통신을 위해 `mkcert`를 활용한 Local HTTPS 웹팩 서버 구동 기반을 가집니다.

---

> ⚠️ 이 통합 워크스페이스 내의 소스 코드는 IBK 기업은행 스핀오프/투자 관련 부서의 자산입니다. 각 상세 시스템을 실행하거나 개발하기 위한 스크립트 도구와 환경 변수 구성은 각 폴더 하위의 개별 `README.md`를 참조하시기 바랍니다.
