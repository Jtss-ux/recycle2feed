# ReCycle2Feed — 3-Minute Video Demonstration Script
## Bharat Builds Tour 2026: Environmental Hacks Submission

**Target Duration:** Exactly 3:00 minutes (180 seconds)  
**Track:** Waste and Energy  
**Speaker Notes & Screen Direction Guide**

---

### [0:00 – 0:25] ACT I: The Real-World Environmental Problem
**Visual:** Quick opening shots of mixed campus waste bins overflowing with plastic bottles alongside stray community animals searching for food.  
**Narrator (Voiceover):**  
> *"In cities and college campuses across India, recyclable plastic bottles and aluminium cans are discarded in mixed waste streams every single day. Conventional recycling bins collect waste, but give people zero immediate feedback or incentive.*  
> *At the same time, community animals depend on irregular, unmonitored feeding. What if we could bridge source-segregation directly with animal welfare—turning immediate recycling into measurable care?"*

---

### [0:25 – 0:55] ACT II: Meet ReCycle2Feed & System Overview
**Visual:** Switch to screen capture of the ReCycle2Feed homepage (`/`), showing the tagline *"Turn Waste Into Care"*, the Mode Indicator badge, and the 6-step closed-loop diagram.  
**Narrator:**  
> *"This is **ReCycle2Feed**, an AWS-powered smart reverse-vending and social reward platform.*  
> *A student deposits an eligible PET bottle or aluminium can. Dual sensors verify the material, compact it into an internal bin, and trigger an idempotent cloud verification via AWS Lambda.*  
> *Once authorized, a motorized dispenser releases a measured portion of food into a sheltered community feeding bowl.*  
> *Notice our Mode Indicator at the top: every sensor event, collection, and dispense is honestly tagged as either simulated or physically verified."*

---

### [0:55 – 1:35] ACT III: Successful Kiosk Transaction Walkthrough
**Visual:** Navigate to `/kiosk`. Click **"Deposit Recyclable Item"**. Select **"PET Plastic Bottle"**, select **"Community Dog Feeding"**, and click **"Confirm & Insert Item"**.  
**Visual Action:** The animated sequence displays: *Checking optical profile... Compactor engaged... Authorizing portion with AWS Lambda... Actuating auger feeder...* Transition to the generated receipt card showing `Event ID: evt-...`, `Measured Mass: 28g`, `Dispensed: SIMULATED (20g portion)`.  
**Narrator:**  
> *"Let's run a live transaction. We select a 28g PET bottle and choose the Community Dog Feeding hopper.*  
> *The kiosk verifies material geometry, confirms compaction, and sends an event to AWS. In seconds, the transaction is verified, 20g of kibble is metered, and an immutable digital receipt is issued.*  
> *If the user refreshes or re-submits the exact same event, our DynamoDB idempotency check prevents duplicate dispensing."*

---

### [1:35 – 2:00] ACT IV: Honest Failure & Safety Handling
**Visual:** Click "Start New Session". Click **"Simulate Faults"** at the top and select **"Glass Container (Unsupported)"** or **"Simulate Empty Food (0g)"**. Click Submit.  
**Visual Action:** The system immediately displays an honest amber/red outcome: *"Recyclable Accepted, but food inventory was exhausted (0g remaining). Logged for restock"* or *"Item Rejected: Glass containers are unsupported by the compactor mechanism."*  
**Narrator:**  
> *"We never fabricate success. If someone inserts a glass bottle, the optical compactor safety check rejects it with an explanation.*  
> *If the food hopper runs empty, the bottle is collected for recycling, but the system honestly reports that dispensing failed and triggers an alert for the caretaker on the operator console."*

---

### [2:00 – 2:30] ACT V: Impact Analytics & Operator Console
**Visual:** Navigate to `/impact`. Switch the time filter from 7d to 30d. Show the measured mass chart (`kg`), acceptance rate, and transaction ledger. Then click into `/operator` to show the bin capacity gauge and log a maintenance note.  
**Narrator:**  
> *"Our Impact Dashboard provides an auditable environmental ledger. Instead of arbitrary carbon formulas, we track actual measured mass in kilograms and count real portions dispensed.*  
> *On the Operator Console, campus caretakers monitor bin fill capacity, inspect food levels, and log sanitization actions."*

---

### [2:30 – 3:00] ACT VI: AWS Serverless Architecture & The Road Ahead
**Visual:** Navigate to `/how-it-works`. Scroll past the interactive Physical Machine Schematic to the AWS Serverless Architecture diagram. Show the SAM template in code editor (`infrastructure/template.yaml`).  
**Narrator:**  
> *"Under the hood, ReCycle2Feed runs on AWS SAM using API Gateway HTTP API, AWS Lambda on ARM64 Graviton, and Amazon DynamoDB with point-in-time recovery—built entirely within the AWS Free Tier.*  
> *Our next milestone is connecting physical ESP32 microcontrollers over AWS IoT Core and piloting at DTU's campus.*  
> *ReCycle2Feed: Turning waste into care. Thank you."*
