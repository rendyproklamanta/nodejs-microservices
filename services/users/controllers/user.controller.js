const bcrypt = require('bcryptjs');
const { signInToken } = require('../../auths/middlewares/auth.middleware');
const UserModel = require('../models/user.model');
const { roleUser } = require('../../../config/permission');


// ! ==========================================
// ! Controller
// ! ==========================================
const createUser = async (req, res) => {
   try {
      const data = {
         role: req.body.role,
         name: req.body.name,
         username: req.body.username,
         password: bcrypt.hashSync(req.body.password),
         permission: roleUser,
      };

      const isAdded = await UserModel.findOne({ username: data.username });
      if (isAdded) {
         return res.status(403).send({
            success: false,
            message: `Username ${data.username} is already Added!`,
         });
      } else {
         const scheme = new UserModel(data);
         const save = await scheme.save();
         const token = signInToken(save);
         res.send({
            success: true,
            token,
            data
         });
      }
   } catch (err) {
      res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

// ! ==========================================
// ! Controller
// ! ==========================================
const updateUser = async (req, res) => {
   try {
      const data = {
         role: req.body.role,
         name: req.body.name,
         username: req.body.username,
         password: bcrypt.hashSync(req.body.password),
      };
      await UserModel.findByIdAndUpdate(req.params.id, data);
      return res.status(200).send({
         success: true,
         data,
      });
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
const deleteUser = (req, res) => {
   UserModel.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
         return res.status(500).send({
            success: false,
            message: err.message,
         });
      } else {
         return res.status(200).send({
            success: true,
            message: 'User Deleted Successfully!',
         });
      }
   });
};

// ! ==========================================
// ! Controller
// ! ==========================================
const getAllUsers = async (req, res) => {
   try {
      const exclude = '-password'; // exclude property
      const data = await UserModel.find({}, exclude).sort({ _id: -1 });
      return res.status(200).send({
         success: true,
         data
      });

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
      const data = await UserModel.findById(req.params.id);
      return res.status(200).send({
         success: true,
         data
      });
   } catch (err) {
      return res.status(500).send({
         success: false,
         message: err.message,
      });
   }
};

module.exports = {
   createUser,
   updateUser,
   deleteUser,
   getAllUsers,
   getUserById,

};
