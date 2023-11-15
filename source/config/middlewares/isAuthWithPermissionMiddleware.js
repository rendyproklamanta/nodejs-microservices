import { correlationId, sendQueue } from '@config/broker.js';
import { getToken } from '@root/services/auth/utils/getToken.js';
import { QUEUE_AUTH_READ_TOKEN_JWT } from '../queue/authQueue.js';
import { QUEUE_USER_GET } from '../queue/userQueue.js';
import { ROLE_TYPE_ACCOUNTING, ROLE_TYPE_ADMIN, ROLE_TYPE_USER, roleAccounting, roleAdmin, roleUser } from '@root/services/user/constants/permission.js';

const isAuthWithPermissionMiddleware = (access) => async (req, res, next) => {
   try {
      if (!access) {
         return res.status(401).send({ success: false, message: "No roles access defined" });
      }

      const replyId = correlationId(); // is unique
      const token = await getToken(req);
      let payload;
      let queue;
      let queueReply;

      if (!token) {
         return res.status(500).send({
            success: false,
            message: 'No token provided'
         });
      }

      // decoded token
      payload = token;
      queue = QUEUE_AUTH_READ_TOKEN_JWT;
      queueReply = QUEUE_AUTH_READ_TOKEN_JWT + replyId;
      const resultToken = await sendQueue(queue, payload, replyId, queueReply);

      if (!resultToken.success) {
         return res.status(500).send({
            success: false,
            error: resultToken.error
         });
      }

      // get user by id
      payload = resultToken?.data?._id;
      queue = QUEUE_USER_GET;
      queueReply = QUEUE_USER_GET + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

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
   } catch (error) {
      console.log("🚀 ~ file: isAuthWithPermissionMiddleware.js:78 ~ isAuthWithPermissionMiddleware ~ error:", error);
   }


};

export default isAuthWithPermissionMiddleware;