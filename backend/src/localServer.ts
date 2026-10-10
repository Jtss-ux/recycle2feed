import express from 'express';
import cors from 'cors';
import { handler } from './handlers/lambdaAdapter';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Forward all /api/* routes through the Lambda adapter so behavior is 100% identical
app.all('/api/*', async (req, res) => {
  const event = {
    rawPath: req.path,
    requestContext: {
      http: {
        method: req.method,
        path: req.path
      }
    },
    headers: req.headers as Record<string, string>,
    queryStringParameters: req.query as Record<string, string>,
    body: JSON.stringify(req.body)
  };

  const response = await handler(event as any);

  if (response.headers) {
    Object.entries(response.headers).forEach(([k, v]) => res.setHeader(k, v));
  }

  res.status(response.statusCode).send(response.body ? JSON.parse(response.body) : '');
});

// Root ping
app.get('/', (req, res) => {
  res.json({
    name: 'ReCycle2Feed Backend API',
    status: 'RUNNING',
    healthCheck: '/api/health',
    endpoints: [
      'GET  /api/health',
      'GET  /api/config',
      'POST /api/transactions',
      'GET  /api/transactions',
      'GET  /api/impact',
      'GET  /api/machines/:machineId',
      'POST /api/machines/:machineId/heartbeat',
      'POST /api/maintenance',
      'GET  /api/maintenance',
      'POST /api/reset'
    ]
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`[ReCycle2Feed] Backend server running at http://localhost:${port}`);
    console.log(`[ReCycle2Feed] Health check available at http://localhost:${port}/api/health`);
  });
}

export default app;
