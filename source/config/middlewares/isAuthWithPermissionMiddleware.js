import { correlationId, sendQueue } from '@config/broker.js';
import { getToken } from '@root/services/auth/utils/getToken.js';
import { QUEUE_AUTH_READ_TOKEN_JWT } from '../queue/authQueue.js';
import { QUEUE_USER_GET } from '../queue/userQueue.js';
import { ROLE_TYPE_ACCOUNTING, ROLE_TYPE_ADMIN, ROLE_TYPE_USER, roleAccounting, roleAdmin, roleUser } from '@root/services/user/constants/permission.js';

const isAuthWithPermissionMiddleware = (access) => async (req, res, next) => {

   if (!access) {
      return res.status(401).send({ success: false, message: "No roles access defined" });
   }

   const replyId = correlationId(); // is unique
   const token = await getToken(req);

   if (!token) {
      return res.status(500).send({
         success: false,
         message: 'No token provided'
      });
   }

   // decoded token
   const payloadToken = token;
   const queueToken = QUEUE_AUTH_READ_TOKEN_JWT;
   const queueReplyToken = QUEUE_AUTH_READ_TOKEN_JWT + replyId;
   const resultToken = await sendQueue(queueToken, payloadToken,replyId, queueReplyToken);

   if (!resultToken.success) {
      return res.status(500).send({
         success: false,
         error: resultToken.error
      });
   }

   // get user by token
   const payloadFindOne = resultToken?.data?._id;
   const queueFindOne = QUEUE_USER_GET;
   const queueReplyFindOne = QUEUE_USER_GET + replyId;
   const result = await sendQueue(queueFindOne, payloadFindOne,replyId, queueReplyFindOne);

   let permission = [];
   const role = result?.data?.role;

   switch (role) {
   case ROLE_TYPE_ADMIN:
      permission = roleAdmin;
      break;
   case ROLE_TYPE_USER:
      permission = roleUser;
      break;
   case ROLE_TYPE_ACCOUNTING:
      permission = roleAccounting;
      break;
   default:
      break;
   }

   let hasAccess = false;
   if (role === ROLE_TYPE_ADMIN) {
      hasAccess = true;
   } else if (permission?.includes(access)) {
      hasAccess = true;
   }

   if (hasAccess) {
      return next();
   } else {
      return res.status(401).send({
         success: false,
         message: 'You have no access',
      });
   }
};

export default isAuthWithPermissionMiddleware;