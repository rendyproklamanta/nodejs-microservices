import rateLimit from 'express-rate-limit';

const minutes = 30;
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

export default passwordVerificationLimit;
