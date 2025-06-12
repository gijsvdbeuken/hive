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
  const testOwnerId = `workflow_owner_${__VU}_${__ITER}_${Date.now()}`;
  const hiveId = `workflow_hive_${__VU}_${__ITER}_${Date.now()}`;

  const getInitial = http.get(`${baseUrl}/api/hives/${testOwnerId}`);
  check(getInitial, {
    'initial get successful': (r) => r.status === 200,
    'initially empty': (r) => JSON.parse(r.body).hives.length === 0,
  });

  const hiveData = {
    ownerId: testOwnerId,
    hiveId: hiveId,
    largeLanguageModels: ['gpt-4', 'claude-3-sonnet'],
  };

  const createResponse = http.post(`${baseUrl}/api/hives`, JSON.stringify(hiveData), { headers: { 'Content-Type': 'application/json' } });

  check(createResponse, {
    'hive created': (r) => r.status === 201,
  });

  const getAfterCreate = http.get(`${baseUrl}/api/hives/${testOwnerId}`);
  check(getAfterCreate, {
    'get after create successful': (r) => r.status === 200,
    'hive now exists': (r) => JSON.parse(r.body).hives.length === 1,
    'correct hive id': (r) => JSON.parse(r.body).hives[0].id === hiveId,
  });

  const deleteResponse = http.del(`${baseUrl}/api/hives/${testOwnerId}/${hiveId}`);
  check(deleteResponse, {
    'hive deleted': (r) => r.status === 200,
  });

  const getFinal = http.get(`${baseUrl}/api/hives/${testOwnerId}`);
  check(getFinal, {
    'final get successful': (r) => r.status === 200,
    'back to empty': (r) => JSON.parse(r.body).hives.length === 0,
  });

  sleep(1);
}
