# IBK BOX Invest Platform — Integrated Workspace

> The comprehensive workspace containing all related projects for **IBK BOX Invest**, a startup investment matching platform by IBK Industrial Bank of Korea.
> It consists of a user frontend, a backend for core business logic, and an operator portal (specifically the Invest domain) for internal admins.

---

## 📌 Workspace Overview

| Project                | Type          | Tech Stack                                   | Description                                                                                                                                         |
| ---------------------- | ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Box_Invest_Backend** | Java Project  | Spring Boot 2.5.3, Java 8, Tibero 6, MyBatis | A powerful REST API server responsible for the platform's core business logic, database access, and integration with external platforms.            |
| **Box_Invest_Front**   | React Project | React 17, MUI v5, Axios                      | The main user-facing frontend web application utilized by startups (companies) and investors (VCs).                                                 |
| **Box_Manager_Front**  | React Project | React                                        | The operator portal frontend for the enhanced IBK Invest BOX system. _(Note: This workspace focuses exclusively on the **Invest-related domain**)_. |

---

## 🏗 Platform Architecture & Relationship

These three projects interact seamlessly to provide a complete investment matching lifecycle environment.

1. **User Interaction (Box_Invest_Front)**
   - General customers (Startups, VCs) access the system to perform frontend functions such as registering IR info, requesting investment reviews, signing NDAs, proposing funds, and applying for venture loans.
   - It calls the `Box_Invest_Backend` APIs via Axios to process user behavior data.

2. **Business Logic & Data Control (Box_Invest_Backend)**
   - Serves as the central hub for processing all HTTP REST API requests coming from both the frontend (`Box_Invest_Front`) and the operator portal (`Box_Manager_Front`).
   - Performs JWT-based Spring Security token authentication, RSA data decryption, and Tibero DB transactions.
   - Integrates with external legacy/open platform systems of IBK (e.g., KIPRIS, common login, electronic seals for documents, and notification alarms) using FeignClient.

3. **Platform Tracking & Management (Box_Manager_Front - Invest Domain Integration)**
   - The back-office frontend used by internal IBK operators and business advisors (BAs).
   - **Invest Domain Focus**: Monitors activities occurring in `Box_Invest_Front`, such as member sign-ups, investment review statuses, and fund/venture loan applications. It comprehensively controls the platform's customers and data by calling backend APIs designated for admin authentication and management (e.g., `api/admin/*`).

---

## 1. 🖥 Box_Invest_Backend

**IBK BOX Invest Backend API**

- **Role**: The core API backend that centrally processes service requests from both customers (Front) and admins (Manager).
- **Core Tech**: Spring Boot 2.5.3, Java 8 (JDK 1.8), Tibero 6 RDBMS, MyBatis 2.2.0.
- **Key Features**:
  - Information management models (VO/DTO) for Companies and Investors (VCs).
  - Implements business requirements like IR data management, NDA PDF rendering, and IBK proposal center features.
  - Handles mail/alarm dispatching and scheduled Batch processing.
- **Architecture**: Standard 3-tier architecture: `Controller -> Service -> Mapper/XML -> Tibero DB`.

---

## 2. 💻 Box_Invest_Front

**IBK BOX Invest Frontend**

- **Role**: A Single Page Application (SPA) for corporate clients (seeking jobs/investments) and venture capitalists.
- **Core Tech**: React 17, MUI (Material UI v5), React Router DOM v5, SCSS.
- **Key Features**:
  - Global state management using Context API and performance-optimized component routing via Lazy Loading.
  - Visualization of financial and IR info for investments using chart plugins (Chart.js).
  - Provides integrated UI/UX with various component modules, including NICE web scraping document linkage and Korea Meteorological Administration API integration.

---

## 3. ⚙️ Box_Manager_Front (Invest Domain Focus)

**IBK Invest BOX Enhancement Operator Portal Frontend**

- **Role**: A back-office frontend designed for internal operational efficiency and platform control.
- **Relationship (Invest Only)**:
  - Operates specifically within the **Invest (Investment Service)** scope among various macro platform management domains.
  - Designed to approve or reject IR materials, requests, and matching statuses registered through the user channel (`Box_Invest_Front`) and view overall statistics. Ensures operational integrity of investment matching utilizing the admin resources from `Box_Invest_Backend`.
- **Environment**: Requires setting up a Local HTTPS Webpack server using `mkcert` for Cross-Origin / Secure communication.

---

> ⚠️ The source code in this integrated workspace is the property of IBK's spin-off/investment-related departments. Please refer to the individual `README.md` in each subfolder for scripts and environment variable configurations required to run or develop each specific system.
