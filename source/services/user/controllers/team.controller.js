import bcryptjs from 'bcryptjs';
import UserModel from '../models/user.model.js';
import { ROLE_TYPE_ACCOUNTING, ROLE_TYPE_ADMIN, ROLE_TYPE_USER, roleAccounting, roleAdmin, roleUser } from '../constants/roles.js';

const teamCreateGenerate = async (req, res) => {
   try {
      const role = req.params.role;
      const name = role === 'admin' ? 'Administrator' : 'User';
      const username = role === 'admin' ? 'admin' : 'User';
      const email = 'test@test.com';
      const password = '123qwe';
      const permission = role === 'admin' ? roleAdmin : roleUser;

      const isAdded = await UserModel.findOne({ username: username });
      if (isAdded) {
         return res.status(403).send({
            success: false,
            message: `Username ${username} is already Added!`,
         });
      } else {
         const data = new UserModel({
            role: role,
            name: name,
            username: username,
            email: email,
            password: bcryptjs.hashSync(password),
            permission: permission,
         });
         await data.save();
         return res.send({
            success: true,
            data
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err?.message,
         errorCode: err?.code,
         keyValue: err?.keyValue,
      });
   }
};


// ! ==========================================
// ! Controller
// ! ==========================================
const teamCreate = async (req, res) => {
   try {
      const username = req.body.username;
      const role = req.body.role;
      const isAdded = await UserModel.findOne({ username: username });

      if (isAdded) {
         return res.status(403).send({
            success: false,
            message: `Username ${username} is already Added!`,
         });
      }

      let permission;
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

      const perms = {
         role: permission
      };

      const formData = { perms, ...req.body };

      const data = await UserModel.create(formData);
      if (data) {
         return res.status(200).send({
            success: true,
            data,
         });
      } else {
         return res.status(500).send({
            success: false,
            data,
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err?.message,
         errorCode: err?.code,
         keyValue: err?.keyValue,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const teamUpdate = async (req, res) => {
   try {
      const id = req.params.id;

      const payload = {
         ...req.body,
      };

      const data = await UserModel.findByIdAndUpdate(id, payload);
      if (data) {
         return res.status(200).send({
            success: true,
            data,
         });
      } else {
         return res.status(500).send({
            success: false,
            data,
         });
      }
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err?.message,
         errorCode: err?.code,
         keyValue: err?.keyValue,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const teamDelete = async (req, res) => {
   try {
      const id = req.params.id;
      const query = {
         _id: id,
      };

      const data = await UserModel.findOneAndDelete(query);
      if (data) {
         return res.status(200).send({
            success: true,
            data,
         });
      } else {
         return res.status(500).send({
            success: false,
            data,
         });
      }

   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err?.message,
         errorCode: err?.code,
         keyValue: err?.keyValue,
      });
   }
};

export {
   teamCreateGenerate,
   teamCreate,
   teamUpdate,
   teamDelete,
};
