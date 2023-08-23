require('dotenv').config();
const { signInToken } = require('@config/middlewares/auth.middleware');
const jwt = require('jsonwebtoken');
// const { ADMIN, USER } = require('@config/constants');


// ! ==========================================
// ! Middleware
// ! ==========================================
const refreshToken = async (req, res, next) => { // eslint-disable-line no-unused-vars
   try {
      let refreshToken;

      if (req.cookies.refreshToken) {
         refreshToken = req.cookies.refreshToken;
      } else {
         refreshToken = req.body.refreshToken;
      }

      if (!refreshToken) {
         return res.status(401).send({
            status: false,
            message: 'Access Denied. No refresh token provided.'
         });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const token = await signInToken(decoded);

      // res.header('Authorization', accessToken).send(decoded.user);
      return res.status(200).send({
         success: true,
         data: {
            accessToken: token.data
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





module.exports = {
   signInToken,
   refreshToken,
   tokenForVerify,
};
