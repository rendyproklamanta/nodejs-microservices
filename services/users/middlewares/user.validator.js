const yup = require("yup");

const body = yup.object().shape({
   name: yup.string().required(),
   email: yup.string().required(),
   username: yup.string().required(),
   password: yup.string().required(),
});

const params = yup.object({
   id: yup.string().required(),
});

const userCreateSchema = yup.object({
   body: body
});

const userUpdateSchema = yup.object({
   body: body,
   params: params,
});

const userParamsIdSchema = yup.object({
   params: params,
});


module.exports = {
   userCreateSchema,
   userUpdateSchema,
   userParamsIdSchema
};