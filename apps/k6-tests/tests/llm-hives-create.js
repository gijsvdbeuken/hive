import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 25 },
    { duration: '3m', target: 25 },
    { duration: '2m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '2m', target: 75 },
    { duration: '3m', target: 75 },
    { duration: '2m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const baseUrl = __ENV.API_BASE_URL || 'https://api.hive-app.nl';
  const testOwnerId = `test_owner_${__VU}_${__ITER}_${Date.now()}`;
  const hiveId = `test_hive_${__VU}_${__ITER}_${Date.now()}`;

  const hiveData = {
    ownerId: testOwnerId,
    hiveId: hiveId,
    largeLanguageModels: ['gpt-4', 'claude-3-sonnet', 'gemini-pro'],
  };

  const response = http.post(`${baseUrl}/api/hives`, JSON.stringify(hiveData), { headers: { 'Content-Type': 'application/json' } });

  check(response, {
    'create status is 201': (r) => r.status === 201,
    'create response time < 2000ms': (r) => r.timings.duration < 2000,
    'returns created hive': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hive && body.hive.id === hiveId;
      } catch {
        return false;
      }
    },
    'hive has correct models': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hive.models.length === 3;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
