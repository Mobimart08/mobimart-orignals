async function run() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test42@mobimartoriginals.com',
        password: 'ChangeMe@123',
        phone: '9876543210'
      })
    });
    console.log([...res.headers.entries()]);
    console.log(await res.json());
  } catch (err) {
    console.error(err);
  }
}
run();
