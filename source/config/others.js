import rateLimit from 'express-rate-limit';

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
   const numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
   });
   const parts = numberFormat.formatToParts(amount);
   let zeroDecimalCurrency = true;
   for (const part of parts) {
      if (part.type === 'decimal') {
         zeroDecimalCurrency = false;
      }
   }
   return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

const responseCustom = (res) => {
   return {
      code: res?.code,
      success: res?.success,
      data: res?.data,
      message: res?.message,
      error: res?.error,
   };
};

export {
   emailVerificationLimit,
   passwordVerificationLimit,
   formatAmountForStripe,
   responseCustom
};
