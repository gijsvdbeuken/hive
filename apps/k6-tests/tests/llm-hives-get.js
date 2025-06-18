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

  const response = http.get(`${baseUrl}/api/hives/${testOwnerId}`);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'returns hives array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.hives);
      } catch {
        return false;
      }
    },
    'hives array is empty for new user': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.hives.length === 0;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
