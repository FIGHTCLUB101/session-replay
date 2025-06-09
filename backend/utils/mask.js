// Basic server-side masking utility (e.g., mask any field named 'password', 'email', etc.)
module.exports = function maskEventData(data) {
  // If data contains sensitive keys, replace with '***'
  const masked = { ...data };
  ['password', 'email', 'name', 'creditCard'].forEach((key) => {
    if (masked[key]) masked[key] = '***';
  });
  return masked;
};