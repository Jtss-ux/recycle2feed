# ReCycle2Feed — IoT Hardware & Reverse Vending Machine Design

## 1. Physical Machine Overview

ReCycle2Feed is designed as an outdoor/indoor **Reverse Vending Machine (RVM)** suitable for university campuses, railway concourses, transit hubs, and residential complexes.

It automates the intake, verification, compaction, and storage of empty beverage containers, and couples this with a metered animal feed or food-assistance dispenser.

```
+-------------------------------------------------------+
|                 ReCycle2Feed KIOSK                    |
|                                                       |
|   +-------------------+       +-------------------+   |
|   | 10" Touch Display |       | Intake Aperture   |   |
|   | (Kiosk Interface) |       | (Sensors + Shutter|   |
|   +-------------------+       +-------------------+   |
|                                                       |
|   =================================================   |
|   [Optical ToF Array] [Inductive Metal Sensor]        |
|   [5kg Load Cell Platform with HX711 ADC]             |
|   =================================================   |
|                                                       |
|   +-----------------------------------------------+   |
|   | Rotary Compactor / Flap Diverter (12V Motor)  |   |
|   +-----------------------------------------------+   |
|                                                       |
|   +---------------------+   +---------------------+   |
|   | PET Compartment     |   | Aluminium Bin       |   |
|   | (Crushed Bottles)   |   | (Crushed Cans)      |   |
|   +---------------------+   +---------------------+   |
|                                                       |
|   ----------------- HERMETIC BULKHEAD ---------------  |
|                                                       |
|   +-----------+  +-----------+  +-----------------+   |
|   | Dog Feed  |  | Cat Feed  |  | Wild Bird Grain |   |
|   | Hopper    |  | Hopper    |  | Hopper          |   |
|   | (3 kg)    |  | (2 kg)    |  | (1 kg)          |   |
|   +-----------+  +-----------+  +-----------------+   |
|         |              |                 |            |
|     [Auger 1]      [Auger 2]         [Auger 3]        |
|         \              |                /             |
|          +-------------+---------------+              |
|                        |                              |
|           [Food Delivery Chute & Bowl]                |
+-------------------------------------------------------+
```

---

## 2. Sensor Instrumentation & Verification Pipeline

Never claim that a single sensor is a panacea. ReCycle2Feed employs sensor fusion to validate incoming containers:

### 2.1 Optical Time-of-Flight (ToF) Array
* **Model:** VL53L1X distance array.
* **Role:** Detects insertion depth, cylinder diameter, and translucency profile. Rejects opaque, irregularly shaped trash (e.g. food boxes, shoes).

### 2.2 Inductive Proximity Sensor
* **Model:** LJ12A3-4-Z/BX (NPN Normally Open).
* **Role:** High-frequency electromagnetic oscillator detects conductive metallic bodies (aluminium cans) versus non-metallic bodies (PET plastic).

### 2.3 Single-Point Load Cell & 24-Bit ADC
* **Model:** 5kg strain-gauge load cell paired with Avia Semiconductor HX711.
* **Role:** Measures tare and net mass.
  * Standard empty 500ml PET bottle: **24g – 32g**.
  * Standard empty 330ml Aluminium can: **13g – 16g**.
  * Contaminated bottle containing liquid: **>60g** (Rejected).
  * Heavy glass container: **>180g** (Rejected).

---

## 3. Rotary Compaction & Volume Reduction

* **Motor:** 12V DC High-Torque Planetary Geared Motor (45 RPM, 35 kg·cm stall torque).
* **Flap Diverter:** Directs accepted plastic to the PET collection bin and cans to the Aluminium bin.
* **Safety Lockout:** Current-sensing resistor monitored via ESP32 ADC. If current exceeds 3.5A (mechanical obstruction or foreign object), motor stops within 15 milliseconds, reverses for 1.5 seconds, and logs a `DISPENSER_MOTOR_JAM` fault if unresolved.

---

## 4. Food Hoppers & Sanitary Protocols

### 4.1 Hermetic Sealing & Climate Protection
* **Material:** Food-grade high-density polypropylene (PP) compartments.
* **Moisture Protection:** EPDM silicone perimeter gaskets, desiccant breather valves, and rain hoods over external dispensing trays.
* **Species Isolation:** Completely separate internal chambers for dog kibble, cat food, and wild bird seed to prevent scent contamination and dietary mismatches.

### 4.2 Metered Dispensing Mechanism
* **Actuator:** NEMA 17 Stepper Motor driving an Archimedes auger screw.
* **Portion Calibration:**
  * 1 rotation = 5g of standard dry kibble.
  * 4 rotations = **20g** standard canine portion.
  * 3 rotations = **15g** standard feline portion.
  * 2 rotations = **10g** standard avian grain portion.
* **Safety Cooldown:** 5-second software lockout prevents rapid repeat dispensing.

---

## 5. Human Food Module Distinction (Roadmap)

**Crucial Engineering Rule:** Human food is never dispensed as loose pellets or from shared animal hoppers.

The planned future human assistance module will feature:
* Refrigerated / insulated locker compartments.
* Dispensing of hermetically sealed, factory-packaged ready-to-eat nutrient packs.
* Authorized NGO and food safety partner operational supervision.

---

## 6. Edge Controller Specifications

* **Microcontroller:** ESP32-WROOM-32D (Dual Core Tensilica LX6, 240 MHz).
* **Firmware:** FreeRTOS with modular tasks:
  1. `SensorSamplingTask` (50Hz ADC and ToF polling)
  2. `MotorControlTask` (Stepper pulse generation & limit switch monitoring)
  3. `AwsMqttTask` (Mutual TLS 1.3 MQTT communications with AWS IoT Core)
  4. `OfflineQueueTask` (Flash SPIFFS buffer storing up to 500 records if connectivity is lost)
