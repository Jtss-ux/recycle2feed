# ReCycle2Feed — 3-Minute Video Demonstration Script
## Bharat Builds Tour 2026: Environmental Hacks Submission

**Target Duration:** Exactly 3:00 minutes (180 seconds)  
**Track:** Waste and Energy  
**Speaker Notes & Screen Direction Guide**

---

## Ready-to-Copy YouTube Submission Metadata

* **Video Title:** `ReCycle2Feed — Turn Waste Into Care | Environmental Hacks 2026 (Bharat Builds Tour)`
* **Video Privacy:** `Unlisted` or `Public` *(Per tour rules: verify link opens in signed-out browser!)*
* **Video Description:**
```text
Project: ReCycle2Feed
Event: Event 02 — Environmental Hacks (Bharat Builds Tour 2026 by WeMakeDevs & AWS)
Track: Waste and Energy
Tagline: Turn Waste Into Care.

ReCycle2Feed is an IoT-enabled smart reverse-vending and social reward platform that connects post-consumer bottle/can recycling directly with measured community animal welfare and food assistance.

Key Highlights:
- Dual-sensor intake verification (Optical ToF + Inductive Metal detection)
- Automated volume compaction with motor stall current safety interlocks
- AWS Serverless backend: Amazon API Gateway HTTP API v2, AWS Lambda (Node.js 20.x ARM64), Amazon DynamoDB conditional writes for zero double-rewarding
- Calibrated 10g-20g species-isolated food dispensing with 5-second cooldown
- Built within AWS Free Tier; LocalStack open-source configuration included.

Repository: https://github.com/wemakedevs/recycle2feed
#BharatBuilds #EnvironmentalHacks #AWS #WeMakeDevs #Sustainability
```

---

## 3-Minute Second-by-Second Storyboard

### [0:00 – 0:25] ACT I: The Real-World Environmental Problem
**Visual:** Opening view of campus waste bin overflowing with unsegregated plastic bottles alongside stray community animals searching for food.  
**Narrator (Voiceover):**  
> *"In cities and college campuses across India, recyclable plastic bottles and aluminium cans are discarded in mixed waste streams every single day. Conventional recycling bins collect waste, but give people zero immediate feedback or incentive.*  
> *At the same time, community animals depend on irregular, unmonitored feeding. What if we could bridge source-segregation directly with animal welfare—turning immediate recycling into measurable care?"*

---

### [0:25 – 0:55] ACT II: Meet ReCycle2Feed & System Overview
**Visual:** Screen capture of the ReCycle2Feed homepage (`/`), showing the tagline *"Turn Waste Into Care"*, the Mode Indicator badge, and the 6-step closed-loop diagram.  
**Narrator:**  
> *"This is **ReCycle2Feed**, an AWS-powered smart reverse-vending and social reward platform.*  
> *A student deposits an eligible PET bottle or aluminium can. Dual sensors verify the material, compact it into an internal bin, and trigger an idempotent cloud verification via AWS Lambda.*  
> *Once authorized, a motorized dispenser releases a measured portion of food into a sheltered community feeding bowl.*  
> *Notice our Mode Indicator at the top: every sensor event, collection, and dispense is honestly tagged as either simulated or physically verified."*

---

### [0:55 – 1:35] ACT III: Successful Kiosk Transaction Walkthrough
**Visual:** Navigate to `/kiosk`. Click **"Deposit Recyclable Item / बोतल डालें"**. Select **"PET Plastic Bottle"**, select **"Community Dog Feeding"**, and click **"Confirm & Insert Item"**.  
**Visual Action:** The animated sequence displays: *Checking optical profile... Compactor engaged... Authorizing portion with AWS Lambda... Actuating auger feeder...* Transition to the generated receipt card showing `Event ID: evt-...`, `Measured Mass: 28g`, `Dispensed: SIMULATED (20g portion)`.  
**Narrator:**  
> *"Let's run a live transaction. We select a 28g PET bottle and choose the Community Dog Feeding hopper.*  
> *The kiosk verifies material geometry, confirms compaction, and sends an event to AWS. In seconds, the transaction is verified, 20g of kibble is metered, and an immutable digital receipt is issued.*  
> *If the user refreshes or re-submits the exact same event, our DynamoDB idempotency check prevents duplicate dispensing."*

---

### [1:35 – 2:00] ACT IV: Honest Failure & Safety Handling
**Visual:** Click "Start New Session". Click **"Simulate Faults & Edge Cases"** at the top and select **"Glass Container (Unsupported)"** or **"Simulate Empty Food (0g)"**. Click Submit.  
**Visual Action:** The system immediately displays an honest amber/red outcome: *"Recyclable Accepted, but food inventory was exhausted (0g remaining). Logged for restock"* or *"Item Rejected: Glass containers are unsupported by the compactor mechanism."*  
**Narrator:**  
> *"We never fabricate success. If someone inserts a glass bottle, the optical compactor safety check rejects it with an explanation.*  
> *If the food hopper runs empty, the bottle is collected for recycling, but the system honestly reports that dispensing failed and triggers an alert for the caretaker on the operator console."*

---

### [2:00 – 2:30] ACT V: Impact Analytics & Operator Console
**Visual:** Navigate to `/impact`. Show the **Circular Feasibility & Unit Economics Model** (Crushed PET at ₹38/kg vs feed portion at ₹1.70). Switch time filter from 7d to 30d. Show the measured mass in kilograms and transaction ledger. Then click into `/operator` to show the bin capacity gauge and log a maintenance note.  
**Narrator:**  
> *"Our Impact Dashboard provides an auditable environmental ledger. Instead of arbitrary carbon formulas, we track actual measured mass in kilograms and count real portions dispensed.*  
> *Our Unit Economics model validates financial breakeven: crushed PET scrap yields ₹38/kg, offsetting the ₹1.70 wholesale feed portion.*  
> *On the Operator Console, campus caretakers monitor bin fill capacity, inspect food levels, and log sanitization actions."*

---

### [2:30 – 3:00] ACT VI: AWS Serverless Architecture & The Road Ahead
**Visual:** Navigate to `/how-it-works`. Scroll past the interactive Physical Machine Schematic to the AWS Serverless Architecture diagram. Show the SAM template in code editor (`infrastructure/template.yaml`).  
**Narrator:**  
> *"Under the hood, ReCycle2Feed runs on AWS SAM using API Gateway HTTP API, AWS Lambda on ARM64 Graviton, and Amazon DynamoDB with point-in-time recovery—built entirely within the AWS Free Tier, with LocalStack open-source support.*  
> *Our next milestone is connecting physical ESP32 microcontrollers over AWS IoT Core and piloting at DTU's campus.*  
> *ReCycle2Feed: Turning waste into care. Thank you."*

---

## Recording Tips for Maximum Score

1. **Resolution:** Record in **1080p (1920x1080)** at 60fps or 30fps.
2. **Audio:** Use a clean microphone or wired earphones with minimal ambient noise.
3. **Pacing:** Speak at a steady, confident pace. Do not rush.
4. **Tools:** Use free tools like **OBS Studio** or **Loom** for seamless screen recording.
5. **No Editing Needed:** Since the app flows step-by-step with zero loading delays, this script can be recorded in a single smooth take!
