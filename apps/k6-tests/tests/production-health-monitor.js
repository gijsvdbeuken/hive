import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [{ duration: '30s', target: 2 }],
  thresholds: {
    http_req_duration: ['p(95)<10'],
    http_req_failed: ['rate<0.1'],
    checks: ['rate>0.95'],
  },
};

export default function () {
  const baseUrl = __ENV.API_BASE_URL || 'https://api.hive-app.nl';

  const tests = [
    { name: 'health', url: `${baseUrl}/health` },
    { name: 'users', url: `${baseUrl}/api/users/monitor_test_${Date.now()}` },
    { name: 'hives', url: `${baseUrl}/api/hives/monitor_test_${Date.now()}` },
    { name: 'chat', url: `${baseUrl}/api/chat/test`, method: 'POST', body: { message: 'health check' } },
  ];

  tests.forEach((test) => {
    let response;
    const startTime = Date.now();

    if (test.method === 'POST') {
      response = http.post(test.url, JSON.stringify(test.body), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      response = http.get(test.url);
    }

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        service: test.name,
        status: response.status,
        response_time: response.timings.duration,
        success: response.status >= 200 && response.status < 400,
      }),
    );

    check(response, {
      [`${test.name}_status_ok`]: (r) => r.status >= 200 && r.status < 400,
      [`${test.name}_response_time`]: (r) => r.timings.duration < 1000,
    });
  });

  sleep(1);
}
