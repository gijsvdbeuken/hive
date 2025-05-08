import { check, sleep } from 'k6';
import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';

const url = 'http://localhost:3000';

let responseTimeTrend = new Trend('response_time');
let successRate = new Rate('success_rate');

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  let res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  responseTimeTrend.add(res.timings.duration);
  successRate.add(res.status === 200);

  sleep(1);
}
