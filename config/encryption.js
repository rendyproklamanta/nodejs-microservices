const crypto = require('crypto');

const secretKey = crypto.randomBytes(32);
const secretIV = crypto.randomBytes(16);
const algorithm = 'aes-256-cbc';

if (!secretKey || !secretIV || !algorithm) {
   throw new Error('secretKey, secretIV, and algorithm are required');
}

// Generate secret hash with crypto to use for encryption
const key = crypto
   .createHash('sha512')
   .update(secretKey)
   .digest('hex')
   .substring(0, 32);

const encryptionIV = crypto
   .createHash('sha512')
   .update(secretIV)
   .digest('hex')
   .substring(0, 16);

// Encrypt data
const encrypt = (val) => {
   const cipher = crypto.createCipheriv(algorithm, key, encryptionIV);

   // Encrypts data and converts to hex and base64
   return Buffer.from(
      cipher.update(val, 'utf8', 'hex') + cipher.final('hex')
   ).toString('base64');
};

// Decrypt data
const decrypt = (val) => {
   const buff = Buffer.from(val, 'base64');
   const decipher = crypto.createDecipheriv(algorithm, key, encryptionIV);

   // Decrypts data and converts to utf8
   return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
   );
};

module.exports = {
   encrypt,
   decrypt,
};
