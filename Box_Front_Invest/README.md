# IBK BOX Invest — Frontend

> The official frontend web application for **IBK BOX Invest**, a startup investment matching platform by IBK Industrial Bank of Korea.  
> The platform connects startups (companies) with venture capital firms (investors) and digitizes the entire investment review process.

---

## 📌 Project Overview

| Item | Details |
|------|---------|
| Project Name | IBK BOX Invest Frontend |
| Package Name | `ibk-box-invest-front` |
| Version | `0.1.0` |
| Framework | React 17 (Create React App) |
| Styling | MUI (Material UI v5) + SCSS |
| State Management | React Context API |
| Routing | React Router DOM v5 |
| HTTP Client | Axios |

---

## 🛠 Tech Stack

### Core
- **React** `^17.0.2` — UI component library
- **react-router-dom** `^5.3.0` — SPA routing with code-splitting & lazy loading
- **Axios** `^0.21.4` — REST API communication
- **env-cmd** `^10.1.0` — Per-environment `.env` file management

### UI / Design
- **@mui/material** `^5.14.15` — Material UI component library
- **@mui/icons-material** `^5.14.16` — MUI icon set
- **@mui/x-date-pickers** `^6.17.0` — Date picker components
- **@emotion/react** / **@emotion/styled** — MUI styling engine
- **node-sass** `^6.0.1` — SCSS compilation
- **swiper** `^8.4.7` — Slider / carousel

### Data & Charts
- **chart.js** `^3.6.2` + **react-chartjs-2** `^4.0.0` — Data visualization
- **chartjs-plugin-datalabels** — Chart data label plugin

### Date & Utilities
- **dayjs** `^1.11.10` / **moment** `^2.29.1` / **date-fns** `^2.28.0` — Date handling
- **jspdf** `^2.5.1` + **html2canvas** `^1.4.1` — PDF export
- **react-beautiful-dnd** `^13.1.0` — Drag and drop support
- **react-device-detect** `^2.0.0` — Device detection (IE browser blocking)

### Developer Tools
- **ESLint** + **Prettier** — Code quality and formatting
- **http-proxy-middleware** `^2.0.1` — API proxy for local development
- **Jest** + **@testing-library/react** — Unit testing

---

## 📁 Project Structure

```
Box_Front_Invest/
├── public/                        # Static assets
│   ├── avatars/                   # Profile images
│   ├── banners/                   # Banner images
│   └── images/                    # UI icons and general images
│
└── src/
    ├── App.js                     # App root — composes Context Providers
    ├── Routing.js                 # Top-level router (Lazy Loading applied)
    │
    ├── _pub/                      # Shared component library
    │   └── components/
    │       ├── atomic/            # Atomic UI elements (Button, Input, Select, Checkbox, etc.)
    │       ├── bt/                # BT custom components (BtModal, BtSelect, BtTabContext, etc.)
    │       └── common/            # Common layout components (Layout, Footer, Tab, etc.)
    │
    ├── modules/                   # Business logic modules
    │   ├── consts/                # Constant definitions
    │   │   ├── Api.js             # REST API endpoint registry
    │   │   ├── RouterConst.js     # Route path name definitions
    │   │   ├── BizConst.js        # Business domain constants
    │   │   └── Regex.js           # Regular expression patterns
    │   ├── contexts/              # React Context (global state)
    │   │   ├── common/            # Common: Login, Code, Theme, Localize, Common
    │   │   ├── company/           # Company context
    │   │   ├── invest/            # Investor context
    │   │   ├── consult/           # Consulting context
    │   │   └── mypage/            # My Page context
    │   ├── routers/               # Domain-level router modules
    │   │   ├── LoginRouter.js
    │   │   ├── MainRouter.js
    │   │   ├── CompanyRouter.js
    │   │   ├── InvestRouter.js
    │   │   ├── MypageRouter.js
    │   │   ├── IbkPrplCntrRouter.js
    │   │   └── ...
    │   └── utils/                 # Utility functions
    │       ├── Axios.js / BoxAxios.js / CommonAxios.js
    │       ├── CommonUtils.js / DateUtils.js / NumberUtils.js
    │       ├── ValidateUtils.js / StringUtils.js
    │       └── CookieUtils.js / FormUtils.js / ...
    │
    ├── pageComponents/            # Page-specific sub-components
    │   └── mypage/
    │       ├── company/           # Company my page components
    │       └── investor/          # Investor my page components
    │
    └── pages/                     # Route-level page components
        ├── main/                  # Main home
        ├── company/               # Company list / detail
        ├── invest/                # Investor list / detail
        ├── consult/               # Consulting request
        ├── event/                 # Events
        ├── customersupport/       # Customer support (notices, Q&A)
        ├── ba/                    # BA-exclusive pages (BA10xxx)
        ├── ibkPrplCntr/           # IBK Proposal Center
        │   ├── fund/              # Fund proposal (Steps 1–3)
        │   ├── vncmloan/          # IBK Venture Loan recommendation
        │   └── fncnBsns/          # Financial business program
        └── mypage/
            ├── company/           # Company My Page
            │   ├── ir/            # IR data management (basic info, financials, history, shareholders, etc.)
            │   ├── myinfo/        # My info (basic info, products, team, video, seal)
            │   ├── request/       # Investment review requests (sent / received)
            │   ├── nda/           # NDA management
            │   ├── message/       # Inbox / outbox
            │   ├── consult/       # Consulting requests
            │   └── vncmloan/      # Venture loan applications
            └── investor/          # Investor (VC) My Page
                ├── myinfo/        # My info (basic info, lead examiner, seal)
                ├── request/       # Investment review requests (sent / received)
                ├── nda/           # NDA management
                ├── message/       # Inbox / outbox
                └── exclusive/     # Investor-exclusive pages
```

