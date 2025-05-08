import http from 'k6/http';
import { check, fail } from 'k6';
import { sleep } from 'k6';

const hiveIds = ['hive_1746691746439_noluc4', 'hive_1746691747344_jzrr0y', 'hive_1746705491532_bz1uy9', 'hive_1746705492597_4wf198'];

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  // Select a random hiveId from the list
  const hiveId = hiveIds[Math.floor(Math.random() * hiveIds.length)];

  // Keep the original endpoint path
  const res = http.get(`http://localhost:3003/api/batches/${hiveId}`);

  // More flexible content type check
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
