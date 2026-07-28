const responseLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const oldJson = res.json;

  res.json = function (body) {
    const executionTime = Date.now() - start;
    console.log('\n==========================================');
    console.log('API RESPONSE');
    console.log('==========================================');
    console.log(`Endpoint: ${req.method} ${req.originalUrl}`);
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Execution Time: ${executionTime}ms`);
    console.log('Response Body:', JSON.stringify(body, null, 2));
    console.log('==========================================\n');

    return oldJson.call(this, body);
  };

  next();
};

export default responseLoggerMiddleware;
