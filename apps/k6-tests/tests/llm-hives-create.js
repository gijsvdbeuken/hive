import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
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
