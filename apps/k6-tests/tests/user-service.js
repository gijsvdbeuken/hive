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

  const testAuth0Id = `test_user_${__VU}_${__ITER}_${Date.now()}`;

  const response = http.get(`${baseUrl}/api/users/${testAuth0Id}`);

  check(response, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'has user data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.auth0_id === testAuth0Id;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
