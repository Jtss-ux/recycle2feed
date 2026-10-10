import { InMemoryRepository, IRepository } from '../repositories/inMemoryRepo';
import { DynamoDbRepository } from '../repositories/dynamoDbRepo';
import { TransactionService } from '../services/transactionService';
import { MachineService } from '../services/machineService';
import { ImpactService } from '../services/impactService';
import { MaintenanceService } from '../services/maintenanceService';
import { getPublicConfig } from './config';
import {
  validateTransactionRequest,
  validateHeartbeatRequest,
  validateMaintenanceRequest
} from '../validation/validator';

// Choose repository based on whether DynamoDB table env is set
const repo: IRepository = process.env.DYNAMODB_TRANSACTIONS_TABLE
  ? new DynamoDbRepository()
  : new InMemoryRepository();

const transactionService = new TransactionService(repo);
const machineService = new MachineService(repo);
const impactService = new ImpactService(repo);
const maintenanceService = new MaintenanceService(repo);

export { repo, transactionService, machineService, impactService, maintenanceService };

interface APIGatewayProxyEventV2 {
  rawPath: string;
  requestContext: {
    http: {
      method: string;
      path: string;
    };
  };
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
}

interface APIGatewayProxyResultV2 {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
};

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || event.requestContext?.http?.path || '/api/health';

  // Handle preflight OPTIONS
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS
    };
  }

  try {
    let bodyData: any = {};
    if (event.body) {
      const raw = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
      try {
        bodyData = JSON.parse(raw);
      } catch (e) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Invalid JSON payload' })
        };
      }
    }

    // 1. Health
    if (path === '/api/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          status: 'HEALTHY',
          service: 'recycle2feed-api',
          version: '1.0.0',
          mode: process.env.DYNAMODB_TRANSACTIONS_TABLE ? 'AWS_DYNAMODB' : 'IN_MEMORY_SIMULATION',
          timestamp: new Date().toISOString()
        })
      };
    }

    // 2. Config
    if (path === '/api/config' && method === 'GET') {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(getPublicConfig())
      };
    }

    // 3. Transactions
    if (path === '/api/transactions' && method === 'POST') {
      const validated = validateTransactionRequest(bodyData);
      const res = await transactionService.processTransaction(validated);
      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify(res)
      };
    }

    if (path === '/api/transactions' && method === 'GET') {
      const limit = parseInt(event.queryStringParameters?.limit || '50', 10);
      const list = await repo.listTransactions(limit);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          count: list.length,
          transactions: list
        })
      };
    }

    // 4. Impact
    if (path === '/api/impact' && method === 'GET') {
      const range = event.queryStringParameters?.range || '7d';
      const machineId = event.queryStringParameters?.machineId;
      const impact = await impactService.getImpact(range, machineId);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(impact)
      };
    }

    // 5. Machines
    const machineMatch = path.match(/^\/api\/machines\/([^\/]+)$/);
    if (machineMatch && method === 'GET') {
      const machineId = machineMatch[1];
      const machine = await machineService.getMachine(machineId);
      if (!machine) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: `Machine ${machineId} not found` })
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(machine)
      };
    }

    const heartbeatMatch = path.match(/^\/api\/machines\/([^\/]+)\/heartbeat$/);
    if (heartbeatMatch && method === 'POST') {
      const machineId = heartbeatMatch[1];
      const validated = validateHeartbeatRequest(bodyData);
      const updated = await machineService.processHeartbeat(machineId, validated);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(updated)
      };
    }

    // 6. Maintenance
    if (path === '/api/maintenance' && method === 'POST') {
      const validated = validateMaintenanceRequest(bodyData);
      const log = await maintenanceService.recordMaintenance(validated);
      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify(log)
      };
    }

    if (path === '/api/maintenance' && method === 'GET') {
      const machineId = event.queryStringParameters?.machineId;
      const logs = await maintenanceService.listMaintenance(machineId);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          count: logs.length,
          logs
        })
      };
    }

    // 7. Demo Reset
    if (path === '/api/reset' && method === 'POST') {
      await repo.resetDemoData();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Demo data reset to initial seed state.' })
      };
    }

    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: `Route ${method} ${path} not found` })
    };
  } catch (err: any) {
    console.error('Unhandled Lambda Error:', err);
    const isValidation = err.name === 'ValidationError';
    return {
      statusCode: isValidation ? 400 : 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: err.message,
        details: err.errors || undefined
      })
    };
  }
}
