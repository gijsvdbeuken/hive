const fs = require('fs');

function analyzeMonitoring() {
  const data = fs.readFileSync('monitoring-results.csv', 'utf8');
  const lines = data.split('\n').slice(1);

  const metrics = {
    health: { responses: [], failures: 0 },
    users: { responses: [], failures: 0 },
    hives: { responses: [], failures: 0 },
    chat: { responses: [], failures: 0 },
  };

  lines.forEach((line) => {
    const [metric_name, timestamp, value, check, error, , , , , name] = line.split(',');

    if (metric_name === 'http_req_duration') {
      if (name?.includes('/health')) metrics.health.responses.push(parseFloat(value));
      if (name?.includes('/users')) metrics.users.responses.push(parseFloat(value));
      if (name?.includes('/hives')) metrics.hives.responses.push(parseFloat(value));
      if (name?.includes('/chat')) metrics.chat.responses.push(parseFloat(value));
    }

    if (metric_name === 'http_req_failed' && parseFloat(value) > 0) {
      if (name?.includes('/health')) metrics.health.failures++;
      if (name?.includes('/users')) metrics.users.failures++;
      if (name?.includes('/hives')) metrics.hives.failures++;
      if (name?.includes('/chat')) metrics.chat.failures++;
    }
  });

  console.log('\n🔍 MONITORING SUMMARY');
  console.log('====================');

  Object.entries(metrics).forEach(([service, data]) => {
    if (data.responses.length > 0) {
      const avg = data.responses.reduce((a, b) => a + b, 0) / data.responses.length;
      const max = Math.max(...data.responses);
      const successRate = (((data.responses.length - data.failures) / data.responses.length) * 100).toFixed(1);

      console.log(`\n📊 ${service.toUpperCase()}:`);
      console.log(`   Average response time: ${avg.toFixed(1)}ms`);
      console.log(`   Max response time: ${max.toFixed(1)}ms`);
      console.log(`   Success rate: ${successRate}%`);
      console.log(`   Total requests: ${data.responses.length}`);
    }
  });

  console.log('\n✅ Monitoring analysis complete!\n');
}

analyzeMonitoring();
