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

  const createResponse = http.get(`${baseUrl}/api/users/${testAuth0Id}`);

  check(createResponse, {
    'user created successfully': (r) => r.status === 200 || r.status === 201,
  });

  if (createResponse.status === 200 || createResponse.status === 201) {
    const updateData = {
      username: `updated_user_${Date.now()}`,
      language: 'es',
      theme: 'dark',
      email_notifications: true,
      beta_features_opt_in: true,
    };

    const updateResponse = http.put(`${baseUrl}/api/users/${testAuth0Id}`, JSON.stringify(updateData), { headers: { 'Content-Type': 'application/json' } });

    check(updateResponse, {
      'update status is 200': (r) => r.status === 200,
      'update response time < 2000ms': (r) => r.timings.duration < 2000,
      'update returns data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.language === 'es' && body.theme === 'dark';
        } catch {
          return false;
        }
      },
    });
  }

  sleep(1);
}
