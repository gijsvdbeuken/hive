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
