# ReCycle2Feed — API Reference

Base URLs:
* Local Server: `http://localhost:4000`
* AWS Production: `https://<api-id>.execute-api.ap-south-1.amazonaws.com`

All endpoints accept and return `application/json`. CORS is enabled for all origins.

---

## 1. System Health & Configuration

### `GET /api/health`
Returns backend service health, runtime version, and active operating mode.

#### Response (200 OK)
```json
{
  "status": "HEALTHY",
  "service": "recycle2feed-api",
  "version": "1.0.0",
  "mode": "AWS_DYNAMODB",
  "timestamp": "2026-10-10T02:00:00.000Z"
}
```

---

### `GET /api/config`
Returns safe public configuration, including accepted/rejected materials, standard portion sizes, and supported modules.

#### Response (200 OK)
```json
{
  "version": "1.0.0",
  "operatingMode": "SIMULATION",
  "acceptedMaterials": ["PET_BOTTLE", "ALUMINIUM_CAN"],
  "rejectedMaterials": ["GLASS_BOTTLE", "E_WASTE", "UNSUPPORTED_PLASTIC", "UNKNOWN"],
  "supportedModules": [
    {
      "id": "DOG_FEED",
      "name": "Community Dog Feeding",
      "description": "Controlled dispensing of dry kibble into a sanitized, sheltered bowl.",
      "configuredPortionGrams": 20,
      "isPlannedModule": false
    }
  ],
  "policy": {
    "cooldownSeconds": 5,
    "maxBinFillPercent": 95,
    "minFoodInventoryGrams": 20,
    "standardPortions": {
      "DOG_FEED": 20,
      "CAT_FEED": 15,
      "BIRD_FEED": 10,
      "HUMAN_FOOD_PACK": 0
    }
  }
}
```

---

## 2. Transactions & Idempotency

### `POST /api/transactions`
Creates a new recycling event or retrieves an existing record if `eventId` matches (Idempotency).

#### Request Body
```json
{
  "eventId": "evt-177309-8472",
  "machineId": "machine-demo-01",
  "itemType": "PET_BOTTLE",
  "beneficiaryModule": "DOG_FEED",
  "sensorSource": "SIMULATOR",
  "measuredWeightGrams": 28,
  "simulationMode": true,
  "deviceEvidence": {
    "opticalDetected": true,
    "inductiveDetected": false,
    "loadCellGrams": 28
  }
}
```

#### Response (201 Created / 200 OK)
```json
{
  "eventId": "evt-177309-8472",
  "accepted": true,
  "collectionStatus": "SIMULATED",
  "dispenseStatus": "SIMULATED",
  "feedGrams": 20,
  "message": "Simulated dispensing of 20g portion completed.",
  "rejectionReason": null,
  "transaction": {
    "eventId": "evt-177309-8472",
    "machineId": "machine-demo-01",
    "createdAt": "2026-10-10T02:05:00.000Z",
    "dateKey": "2026-10-10",
    "itemType": "PET_BOTTLE",
    "measuredWeightGrams": 28,
    "sensorSource": "SIMULATOR",
    "validationStatus": "ACCEPTED",
    "collectionStatus": "SIMULATED",
    "beneficiaryModule": "DOG_FEED",
    "dispenseStatus": "SIMULATED",
    "feedGrams": 20,
    "rejectionReason": null,
    "simulationMode": true,
    "updatedAt": "2026-10-10T02:05:00.000Z"
  }
}
```

---

### `GET /api/transactions`
Retrieves recent transactions sorted by timestamp descending.

#### Query Parameters
* `limit` (optional, integer, default: 50): Number of records to return.

---

## 3. Impact Analytics

### `GET /api/impact`
Returns aggregated analytics over a specified time window.

#### Query Parameters
* `range` (optional, string: `24h` | `7d` | `30d` | `all`, default: `7d`)
* `machineId` (optional, string)

#### Response (200 OK)
```json
{
  "range": "7d",
  "totalEvents": 42,
  "acceptedItems": 38,
  "rejectedItems": 4,
  "totalMeasuredWeightGrams": 1045,
  "simulatedCollections": 40,
  "physicalCollections": 2,
  "portionsRequested": 38,
  "simulatedPortionsDispensed": 36,
  "physicalPortionsDispensed": 2,
  "failedDispenses": 0,
  "currentEstimatedInventoryGrams": 3350,
  "currentBinCapacityPercent": 28,
  "activeFaultsCount": 0,
  "materialBreakdown": {
    "PET_BOTTLE": 26,
    "ALUMINIUM_CAN": 12,
    "GLASS_BOTTLE": 3,
    "E_WASTE": 1,
    "UNSUPPORTED_PLASTIC": 0,
    "UNKNOWN": 0
  },
  "recentDailyActivity": [
    { "date": "2026-10-08", "accepted": 12, "rejected": 1, "dispensedGrams": 240 }
  ]
}
```

---

## 4. Machines & Maintenance

### `GET /api/machines/{machineId}`
Returns live status, bin fill percentage, and food inventory levels.

### `POST /api/machines/{machineId}/heartbeat`
Allows edge controller or simulator to send health telemetry.

### `POST /api/maintenance`
Logs caretaker servicing actions (`BIN_EMPTYING`, `FEED_REPLENISHMENT`, `JAM_RESOLUTION`, `CLEANING`).
