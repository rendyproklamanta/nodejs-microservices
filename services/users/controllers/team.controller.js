const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
const UserModel = require('../models/user.model');
const { roleAdmin, roleUser } = require('../../../config/permission');

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
            password: bcrypt.hashSync(password),
            permission: permission,
         });
         await data.save();
         res.send({
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
      const role = req.body.permission;
      const isAdded = await UserModel.findOne({ username: username });

      if (isAdded) {
         return res.status(403).send({
            success: false,
            message: `Username ${username} is already Added!`,
         });
      }

      let permission;
      switch (role) {
         case 'admin':
            permission = roleAdmin;
            break;
         case 'user':
            permission = roleUser;
            break;
         case 'finance':
            permission = roleUser;
            break;
         default:
            break;
      }

      const perms = {
         permission: permission
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
      const data = await UserModel.findByIdAndUpdate(id, req.body);
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

module.exports = {
   teamCreateGenerate,
   teamCreate,
   teamUpdate,
   teamDelete,
};
