# ReCycle2Feed — Turn Waste Into Care

[![AWS Serverless](https://img.shields.io/badge/AWS-Serverless-orange.svg?logo=amazon-aws)](https://aws.amazon.com)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passing-brightgreen.svg)](https://vitest.dev/)
[![Tour](https://img.shields.io/badge/Bharat%20Builds%20Tour-Event%2002%3A%20Environmental%20Hacks-forest.svg)](https://www.wemakedevs.org/aws/env)

An intelligent, AWS-powered smart reverse-vending and social reward platform designed for the **Waste and Energy** track of the **Bharat Builds Tour / Environmental Hacks 2026** (by WeMakeDevs & AWS).

---

## 1. Problem Statement

In colleges and urban centers across India, millions of empty PET beverage bottles and aluminium cans are discarded in mixed waste streams or left as street litter. Standard recycling bins offer **zero immediate feedback, tangible incentive, or community engagement**.

Simultaneously, community animals (dogs, cats, birds) lack consistent, monitored feeding, often scavenging contaminated dumpsters.

**ReCycle2Feed bridges both challenges through an automated, closed-loop machine:**
1. A citizen deposits an empty, clean PET bottle or aluminium can.
2. Dual sensors (optical Time-of-Flight + inductive metal detection) verify item eligibility.
3. An internal motorized compactor crushes the container to reduce bin volume by 70%.
4. An AWS Serverless microservice enforces bank-grade idempotency to prevent duplicate reward generation.
5. A motorized dispenser releases a calibrated 10g–20g portion of food into a clean community bowl.
6. Real-time mass and feeding activity are immutably logged into an audit ledger.

---

## 2. Target Users

* **Public Kiosk User:** Students and citizens recycling bottles at campus or transit hubs. No account or personal data collection required to deposit.
* **Caretaker / Field Operator:** Campus caretakers monitoring bin fill percentage, checking food hopper levels, sanitizing chutes, and clearing mechanical jams.
* **System Administrator:** Campus sustainability leads auditing environmental impact, viewing DynamoDB ledgers, and configuring acceptance policies.

---

## 3. Technology Stack

### Frontend Application (`/frontend`)
* **Framework:** React 18 with TypeScript and Vite.
* **Styling:** Tailwind CSS with a modern sustainability-technology palette.
* **Icons:** Lucide Icons.
* **Routing:** React Router v6.
* **Storage:** Dual-engine (`localStorage` for zero-setup simulation; REST API client for AWS mode).

### Backend Serverless API (`/backend`)
* **Runtime:** Node.js 20.x on AWS Graviton2 (`arm64`).
* **Compute:** AWS Lambda proxy handling `/api/*` routes.
* **Ingress:** Amazon API Gateway HTTP API v2 with CORS support.
* **Database:** Amazon DynamoDB (On-Demand capacity) with conditional writes for idempotency.
* **Observability:** Amazon CloudWatch Logs and Metrics.
* **Local Development Server:** Express HTTP wrapper running on port 4000.

### Infrastructure-as-Code (`/infrastructure`)
* **Template:** AWS SAM CloudFormation template (`template.yaml`).
* **Cost:** 100% compliant with the AWS Free Tier.

---

## 4. Architecture Diagram

```mermaid
flowchart TD
    subgraph Client & Edge Layer
        User[Public User / Caretaker]
        Kiosk[React + TypeScript Kiosk UI]
        ESP32[ESP32 Edge Microcontroller]
        Sim[In-Browser Deterministic Engine]
    end

    subgraph AWS Cloud Ingress & Compute Layer
        Amplify[Amplify Hosting / CloudFront]
        APIGW[Amazon API Gateway HTTP API v2]
        Lambda[AWS Lambda Handler - Node.js 20.x ARM64]
    end

    subgraph AWS Storage & State Layer
        DDB_Tx[(DynamoDB: Transactions Table)]
        DDB_Mach[(DynamoDB: Machines Table)]
        DDB_Maint[(DynamoDB: Maintenance Table)]
        CW[Amazon CloudWatch Structured Logs]
    end

    User -->|Interacts| Kiosk
    ESP32 -->|Mutual TLS MQTT / HTTPS| APIGW
    Kiosk -->|SIMULATION Mode| Sim
    Kiosk -->|AWS Mode| APIGW
    Amplify -->|Hosts UI Assets| Kiosk
    APIGW -->|Proxy /{proxy+}| Lambda
    Lambda -->|Condition: attribute_not_exists| DDB_Tx
    Lambda -->|Get / Update State & Inventory| DDB_Mach
    Lambda -->|Audit Log| DDB_Maint
    Lambda -->|Logs & Alarms| CW
```

---

## 5. Implementation Status

| Feature / Subsystem | Status | Description |
| :--- | :--- | :--- |
| **8-Step Public Kiosk Journey** | ✅ Implemented & Tested | Interactive item intake, verification, progress animation, receipt, and reset. |
| **Evaluator Test Bench** | ✅ Implemented & Tested | Side drawer simulating full bins (98%), empty food, motor jam, and offline mode. |
| **Impact Analytics Dashboard** | ✅ Implemented & Tested | Real metrics (net mass in kg, accepted vs rejected, portions dispensed). |
| **Transaction Audit Ledger** | ✅ Implemented & Tested | Full-text search, outcome filters, and receipt inspection modal. |
| **Operator Maintenance Console** | ✅ Implemented & Tested | Bin fill gauge, hopper levels, jam clearing, and maintenance logging. |
| **Interactive Hardware Schematic** | ✅ Implemented & Tested | Component-by-component view of ToF sensors, inductive coils, compactor, augers. |
| **AWS Serverless API Microservice** | ✅ Implemented & Tested | Node.js 20.x Lambda router supporting all 10 API endpoints. |
| **DynamoDB Idempotency Engine** | ✅ Implemented & Tested | Conditional writes prevent duplicate rewards on network retries. |
| **AWS SAM Template (`template.yaml`)** | ✅ Implemented & Tested | CloudFormation template for API Gateway, Lambda, DynamoDB, and CloudWatch. |
| **Unit Test Suite (Vitest)** | ✅ Implemented & Tested | 14/14 business logic and safety tests passing. |
| **Physical ESP32 IoT Hardware** | 📋 Planned Hardware | Documented in `docs/hardware-design.md`; simulated in current MVP. |
| **Human Food Sealed-Pack Module** | 📋 Planned Expansion | Future locker module for factory-sealed meal packs; isolated from animal feed. |

---

## 6. How to Run Locally

### Prerequisites
* **Node.js** v20+ or v24+
* **npm** v10+

### Step 1: Clone and install dependencies
```bash
git clone https://github.com/Jtss-ux/recycle2feed.git
cd recycle2feed

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Run Automated Backend Tests
Verify that all 14 business logic and safety checks pass:
```bash
cd backend
npm test
```

### Step 3: Start the Backend Server (Optional for AWS Mode)
```bash
cd backend
npm run build
npm start
# Backend runs at http://localhost:4000
```

### Step 4: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

Open `http://localhost:5173` in your browser. The app runs in **SIMULATION MODE** out of the box with zero configuration!

---

## 7. How Operating Modes Work

### 7.1 Simulation Mode (Default)
* Requires **zero AWS credentials**.
* Runs locally in browser `localStorage`.
* Executes the identical validation, idempotency, inventory deduction, and fault checks as the cloud backend.
* Clearly labeled with an amber `SIMULATION MODE` badge on every screen.

### 7.2 AWS Cloud Mode
* Connects to live Amazon API Gateway HTTP API and AWS Lambda.
* Writes records into Amazon DynamoDB tables (`recycle2feed-transactions-prod`).
* If the backend is unreachable, the UI surfaces genuine network error messages rather than silently fabricating mock data.
* Configurable via the `/settings` page.

---

## 8. AWS SAM Deployment Instructions

To deploy the backend to your own AWS account:

```bash
# 1. Configure AWS credentials
aws configure

# 2. Build backend TypeScript
cd backend
npm run build

# 3. Build SAM artifacts
cd ../infrastructure
sam build

# 4. Deploy SAM stack to ap-south-1 (Mumbai)
sam deploy --guided --stack-name recycle2feed-prod --region ap-south-1

# 5. Note the HttpApiGateway endpoint output, e.g.:
# https://abc123xyz.execute-api.ap-south-1.amazonaws.com

# 6. Configure frontend
# Set VITE_APP_MODE=AWS and VITE_API_BASE_URL=<your-api-endpoint> in frontend/.env
```

---

## 9. Environmental & Social Impact Methodology

* **Measured Mass over Abstract Offsets:** ReCycle2Feed records real net weight measured in grams by intake load cells, deliberately avoiding arbitrary carbon offset formulas.
* **Controlled Portions over Feeding Claims:** We count physical dispensing activations (10g–20g per item). We never claim "X animals fed" because eating habits and stray counts vary in the field.
* **Sanitary Species Isolation:** Dog kibble, cat food, and wild bird seed are kept in hermetically sealed, pest-proof hoppers with silicone gaskets.
* **Human Food Protocol:** Human food assistance is strictly planned as an isolated, temperature-controlled locker for sealed nutrient packs in partnership with local food banks—never dispensed through animal feed chutes.

---

## 10. Repository Structure

```text
recycle2feed/
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ModeBadge, MachineDiagram, CloudDiagram
│   │   ├── pages/             # HomePage, KioskPage, ImpactPage, OperatorPage, HowItWorksPage, SettingsPage
│   │   ├── context/           # AppContext state provider
│   │   ├── services/          # api.ts (Dual mode adapter), mockStorage.ts (Local persistence)
│   │   ├── types/             # Frontend TypeScript interfaces
│   │   ├── App.tsx            # Routes configuration
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Tailwind CSS directives
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── handlers/          # lambdaAdapter.ts, config.ts, health.ts
│   │   ├── services/          # transactionService.ts, machineService.ts, impactService.ts, maintenanceService.ts
│   │   ├── repositories/      # inMemoryRepo.ts, dynamoDbRepo.ts
│   │   ├── validation/        # validator.ts (Input validation)
│   │   ├── types/             # Backend TypeScript interfaces
│   │   └── localServer.ts     # Express development server
│   ├── tests/
│   │   └── backend.test.ts    # 14 Vitest unit tests
│   ├── tsconfig.json
│   └── package.json
├── infrastructure/
│   └── template.yaml          # AWS SAM CloudFormation template
├── docs/
│   ├── architecture.md        # Cloud & software architecture
│   ├── hardware-design.md     # IoT RVM mechanics, sensors, actuators
│   ├── api-reference.md       # REST API reference
│   └── demo-script.md         # 3-minute video recording script
├── .env.example
├── .gitignore
├── README.md
└── SUBMISSION.md
```

---

## 11. Licence & Credits

Built with care for the **Bharat Builds Tour / Environmental Hacks 2026** by WeMakeDevs & AWS.  
Open-source under the MIT Licence.
