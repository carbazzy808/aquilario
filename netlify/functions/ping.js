exports.handler = async () => {
  console.log('ping called');
  return { statusCode: 200, body: 'pong' };
};
