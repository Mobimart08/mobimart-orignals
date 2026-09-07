async function run() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@mobimartoriginals.com',
        password: 'ChangeMe@123'
      })
    });
    console.log([...res.headers.entries()]);
    console.log(await res.json());
  } catch (err) {
    console.error(err);
  }
}
run();
