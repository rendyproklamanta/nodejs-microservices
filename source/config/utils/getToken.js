export const getToken = async (req) => {
   try {
      if (
         req.headers.authorization &&
         req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
         return req.headers.authorization.split(" ")[1];
      } else if (req.cookies.accessToken) {
         return req.cookies.accessToken;
      } else {
         return false;
      }
   } catch (err) {
      return false;
   }
};