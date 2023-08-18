require('dotenv').config();
const jwt = require('jsonwebtoken');
// const { ADMIN, USER } = require('@config/constants');

// ! ==========================================
// ! Middleware
// ! ==========================================
const signInToken = (user, expiresIn) => {
   return jwt.sign(
      {
         _id: user._id,
         name: user.name,
         email: user.email,
         address: user.address,
         role: user.role,
         permission: user.permission,
      },
      process.env.JWT_SECRET,
      {
         // expiresIn: '365d',
         expiresIn: expiresIn ?? '1m',
      }
   );
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const refreshToken = async (req, res, next) => { // eslint-disable-line no-unused-vars
   try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
         return res.status(401).send({
            status: false,
            message: 'Access Denied. No refresh token provided.'
         });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const accessToken = signInToken(decoded);

      // res.header('Authorization', accessToken).send(decoded.user);
      return res.status(200).send({
         success: true,
         data: {
            accessToken,
         }
      });
   } catch (error) {
      return res.status(401).send({
         status: false,
         message: error
      });
   }
};

// ! ==========================================
// ! Middleware
// ! ==========================================
const tokenForVerify = (user) => {
   return jwt.sign(
      {
         _id: user._id,
         name: user.name,
         email: user.email,
         password: user.password,
      },
      process.env.JWT_SECRET_FOR_VERIFY,
      { expiresIn: '15m' }
   );
};

// ! ==========================================
// ! Middleware
// ! ==========================================




// ! ==========================================
// ! Middleware
// ! ==========================================
const isApiKey = async (req, res, next) => {
   try {
      const headerApiKey = req.header("x-api-key");
      const apiKey = process.env.API_KEY;
      if (apiKey === headerApiKey) {
         next();
      } else {
         res.status(401).send({
            message: 'API Key failed',
         });
      }
   } catch (err) {
      res.status(401).send({
         message: 'You are not logged in',
      });
   }
};


module.exports = {
   signInToken,
   refreshToken,
   tokenForVerify,
   isApiKey,
   // isAuthWithRoles,
};
