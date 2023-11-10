import dotenv from 'dotenv';
dotenv.config();

export const isApiKey = async (req, res, next) => {
   try {
      const headerApiKey = req.header("x-api-key");
      const apiKey = process.env.API_KEY;
      if (apiKey === headerApiKey) {
         next();
      } else {
         res.status(401).send({
            success: false,
            message: 'API Key invalid',
         });
      }
   } catch (err) {
      res.status(401).send({
         success: false,
         message: 'You are not logged in',
      });
   }
};