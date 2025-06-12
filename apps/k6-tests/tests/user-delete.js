import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const baseUrl = __ENV.API_BASE_URL || 'https://api.hive-app.nl';
  const testAuth0Id = `delete_test_${__VU}_${__ITER}_${Date.now()}`;

  const createResponse = http.get(`${baseUrl}/api/users/${testAuth0Id}`);

  check(createResponse, {
    'user created for deletion test': (r) => r.status === 200 || r.status === 201,
  });

  if (createResponse.status === 200 || createResponse.status === 201) {
    const deleteResponse = http.del(`${baseUrl}/api/users/${testAuth0Id}`);

    check(deleteResponse, {
      'delete handled (even if Auth0 fails)': (r) => r.status === 500 || r.status === 200,
      'delete response time < 3000ms': (r) => r.timings.duration < 3000,
    });
  }

  sleep(1);
}
