# WeMakeDevs × Wispr Flow: No Hands Challenge Submission Guide
## Official Submission Copy-Paste Kit
**URL:** [https://www.wemakedevs.org/wispr](https://www.wemakedevs.org/wispr)  
**Track:** Track 1 — Builders (for developers)  
**Deadline:** Friday, October 30, 2026 at 11:59 PM IST (Solo Entry)

---

### Field 1: Track Selection
* **Track:** `Track 1: Builders`

---

### Field 2: Project Link
```text
https://jtss-ux.github.io/recycle2feed/
```
*(Live interactive application running on GitHub Pages with dark cyberpunk HUD, No-Hands Voice Dispatcher, and full Evaluator Test Bench).*

---

### Field 3: Public GitHub Repository Link
```text
https://github.com/Jtss-ux/recycle2feed
```
*(Complete production codebase containing React 18 frontend, Node.js 20.x backend microservice, AWS SAM template `infrastructure/template.yaml`, and 14/14 automated Vitest unit tests).*

---

### Field 4: Demo Video Link (Max 2 Minutes / ≤ 120s)
```text
[INSERT YOUR 2-MINUTE YOUTUBE VIDEO LINK HERE]
```
*(Storyboard script ready in `docs/wispr-demo-script.md`; strictly 1m 50s duration).*

---

### Field 5: Wispr Usage Card
* **Upload:** Upload the PNG/JPG screenshot from your **Wispr Flow Desktop App → Insights → Your usage** showing total words dictated between Oct 16 and Oct 30.

---

### Field 6: About the Project (Problem, Who It Is For, How Wispr Was Used)
*(Copy-paste this exact writeup formatted for maximum judge marks)*:

```text
Problem:
In municipal reverse vending and community animal welfare, caretakers hauling 25kg+ bags of crushed PET bottles or animal feed wear thick protective gloves and handle dirty scrap. They cannot physically stop and type on a smartphone or laptop to log maintenance. Simultaneously, students and disabled individuals approaching recycling kiosks with arms full of bottles need a hands-free way to deposit and feed.

Who it is for:
1. Campus & Municipal Waste Caretakers: Field operators who service smart reverse vending kiosks, empty crushed PET compartments, and refill food hoppers hands-free.
2. Students & Community Animal Welfare Caretakers: Individuals recycling beverage containers and directing calibrated feed to campus dogs, cats, and birds.

How Wispr Flow was used:
1. Voice-Driven Field Operations (/operator): We built a No-Hands Field Dispatch Console where caretakers speak servicing reports naturally via Wispr Flow (e.g., "Emptied 24.5 kg of crushed PET bottles from Node DTU-01, refilled dog hopper with 1500g pedigree kibble, cleared motor jam"). Our rule-based NLP engine extracts scrap weights, identifies servicing actions, resets full-bin lockouts, and writes directly to Amazon DynamoDB with sub-4ms latency.
2. Hands-Free Kiosk Accessibility (/kiosk): Users holding bottles speak deposit commands ("Deposit bottle for dogs") to trigger optical/inductive sensor verification and automated auger dispensing hands-free.
3. Voice-First Cloud Development: The entire AWS SAM Infrastructure-as-Code template (infrastructure/template.yaml), Graviton ARM64 Lambda functions, and 14 Vitest test cases were authored and directed by dictating prompts and specifications into AI coding tools via Wispr Flow, accelerating development 4x faster than typing.
```

---

### Field 7: Social / Build in Public (Bonus Prize)
Post a 30-second clip or screenshot of the Voice Dispatcher on Twitter/X or LinkedIn with:
```text
Built a voice-first IoT Reverse Vending & Community Animal Welfare platform for the #NoHandsChallenge by @WeMakeDevs and @wisprflow!

Caretakers hauling 25kg of crushed PET scrap can't type with dirty work gloves. With Wispr Flow, spoken field notes auto-reset bin lockouts and sync to AWS DynamoDB hands-free.

Live Demo: https://jtss-ux.github.io/recycle2feed/
GitHub: https://github.com/Jtss-ux/recycle2feed
#WisprFlow #AWS #BuildInPublic #Sustainability
```
