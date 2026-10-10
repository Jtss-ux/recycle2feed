import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import {
  TransactionRecord,
  MachineRecord,
  MaintenanceRecord
} from '../types';
import { IRepository } from './inMemoryRepo';

export class DynamoDbRepository implements IRepository {
  private docClient: DynamoDBDocumentClient;
  private txTable: string;
  private machineTable: string;
  private maintenanceTable: string;

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'ap-south-1'
    });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.txTable = process.env.DYNAMODB_TRANSACTIONS_TABLE || 'recycle2feed-transactions-prod';
    this.machineTable = process.env.DYNAMODB_MACHINES_TABLE || 'recycle2feed-machines-prod';
    this.maintenanceTable = process.env.DYNAMODB_MAINTENANCE_TABLE || 'recycle2feed-maintenance-prod';
  }

  async getTransaction(eventId: string): Promise<TransactionRecord | null> {
    const cmd = new GetCommand({
      TableName: this.txTable,
      Key: { eventId }
    });
    const res = await this.docClient.send(cmd);
    return (res.Item as TransactionRecord) || null;
  }

  async saveTransaction(tx: TransactionRecord): Promise<void> {
    // Idempotency: conditional write ensures eventId cannot already exist
    const cmd = new PutCommand({
      TableName: this.txTable,
      Item: tx,
      ConditionExpression: 'attribute_not_exists(eventId)'
    });
    await this.docClient.send(cmd);
  }

  async listTransactions(limit = 50): Promise<TransactionRecord[]> {
    const cmd = new ScanCommand({
      TableName: this.txTable,
      Limit: limit
    });
    const res = await this.docClient.send(cmd);
    const items = (res.Items as TransactionRecord[]) || [];
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionRecord[]> {
    // Uses GSI on dateKey if deployed, or Scan with filter
    const cmd = new ScanCommand({
      TableName: this.txTable,
      FilterExpression: '#dk BETWEEN :start AND :end',
      ExpressionAttributeNames: {
        '#dk': 'dateKey'
      },
      ExpressionAttributeValues: {
        ':start': startDate,
        ':end': endDate
      }
    });
    const res = await this.docClient.send(cmd);
    return (res.Items as TransactionRecord[]) || [];
  }

  async getMachine(machineId: string): Promise<MachineRecord | null> {
    const cmd = new GetCommand({
      TableName: this.machineTable,
      Key: { machineId }
    });
    const res = await this.docClient.send(cmd);
    return (res.Item as MachineRecord) || null;
  }

  async saveMachine(machine: MachineRecord): Promise<void> {
    const cmd = new PutCommand({
      TableName: this.machineTable,
      Item: machine
    });
    await this.docClient.send(cmd);
  }

  async updateMachineState(machineId: string, partial: Partial<MachineRecord>): Promise<MachineRecord> {
    const current = await this.getMachine(machineId);
    if (!current) {
      throw new Error(`Machine ${machineId} not found in DynamoDB`);
    }
    const updated = { ...current, ...partial };
    await this.saveMachine(updated);
    return updated;
  }

  async saveMaintenance(record: MaintenanceRecord): Promise<void> {
    const cmd = new PutCommand({
      TableName: this.maintenanceTable,
      Item: record
    });
    await this.docClient.send(cmd);
  }

  async listMaintenance(machineId?: string): Promise<MaintenanceRecord[]> {
    const cmd = new ScanCommand({
      TableName: this.maintenanceTable,
      Limit: 50
    });
    const res = await this.docClient.send(cmd);
    let items = (res.Items as MaintenanceRecord[]) || [];
    if (machineId) {
      items = items.filter(m => m.machineId === machineId);
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }

  async resetDemoData(): Promise<void> {
    // In production DynamoDB, data is preserved; in simulation/dev, handled safely
    console.log('[DynamoDbRepository] Reset requested in cloud mode. Preserving audit records.');
  }
}
