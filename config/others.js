const rateLimit = require('express-rate-limit');

//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
   windowMs: minutes * 60 * 1000,
   max: 3,
   handler: (req, res) => {
      res.status(429).send({
         success: false,
         message: `You made too many requests. Please try again after ${minutes} minutes.`,
      });
   },
});

const passwordVerificationLimit = rateLimit({
   windowMs: minutes * 60 * 1000,
   max: 3,
   handler: (req, res) => {
      res.status(429).send({
         success: false,
         message: `You made too many requests. Please try again after ${minutes} minutes.`,
      });
   },
});

//handle amount format for stripe
const formatAmountForStripe = (amount, currency) => {
   let numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
   });
   const parts = numberFormat.formatToParts(amount);
   let zeroDecimalCurrency = true;
   for (let part of parts) {
      if (part.type === 'decimal') {
         zeroDecimalCurrency = false;
      }
   }
   return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

const correlationId = () => {
   return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
};

const optionsRabbitMq = {
   arguments: {
      "x-message-ttl": 1000,
      "x-expires": 1000
   }
};


module.exports = {
   emailVerificationLimit,
   passwordVerificationLimit,
   formatAmountForStripe,
   correlationId,
   optionsRabbitMq,
};
