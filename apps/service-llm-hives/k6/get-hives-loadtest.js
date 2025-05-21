import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = 'http://localhost:3003/api/hives';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const res = http.get(API_URL);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns JSON': (r) => r.headers['Content-Type'] === 'application/json; charset=utf-8',
  });

  sleep(1);
}
