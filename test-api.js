const http = require('http');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== Testing ${path} ===`);
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        console.log('Response:', data);
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', (err) => {
      console.error(`Error testing ${path}:`, err);
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  try {
    await testAPI('/api/test-db');
    await testAPI('/api/quiz-leaderboard');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests(); 