import { correlationId, sendQueue } from '@config/broker.js';
import { userConsumer } from '../brokers/consumer/user.consumer.js';
import { QUEUE_USER_CREATE, QUEUE_USER_DELETE, QUEUE_USER_GET_ALL, QUEUE_USER_GET, QUEUE_USER_UPDATE, QUEUE_USER_VERIFY_EMAIL, QUEUE_USER_FORGET_PASSWORD, QUEUE_USER_RESET_PASSWORD, QUEUE_USER_CHANGE_PASSWORD, QUEUE_USER_SIGNUP_PROVIDER, QUEUE_USER_GENERATE_DUMMY } from '@root/config/queue/userQueue.js';
import responseCustom from '@root/config/utils/responseCustom.js';

(async () => {
   await userConsumer();
})();

// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
      };

      const queue = QUEUE_USER_CREATE;
      const queueReply = QUEUE_USER_CREATE + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(responseCustom(result));

   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:81 ~ createUser ~ err:", err);
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique

      const payload = {
         ...req.body,
         id: req.params.id
      };

      const queue = QUEUE_USER_UPDATE;
      const queueReply = QUEUE_USER_UPDATE + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(404).send({
         success: false,
         message: 'Update user failed',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const deleteUser = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.params.id;
      const queue = QUEUE_USER_DELETE;
      const queueReply = QUEUE_USER_DELETE + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (error) {
      return res.status(404).send({
         success: false,
         error: error.message,
      });
   }

};

// ! ==========================================
// ! Controller
// ! ==========================================
const getAllUsers = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.params.id;
      const queue = QUEUE_USER_GET_ALL;
      const queueReply = QUEUE_USER_GET_ALL + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const getUserById = async (req, res) => {

   try {
      const replyId = correlationId(); // is unique

      // get user by id
      const payload = {
         _id: req.params.id,
      };

      const queue = QUEUE_USER_GET;
      const queueReply = QUEUE_USER_GET + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);
   } catch (err) {
      console.log("🚀 ~ file: user.controller.js:118 ~ getUserById ~ err:", err);
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const verifyEmailAddress = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.body;
      const queue = QUEUE_USER_VERIFY_EMAIL;
      const queueReply = QUEUE_USER_VERIFY_EMAIL + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};


// ! ==========================================
// ! Controller
// ! ==========================================
const forgetPassword = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.body;
      const queue = QUEUE_USER_FORGET_PASSWORD;
      const queueReply = QUEUE_USER_FORGET_PASSWORD + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const resetPassword = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.body;
      const queue = QUEUE_USER_RESET_PASSWORD;
      const queueReply = QUEUE_USER_RESET_PASSWORD + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const changePassword = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.body;
      const queue = QUEUE_USER_CHANGE_PASSWORD;
      const queueReply = QUEUE_USER_CHANGE_PASSWORD + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const signUpWithProvider = async (req, res) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = req.body;
      const queue = QUEUE_USER_SIGNUP_PROVIDER;
      const queueReply = QUEUE_USER_SIGNUP_PROVIDER + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);

      return res.send(result);

   } catch (err) {
      return res.status(401).send({
         success: false,
         message: 'Get Token Error',
      });
   }
};

const generateDummyData = async (amount) => {
   try {
      const replyId = correlationId(); // is unique
      const payload = {
         numEntries: amount
      };
      const queue = QUEUE_USER_GENERATE_DUMMY;
      const queueReply = QUEUE_USER_GENERATE_DUMMY + replyId;
      const result = await sendQueue(queue, payload, replyId, queueReply);
      return result;

   } catch (err) {
      return err;
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const generateDummy = async (req, res) => {
   try {
      const getData = await generateDummyData(100); // Generate 30 million MAX

      let data = [];
      let totalPages = '';
      let totalRow = '';
      const filters = {};

      // Get all DATA for export
      if (req.params.type === 'all') {
         if (req.params) {
            return res.status(200).send({
               success: true,
               data: getData,
            });
         }
      }

      // Get data from body
      if (req.params.type === 'filter') {

         req.body.filter.forEach((filter) => {
            filters[filter.id] = filter.value;
         });

         const dataFilter = getData.filter((item) => {
            return (
               (!filters.id || String(item.id).toLowerCase().includes(filters.id.toLowerCase())) &&
               (!filters.firstName || item.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) &&
               (!filters.lastName || item.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) &&
               (!filters.company || item.company.toLowerCase().includes(filters.company.toLowerCase())) &&
               (!filters.city || item.city.toLowerCase().includes(filters.city.toLowerCase())) &&
               (!filters.country || item.country.toLowerCase().includes(filters.country.toLowerCase()))
            );
         });

         //totalRow = data.length;
         let page = parseInt(req.body.page);
         const pageSize = parseInt(req.body.pageSize);

         // pagination
         if (page === 0) {
            page = 1;
         } else {
            page = +page + 1;
         }

         const startIndex = (page - 1) * pageSize;
         const endIndex = page * pageSize;

         data = dataFilter.slice(startIndex, endIndex);
         totalPages = Math.ceil(dataFilter.length / pageSize);
         totalRow = dataFilter.length;
      }

      // Get data from query
      if (req.params.type !== 'filter' && Object.keys(req.query).length > 0) {
         let page = parseInt(req.query.page);
         const pageSize = parseInt(req.query.pageSize);

         // pagination
         if (page === 0) {
            page = 1;
         } else {
            page = +page + 1;
         }

         // Calculate the start and end indexes for the requested page
         const startIndex = (page - 1) * pageSize;
         const endIndex = page * pageSize;

         data = getData.slice(startIndex, endIndex);
         totalPages = Math.ceil(getData.length / pageSize);
         totalRow = getData.length;
      }

      return res.status(200).send({
         success: true,
         data,
         totalPages,
         totalRow,
      });
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

export {
   createUser,
   updateUser,
   getAllUsers,
   getUserById,
   deleteUser,

   signUpWithProvider,
   verifyEmailAddress,
   forgetPassword,
   changePassword,
   resetPassword,
   generateDummy,
};
