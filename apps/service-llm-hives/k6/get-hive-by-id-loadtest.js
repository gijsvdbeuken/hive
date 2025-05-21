import http from 'k6/http';
import { check, fail } from 'k6';
import { sleep } from 'k6';

const hiveIds = ['hive_1747035987865_70p8sc', 'hive_1747035987866_q1hl3x', 'hive_1747035988812_5qsbsh', 'hive_1747036315850_chc9k6'];

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const hiveId = hiveIds[Math.floor(Math.random() * hiveIds.length)];

  const res = http.get(`http://localhost:3003/api/hives/${hiveId}`);

  const isJson = (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json');

  const checks = check(res, {
    'status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'returns a valid JSON response': isJson,
  });

  if (!checks) {
    console.log(`Failed request for hiveId: ${hiveId}, status: ${res.status}`);
  }

  sleep(1);
}
