import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  iterations: 2,
  vus: 1,
};

export default function () {
  const baseUrl = __ENV.API_BASE_URL || 'https://api.hive-app.nl';

  if (__ITER === 0) {
    console.log('Testing OpenAI endpoint...');
    const openaiResponse = http.post(`${baseUrl}/api/chat/openai`, JSON.stringify({ message: 'Hello, just testing!' }), { headers: { 'Content-Type': 'application/json' } });

    check(openaiResponse, {
      'openai responds': (r) => r.status === 200,
      'openai has answer': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.message.answer && body.message.answer.length > 0;
        } catch {
          return false;
        }
      },
    });

    console.log('OpenAI response:', openaiResponse.status);
  }

  sleep(2);
}
