# ReCycle2Feed — No-Hands Wispr Challenge Demo Script
## WeMakeDevs × Wispr Flow (Track 1: Builders)
**Target Duration:** Exactly 1:50 (110 seconds) — Strictly within the ≤ 2:00 minute limit!  
**Format:** YouTube Unlisted / Public (1080p Full HD)

---

## Ready-to-Copy YouTube Metadata

* **Video Title:** `ReCycle2Feed No-Hands — Voice-First Reverse Vending & Field Operations | Wispr Challenge 2026`
* **Video Privacy:** `Unlisted` or `Public` *(Verify link opens in signed-out browser!)*
* **Video Description:**
```text
Project: ReCycle2Feed No-Hands
Event: No Hands: The Wispr Challenge (Oct 16–30, 2026 by WeMakeDevs & Wispr Flow)
Track: Track 1 — Builders (Developer Track)
Live Interactive Web App: https://jtss-ux.github.io/recycle2feed/
GitHub Repository: https://github.com/Jtss-ux/recycle2feed

ReCycle2Feed No-Hands brings voice-first computing to dirty-handed municipal recycling and community animal care:
1. No-Hands Field Operator Dispatch (/operator): Caretakers wearing thick work gloves while hauling heavy scrap bins dictate maintenance logs via Wispr Flow. Natural Language Processing extracts scrap mass, resets 95% bin lockouts, clears motor jams, and commits to Amazon DynamoDB hands-free.
2. No-Hands Kiosk Accessibility (/kiosk): Users holding arms full of bottles or persons with motor disabilities speak commands (e.g., "Deposit bottle for dogs") to trigger automated material validation and auger dispensing.
3. Voice-Driven Cloud Development: Infrastructure-as-Code (AWS SAM), Lambda Graviton functions, and 14 Vitest unit tests authored by dictating prompts through Wispr Flow.

#NoHandsChallenge #WisprFlow #WeMakeDevs #AWS #Serverless #VoiceAI #Sustainability
```

---

## Second-by-Second Storyboard (1m 50s Total)

### [0:00 – 0:20] Scene 1: The "No-Hands" Real-World Friction
* **Visual:** Split screen / opening shot showing campus recycling bins, stray community animals, and a field worker with heavy gloves holding a 25kg bag of animal feed.
* **Voiceover:**
> *"In public recycling and animal welfare operations, field caretakers wear heavy gloves, haul 25-kilogram sacks of feed, and handle crushed PET scrap. They cannot stop and type on a keyboard or smartphone.*
> *At the recycling kiosk, students holding arms full of beverage containers need a zero-touch way to recycle. Typing is the bottleneck."*

---

### [0:20 – 0:45] Scene 2: Building with Wispr Flow
* **Visual:** Screen capture showing Wispr Flow desktop app, dictating requirements into the code editor and AWS SAM template (`infrastructure/template.yaml`). Show the Wispr Insights card with active word count.
* **Voiceover:**
> *"Meet ReCycle2Feed No-Hands. We built this platform using Wispr Flow to dictate our architecture specs, AWS SAM CloudFormation templates, and DynamoDB conditional write logic directly into AI coding tools four times faster than typing.*
> *Then, we brought that exact voice-first power directly into our software for field workers."*

---

### [0:45 – 1:15] Scene 3: Live Demo — No-Hands Operator Console (`/operator`)
* **Visual:** Navigate to `/operator`. Show the **No-Hands Field Dispatch** HUD. Click or dictate:
  *"Emptied 24.5 kg of crushed PET bottles from Node DTU-01, refilled dog hopper with 1500 grams of pedigree, cleared motor compactor jam, machine is clean and ready."*
  Show the NLP parser instantly highlight:
  - `[✓] Action: BIN_EMPTYING + FEED_REPLENISHMENT + JAM_CLEARANCE`
  - `[✓] Scrap: 24.5 kg PET`
  - `[✓] Restock: +1500g Kibble`
  - `[✓] Safety Interlock: Motor Jam Cleared`
  Click **[ EXECUTE NO-HANDS SERVICING ]**. Watch the bin fill reset to 0%, the food gauge jump up, and the DynamoDB record appear.
* **Voiceover:**
> *"Here is our No-Hands Operator Console. A caretaker holds the Wispr shortcut and speaks their field report naturally.
> Our rule-based NLP engine extracts the exact scrap weight, identifies that the bin was emptied, notes the 1500 grams of kibble replenished, and clears the motor stall lockout.
> With one voice confirmation, it commits to Amazon DynamoDB in under 4 milliseconds—all without typing a single character."*

---

### [1:15 – 1:35] Scene 4: Live Demo — Voice Kiosk Accessibility (`/kiosk`)
* **Visual:** Navigate to `/kiosk`. In Step 1, highlight the **No-Hands Voice Intake Mode**.
  Click or speak: *"Deposit bottle for dogs"*.
  Watch the kiosk auto-select PET Bottle + Dog Feed, engage optical sensor check, compact the container, and run the auger feeder to dispense 20g of kibble, issuing the receipt.
* **Voiceover:**
> *"For users at the kiosk, our No-Hands Voice Intake provides accessible, hands-free operation.
> Saying 'Deposit bottle for dogs' automatically verifies container geometry, reduces volume by 70%, and dispenses a nutritious portion into the community bowl."*

---

### [1:35 – 1:50] Scene 5: Conclusion & Wispr Insights Card
* **Visual:** Quick glimpse of the Wispr Flow Insights desktop card, the 14 passing Vitest tests, and the GitHub repo.
* **Voiceover:**
> *"ReCycle2Feed No-Hands proves that voice-first computing isn't just about faster typing—it transforms physical, dirty-handed civic infrastructure into seamless cloud automation.
> Built for the Wispr Challenge. Thank you."*
