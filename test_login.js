const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@mobimartoriginals.com',
      password: 'ChangeMe@123'
    });
    console.log(res.headers['set-cookie']);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

run();
