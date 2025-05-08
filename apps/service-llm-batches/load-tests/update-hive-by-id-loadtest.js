import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

const hiveIds = ['hive_1746691746439_noluc4', 'hive_1746691747344_jzrr0y', 'hive_1746705491532_bz1uy9', 'hive_1746705492597_4wf198'];

const statusOptions = ['pending', 'processing', 'completed', 'failed'];

const modelOptions = [
  ['gpt-4', 'claude-3-opus'],
  ['gpt-4', 'claude-3-sonnet', 'llama-3'],
  ['claude-3-haiku', 'gemini-pro'],
];

export let options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '30s', target: 5 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const hiveId = hiveIds[Math.floor(Math.random() * hiveIds.length)];

  const payload = {};

  // 70% chance to update status
  if (Math.random() < 0.7) {
    payload.status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  }

  // 50% chance to update models
  if (Math.random() < 0.5) {
    payload.models = modelOptions[Math.floor(Math.random() * modelOptions.length)];
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  // Make a PATCH request to update the hive
  const res = http.patch(`http://localhost:3003/api/batches/${hiveId}`, JSON.stringify(payload), { headers });

  // Flexible content type check
  const isJson = (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json');

  const checks = check(res, {
    'status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'returns a valid JSON response': isJson,
    'successful update (if found)': (r) => r.status !== 200 || (r.json() && r.json().hiveId === hiveId),
  });

  if (!checks) {
    console.log(`Failed PATCH request for hiveId: ${hiveId}, status: ${res.status}, payload: ${JSON.stringify(payload)}`);
    if (res.body) {
      console.log(`Response body: ${res.body}`);
    }
  }

  sleep(1);
}
