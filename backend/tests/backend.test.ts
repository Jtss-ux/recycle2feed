import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryRepository } from '../src/repositories/inMemoryRepo';
import { TransactionService } from '../src/services/transactionService';
import { MachineService } from '../src/services/machineService';
import { ImpactService } from '../src/services/impactService';
import { MaintenanceService } from '../src/services/maintenanceService';
import { validateTransactionRequest, ValidationError } from '../src/validation/validator';
import { handler } from '../src/handlers/lambdaAdapter';

describe('ReCycle2Feed Backend Business Logic & Safety Tests', () => {
  let repo: InMemoryRepository;
  let txService: TransactionService;
  let machineService: MachineService;
  let impactService: ImpactService;
  let maintService: MaintenanceService;

  beforeEach(() => {
    repo = new InMemoryRepository();
    txService = new TransactionService(repo);
    machineService = new MachineService(repo);
    impactService = new ImpactService(repo);
    maintService = new MaintenanceService(repo);
  });

  // Test 1: Eligible PET bottle accepted
  it('1. accepts an eligible PET-bottle event under test policy', async () => {
    const res = await txService.processTransaction({
      eventId: 'test-pet-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 28,
      simulationMode: true
    });

    expect(res.accepted).toBe(true);
    expect(res.collectionStatus).toBe('SIMULATED');
    expect(res.dispenseStatus).toBe('SIMULATED');
    expect(res.feedGrams).toBe(20);
    expect(res.rejectionReason).toBeNull();
  });

  // Test 2: Eligible Aluminium can accepted
  it('2. accepts an eligible aluminium-can event under test policy', async () => {
    const res = await txService.processTransaction({
      eventId: 'test-can-01',
      machineId: 'machine-demo-01',
      itemType: 'ALUMINIUM_CAN',
      beneficiaryModule: 'CAT_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 15,
      simulationMode: true
    });

    expect(res.accepted).toBe(true);
    expect(res.collectionStatus).toBe('SIMULATED');
    expect(res.dispenseStatus).toBe('SIMULATED');
    expect(res.feedGrams).toBe(15);
  });

  // Test 3: Unsupported material rejected
  it('3. rejects unsupported material (e.g., Glass bottle or E-waste)', async () => {
    const resGlass = await txService.processTransaction({
      eventId: 'test-glass-01',
      machineId: 'machine-demo-01',
      itemType: 'GLASS_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 250,
      simulationMode: true
    });

    expect(resGlass.accepted).toBe(false);
    expect(resGlass.collectionStatus).toBe('FAILED');
    expect(resGlass.dispenseStatus).toBe('NOT_ISSUED');
    expect(resGlass.feedGrams).toBe(0);
    expect(resGlass.rejectionReason).toContain('Glass containers are unsupported');

    const resEwaste = await txService.processTransaction({
      eventId: 'test-ewaste-01',
      machineId: 'machine-demo-01',
      itemType: 'E_WASTE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 80,
      simulationMode: true
    });

    expect(resEwaste.accepted).toBe(false);
    expect(resEwaste.rejectionReason).toContain('Batteries and electronics require specialized hazardous waste');
  });

  // Test 4: Duplicate event prevention (Idempotency)
  it('4. prevents duplicate event identifiers from producing a second reward', async () => {
    const eventId = 'test-idempotent-01';
    const firstCall = await txService.processTransaction({
      eventId,
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 28,
      simulationMode: true
    });
    expect(firstCall.accepted).toBe(true);

    const machineAfterFirst = await repo.getMachine('machine-demo-01');
    const inventoryAfterFirst = machineAfterFirst!.foodInventoryGrams.DOG_FEED;

    // Second call with same eventId
    const secondCall = await txService.processTransaction({
      eventId,
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 28,
      simulationMode: true
    });

    expect(secondCall.eventId).toBe(eventId);
    expect(secondCall.message).toContain('Duplicate event received');

    // Verify inventory was NOT decremented again
    const machineAfterSecond = await repo.getMachine('machine-demo-01');
    expect(machineAfterSecond!.foodInventoryGrams.DOG_FEED).toBe(inventoryAfterFirst);
  });

  // Test 5: Full recycling bin prevents new collection
  it('5. prevents new collection when recycling bin is full (>=95%)', async () => {
    await repo.updateMachineState('machine-demo-01', {
      recyclingBinFillPercent: 96
    });

    const res = await txService.processTransaction({
      eventId: 'test-full-bin-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 25,
      simulationMode: true
    });

    expect(res.accepted).toBe(false);
    expect(res.collectionStatus).toBe('FAILED');
    expect(res.rejectionReason).toContain('Recycling bin compartment is at maximum capacity');
  });

  // Test 6: Empty feed inventory blocks dispensing
  it('6. blocks dispensing and records failure when food inventory is empty', async () => {
    // Set DOG_FEED inventory to 5g (less than standard 20g portion)
    await repo.updateMachineState('machine-demo-01', {
      foodInventoryGrams: {
        DOG_FEED: 5,
        CAT_FEED: 500,
        BIRD_FEED: 500,
        HUMAN_FOOD_PACK: 0
      }
    });

    const res = await txService.processTransaction({
      eventId: 'test-low-food-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 25,
      simulationMode: true
    });

    // Material is accepted and collected, but food dispensing fails honestly
    expect(res.accepted).toBe(true);
    expect(res.collectionStatus).toBe('SIMULATED');
    expect(res.dispenseStatus).toBe('FAILED');
    expect(res.feedGrams).toBe(0);
    expect(res.message).toContain('inventory is exhausted');
  });

  // Test 7: Dispenser actuator jam halts intake
  it('7. halts dispensing when machine has an active actuator jam fault', async () => {
    await repo.updateMachineState('machine-demo-01', {
      activeFaults: ['FEEDER_MOTOR_JAM']
    });

    const res = await txService.processTransaction({
      eventId: 'test-jam-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      measuredWeightGrams: 25,
      simulationMode: true
    });

    expect(res.accepted).toBe(false);
    expect(res.collectionStatus).toBe('FAILED');
    expect(res.rejectionReason).toContain('Dispensing actuator reported a mechanical jam');
  });

  // Test 8: Simulated vs Physical distinction
  it('8. strictly separates simulated dispensing from physically verified outcomes', async () => {
    const simRes = await txService.processTransaction({
      eventId: 'test-sim-dist-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      simulationMode: true
    });
    expect(simRes.collectionStatus).toBe('SIMULATED');
    expect(simRes.dispenseStatus).toBe('SIMULATED');

    const liveRes = await txService.processTransaction({
      eventId: 'test-live-dist-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'ESP32_OPTICAL',
      simulationMode: false
    });
    expect(liveRes.collectionStatus).toBe('CONFIRMED');
    expect(liveRes.dispenseStatus).toBe('CONFIRMED');

    const impact = await impactService.getImpact('all');
    expect(impact.simulatedCollections).toBeGreaterThanOrEqual(1);
    expect(impact.physicalCollections).toBe(1);
    expect(impact.physicalPortionsDispensed).toBe(1);
  });

  // Test 9: Transaction history contains expected record
  it('9. ensures transaction history lists newly created transactions', async () => {
    const eventId = 'test-history-01';
    await txService.processTransaction({
      eventId,
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'BIRD_FEED',
      sensorSource: 'SIMULATOR',
      simulationMode: true
    });

    const list = await repo.listTransactions(10);
    const found = list.find(t => t.eventId === eventId);
    expect(found).toBeDefined();
    expect(found?.beneficiaryModule).toBe('BIRD_FEED');
  });

  // Test 10: Impact counts match recorded events
  it('10. verifies impact counts match recorded events', async () => {
    const initialImpact = await impactService.getImpact('all');
    const initialEvents = initialImpact.totalEvents;

    await txService.processTransaction({
      eventId: 'test-impact-count-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      simulationMode: true
    });

    const updatedImpact = await impactService.getImpact('all');
    expect(updatedImpact.totalEvents).toBe(initialEvents + 1);
  });

  // Test 11: Validation rejects invalid payloads
  it('11. rejects invalid API payloads with validation errors', () => {
    expect(() => {
      validateTransactionRequest({
        eventId: '',
        machineId: 'machine-demo-01',
        itemType: 'INVALID_TRASH'
      });
    }).toThrow(ValidationError);
  });

  // Test 12: Maintenance records operator actions
  it('12. records operator maintenance actions and clears jam faults', async () => {
    // Add a jam fault
    await repo.updateMachineState('machine-demo-01', {
      activeFaults: ['FEEDER_JAM']
    });

    const log = await maintService.recordMaintenance({
      machineId: 'machine-demo-01',
      actionType: 'JAM_RESOLUTION',
      operatorNote: 'Cleared foreign object from dispenser rotor.',
      resetBinFill: true
    });

    expect(log.actionType).toBe('JAM_RESOLUTION');

    const machine = await repo.getMachine('machine-demo-01');
    expect(machine?.activeFaults).not.toContain('FEEDER_JAM');
    expect(machine?.recyclingBinFillPercent).toBe(0);
  });

  // Test 13: Offline machine halts intake
  it('13. prevents recycling intake when machine is marked OFFLINE', async () => {
    await repo.updateMachineState('machine-demo-01', {
      onlineStatus: 'OFFLINE'
    });

    const res = await txService.processTransaction({
      eventId: 'test-offline-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      simulationMode: true
    });

    expect(res.accepted).toBe(false);
    expect(res.rejectionReason).toContain('Machine is currently OFFLINE');
  });

  // Test 14: Demo reset works cleanly
  it('14. resets demo data to clean seed baseline', async () => {
    await txService.processTransaction({
      eventId: 'transient-tx-01',
      machineId: 'machine-demo-01',
      itemType: 'PET_BOTTLE',
      beneficiaryModule: 'DOG_FEED',
      sensorSource: 'SIMULATOR',
      simulationMode: true
    });

    await repo.resetDemoData();
    const tx = await repo.getTransaction('transient-tx-01');
    expect(tx).toBeNull();
  });
});