---

## 🌐 Key Features

### Public Services
| Menu | Path | Description |
|------|------|-------------|
| Main | `/main` | Banners, latest companies, fund status, investor list |
| Company Info | `/company` | Startup listing & detail (like, business inquiry, investment request) |
| Investors | `/invest` | VC listing & detail (portfolio, lead examiners) |
| Consulting | `/consult` | Consulting application |
| Events | `/event` | Event information |
| Customer Support | `/customersupport` | Notices, Q&A |

### Company (Startup) My Page
| Feature | Path |
|---------|------|
| Dashboard | `/mypage/company` |
| My Info Management | `/mypage/company/info` |
| IR Data Management | `/mypage/company/ir` |
| Investment Review Requests | `/mypage/company/request` |
| NDA Management | `/mypage/company/nda` |
| Consulting Requests | `/mypage/company/consult` |
| Messages | `/mypage/company/message` |
| IBK Venture Loan Application | `/mypage/company/vncmloan` |
| Investor Status Conversion Request | `/mypage/company/info/InvmCnvrsReg` |

### Investor (VC) My Page
| Feature | Path |
|---------|------|
| Dashboard | `/mypage/investor` |
| My Info Management | `/mypage/investor/info` |
| Investment Review Requests | `/mypage/investor/request` |
| NDA Management | `/mypage/investor/nda` |
| Messages | `/mypage/investor/message` |
| Investor-Exclusive Pages | `/mypage/investor/exclusive` |

### IBK Proposal Center (Internal)
| Feature | Path |
|---------|------|
| Proposal Center Main | `/ibkPrplCntr/IbkPrplCntr` |
| Fund Proposal Registration | `/ibkPrplCntr/fund/FundPrplInfoStep` |
| Company Recommendation | `/ibkPrplCntr/PrplCmWriteView` |
| IBK Venture Loan Recommendation | `/ibkPrplCntr/vncmloan/VnentrLonSgshRegView` |
| Financial Business Program | `/ibkPrplCntr/fncnBsns/FncnBsnsPbanList` |

---

## ⚙️ Environment Configuration

### Environment Files
This project uses `env-cmd` to manage per-environment `.env` files.

| File | Purpose |
|------|---------|
| `.env.development` | Local development environment |
| `.env.stage` | Staging environment |
| `.env.production` | Production environment |

### Key Environment Variables
```
REACT_APP_API_URL=           # Backend API server URL
REACT_APP_RENDER_TYPE=       # Runtime type identifier (dev / stage / prod)
REACT_APP_RENDER_VER=        # Build version info
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or above recommended)
- npm

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm start
# Runs: env-cmd -f .env.development react-scripts start
```

### Build
```bash
# Staging build
npm run build-stage

# Production build
npm run build-prod
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint-fix

# Format all files with Prettier
npm run prettier-all
```

### Tests
```bash
npm test
```

---

## 🏗 Architecture Notes

### 1. Global State via Context API
```
App.js → CommonProvider (provider order matters)
  ├─ CompanyProvider
  ├─ ThemeComProvider
  ├─ LocalizeProvider
  ├─ CommonContextProvider   ← Must be initialized before LoginContext
  ├─ LoginContextProvider
  └─ CodeContextProvider
```

### 2. Lazy-Loaded Routers
All router modules are wrapped with `React.lazy()` and `Suspense` for code-splitting, improving initial load performance. A global `<Loading />` spinner is shown as the fallback.

### 3. Development API Proxy
`setupProxy.js` configures a CORS proxy for the Korea Meteorological Administration public API (`apis.data.go.kr`) to handle cross-origin requests during development.

### 4. IE Browser Block
The app uses `react-device-detect` to detect Internet Explorer and immediately renders an "unsupported browser" message, preventing access to the main application.

### 5. Local HTTPS (SSL)
`_wildcard.ibkbox.net+2.pem` and `_wildcard.ibkbox.net+2-key.pem` are included at the project root for local HTTPS development against the `ibkbox.net` domain.

---

## 📂 Component Design Hierarchy

```
Atomic Components  (_pub/components/atomic/)
    ↓  Primitive UI elements — Button, Input, Select, Checkbox, Radio, ...
BT Custom Components  (_pub/components/bt/)
    ↓  Project-specific composite components — BtModal, BtSelect, BtTabContext, ...
Common Layout Components  (_pub/components/common/)
    ↓  Shared layouts — Layout, Footer, Tab, Loading, BreadCrumbs, ...
Page Components  (pageComponents/)
    ↓  Page-scoped composite components assembled from the layers above
Pages  (pages/)
    ↓  Top-level pages with 1:1 route mapping
```

---

## 🔌 External Integrations

| Service | Purpose |
|---------|---------|
| IBK Common Login (`commonLogin.html`) | SSO login integration |
| NICE Scraping | Automated simple document collection |
| INFOTECH Scraping | Authentication key issuance |
| KIPRIS | Patent / trademark / design IP lookup |
| Korea Meteorological Administration API | Weather data (via dev proxy) |
| IBK Branch System | Branch & employee lookup (`/cmi012`, `/cao002`) |

---

## 👥 User Types

| Type | Role |
|------|------|
| **Company** | Startups seeking investment |
| **Investor (VC)** | Venture capital firms and investment institutions |
| **BA (Business Advisor)** | IBK internal staff with dedicated BA10xxx pages |

---

> ⚠️ This project is an internal service of IBK Industrial Bank of Korea.
