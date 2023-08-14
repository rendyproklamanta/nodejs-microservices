const yup = require("yup");

const body = yup.object().shape({
   username: yup.string().required(),
   password: yup.string().required(),
});

const params = yup.object({
   id: yup.string().required(),
});

const authCreateSchema = yup.object({
   body: body
});

const authUpdateSchema = yup.object({
   body: body,
   params: params,
});

const authParamsIdSchema = yup.object({
   params: params,
});


module.exports = {
   authCreateSchema,
   authUpdateSchema,
   authParamsIdSchema
};