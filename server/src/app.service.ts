import { Injectable } from '@nestjs/common';

type ApiInfo = {
  name: string;
  status: string;
  version: string;
  timestamp: string;
  endpoints: {
    auth: string;
    users: string;
    leads: string;
    health: string;
  };
};

type HealthInfo = {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
};

@Injectable()
export class AppService {
  getApiInfo(): ApiInfo {
    return {
      name: 'Sales Workspace API',
      status: 'ok',
      version: 'v1',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/auth',
        users: '/users',
        leads: '/leads',
        health: '/health',
      },
    };
  }

  getHealth(): HealthInfo {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
