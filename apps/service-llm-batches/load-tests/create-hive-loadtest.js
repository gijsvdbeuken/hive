import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

export default function () {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const uniqueHiveId = `hive_${timestamp}_${randomPart}`;

  const payload = JSON.stringify({
    hiveId: uniqueHiveId,
    models: ['gpt-4', 'claude-3'],
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post('http://localhost:3001/api/batches', payload, { headers });

  check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'returns JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
  });

  sleep(1);
}
