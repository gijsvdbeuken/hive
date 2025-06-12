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

  const testMessage = `Load test message ${__VU}_${__ITER}_${Date.now()}`;

  const response = http.post(`${baseUrl}/api/chat/test`, JSON.stringify({ message: testMessage }), { headers: { 'Content-Type': 'application/json' } });

  check(response, {
    'test endpoint status 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'returns echo message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message.answer.includes(testMessage);
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);
}
