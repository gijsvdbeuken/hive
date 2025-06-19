import http from 'k6/http';
import { check, sleep } from 'k6';

const TEST_USER_POOL_SIZE = 100;
const TEST_USER_PREFIX = 'load_test_user_';

export const options = {
  stages: [
    { duration: '2m', target: 250 },
    { duration: '3m', target: 250 },
    { duration: '2m', target: 500 },
    { duration: '3m', target: 500 },
    { duration: '2m', target: 750 },
    { duration: '3m', target: 750 },
    { duration: '2m', target: 1000 },
    { duration: '3m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
  setupTimeout: '60s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export function setup() {
  const baseUrl = __ENV.API_BASE_URL || 'https://api.hive-app.nl';
  console.log('Setting up test data...');
  console.log(`Using base URL: ${baseUrl}`);
  console.log(`Test user pool size: ${TEST_USER_POOL_SIZE}`);
  return { baseUrl };
}

export default function (data) {
  const baseUrl = data.baseUrl;

  const userIndex = (__VU + __ITER) % TEST_USER_POOL_SIZE;
  const testAuth0Id = `${TEST_USER_PREFIX}${userIndex}`;

  if (__ITER % 100 === 0) {
    console.log(`VU ${__VU}, Iteration ${__ITER}: Testing user ${testAuth0Id}`);
  }

  const createResponse = http.get(`${baseUrl}/api/users/${testAuth0Id}`, {
    tags: { name: 'get_user' },
  });

  check(createResponse, {
    'user created successfully': (r) => {
      if (r.status !== 200 && r.status !== 201) {
        console.log(`GET failed for ${testAuth0Id}: Status ${r.status}, Body: ${r.body}`);
      }
      return r.status === 200 || r.status === 201;
    },
  });

  if (createResponse.status === 200 || createResponse.status === 201) {
    const updateData = {
      username: `updated_user_${userIndex}_${Math.floor(__ITER / 10)}`, // Less unique usernames
      language: 'es',
      theme: 'dark',
      email_notifications: true,
      beta_features_opt_in: true,
    };

    const updateResponse = http.put(`${baseUrl}/api/users/${testAuth0Id}`, JSON.stringify(updateData), {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'update_user' },
    });

    check(updateResponse, {
      'update status is 200': (r) => {
        if (r.status !== 200) {
          console.log(`UPDATE failed for ${testAuth0Id}: Status ${r.status}, Body: ${r.body.substring(0, 200)}`);
        }
        return r.status === 200;
      },
      'update response time < 2000ms': (r) => {
        if (r.timings.duration >= 2000) {
          console.log(`SLOW UPDATE for ${testAuth0Id}: ${r.timings.duration}ms`);
        }
        return r.timings.duration < 2000;
      },
      'update returns data': (r) => {
        try {
          const body = JSON.parse(r.body);
          const isValid = body.language === 'es' && body.theme === 'dark';
          if (!isValid) {
            console.log(`INVALID UPDATE RESPONSE for ${testAuth0Id}: Expected es/dark, got ${body.language}/${body.theme}`);
          }
          return isValid;
        } catch (e) {
          console.log(`JSON PARSE ERROR for ${testAuth0Id}: ${e.message}, Body: ${r.body.substring(0, 100)}`);
          return false;
        }
      },
    });
  } else {
    console.log(`Skipping update for ${testAuth0Id} due to failed GET request`);
  }

  sleep(1);
}

export function teardown(data) {
  console.log('Load test completed');
}
