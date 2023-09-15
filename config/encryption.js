const Cryptr = require('cryptr');
const cryptr = new Cryptr(
   process.env.ENCRYPTION_KEY,
   {
      encoding: 'base64',
      pbkdf2Iterations: 10000,
      saltLength: 10
   });

function encrypt(val) {
   return cryptr.encrypt(val);
}

function decrypt(val) {
   return cryptr.decrypt(val);
}
module.exports = {
   encrypt,
   decrypt,
};
