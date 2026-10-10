# ReCycle2Feed — Hackathon Project Submission
## Bharat Builds Tour 2026 • Event 02: Environmental Hacks
### Track: Waste and Energy

---

## 1. Project Information
* **Project Name:** ReCycle2Feed
* **Tagline:** Turn Waste Into Care.
* **Project Repository:** https://github.com/Jtss-ux/recycle2feed
* **Interactive Live Demo:** https://jtss-ux.github.io/recycle2feed/
* **Demo Video (YouTube):** https://youtu.be/KCqz4FkRvRI
* **Demo Video File:** `recycle2feed_demo_video.mp4` (Included directly in repository root; 2m 48s Full HD 1080p)

---

## 2. Problem Statement & Real-World Context
In urban centers and university campuses across India, post-consumer PET bottles and aluminium drink cans are frequently dumped in mixed garbage bins or discarded as street litter. The core barrier to source-segregation is that conventional recycling bins offer **zero immediate feedback, tangible incentive, or community engagement**.

Simultaneously, community animals (dogs, cats, birds) suffer from erratic, uncoordinated feeding, often scavenging contaminated garbage piles.

**ReCycle2Feed solves both problems simultaneously** through a closed-loop smart machine:
> **Eligible Recyclable Deposited → Sensor Verified → Compactor Volume Reduced → Idempotent AWS Authorization → Metered Portioned Feed Dispensed → Immutable Environmental Ledger Recorded.**

---

## 3. What Has Actually Been Implemented (MVP Deliverables)

### 3.1 Interactive Public Recycling Kiosk (`/kiosk`)
* Complete 8-step user journey from welcome screen to material verification, animated auger dispensing, digital receipt, and deterministic reset.
* Interactive intake simulation supporting PET bottles, Aluminium cans, Glass bottles, E-waste, and Multi-layer plastics.
* Evaluator Test Bench drawer to simulate real hardware edge cases (full bin >=95%, empty food hopper, motor jam, and offline states).

### 3.2 Impact Analytics & Immutable Ledger (`/impact`)
* Real-world metrics computed directly from recorded events: Total items, accepted vs rejected counts, measured net mass (kg), and portions dispensed.
* **Honest separation:** Total simulated collections vs physically confirmed collections.
* Interactive time-range filters (`24h`, `7d`, `30d`, `all`).
* Transaction audit ledger with full-text search, outcome filters, and receipt inspection.

### 3.3 Caretaker Operator Console (`/operator`)
* Machine health monitoring, heartbeat latency, and safety lockout status.
* Live recycling bin capacity gauge with 95% full lockout threshold.
* Tri-hopper food inventory levels for dog, cat, and bird feed.
* Servicing action form: Operators can record bin emptying, hopper replenishment, sanitization, and clear mechanical jams.

### 3.4 Interactive Engineering Schematics (`/how-it-works`)
* **Physical Hardware Schematic:** Component-by-component breakdown of ToF optical distance sensors, inductive metal sensors, HX711 load cells, rotary compactor stall protection, and FreeRTOS ESP32 tasks.
* **Cloud Architecture Diagram:** Layer-by-layer map of CloudFront, API Gateway HTTP API, AWS Lambda, DynamoDB tables, and CloudWatch.

### 3.5 AWS Serverless Backend & Infrastructure (`/backend`, `/infrastructure`)
* Fully implemented Node.js 20.x TypeScript microservice supporting API Gateway HTTP API v2.
* Automated DynamoDB conditional writes (`attribute_not_exists(eventId)`) guaranteeing absolute idempotency and zero double-rewarding.
* AWS SAM CloudFormation template (`infrastructure/template.yaml`) ready for zero-cost deployment within the AWS Free Tier.
* Comprehensive Vitest suite with **14 out of 14 business logic and safety unit tests passing**.

---

## 4. How AWS Powers ReCycle2Feed

ReCycle2Feed leverages AWS serverless architecture to ensure high reliability, zero idle costs, and bank-grade idempotency:

| AWS Service | Architectural Role | Free Tier / Cost Model |
| :--- | :--- | :--- |
| **Amazon API Gateway (HTTP API v2)** | High-throughput, low-latency REST API ingress for kiosk and IoT devices. | 1 Million requests/month free |
| **AWS Lambda (ARM64 Graviton)** | Stateless business logic router enforcing material policies, rate limits, and safety locks. | 1 Million calls & 3.2M sec/mo free |
| **Amazon DynamoDB** | Single-digit millisecond NoSQL storage for transactions, machine state, and maintenance logs. | 25 GB storage & 25 WCU/RCU free |
| **Amazon CloudWatch** | Structured JSON diagnostic logging, error alarms, and operational metrics. | 5 GB log ingestion free |
| **AWS SAM (Serverless Application Model)** | Reproducible Infrastructure-as-Code for 1-command deployment. | Free tool |

---

## 5. System Honesty & Ethical Disclosures

* **Simulation vs. Live Hardware:** The prototype clearly displays a persistent `ModeBadge`. All in-browser sensor readings, compactor actions, and dispensing steps are honestly labeled as `SIMULATED` unless connected to verified physical IoT hardware.
* **Food Safety & Species Isolation:** Dog kibble, cat food, and bird seeds are kept in strictly isolated, hermetically sealed polypropylene hoppers.
* **Human Food Assistance:** Human food assistance is treated as a future planned expansion requiring separate sealed-pack lockers in partnership with licensed food-banking NGOs—it is **never** dispensed through an animal feed hopper.
* **No Fabricated Carbon Claims:** ReCycle2Feed measures real physical mass (grams and kilograms) and counted portions, deliberately avoiding arbitrary carbon offset formulas.

---

## 6. Sustainable Business & Operational Model

Deploying physical ReCycle2Feed kiosks on campuses and municipal transit centers will be sustained through:
1. **Recycled Material Offtake:** Aggregated, crushed PET #1 and aluminium cans command high scrap value from licensed circular recyclers.
2. **Corporate CSR & Brand Sponsorship:** Pet food brands and consumer brands sponsor kiosk construction and animal kibble inventory in exchange on on-kiosk sponsorship branding.
3. **Campus Sustainability Grants:** University environmental funds offset electricity and caretaker servicing costs.
