import { object, string } from "yup";

const body = object().shape({
   name: string().required(),
   email: string().required(),
   username: string().required(),
   password: string().required(),
});

const bodyUpdate = object().shape({
   name: string().required(),
   email: string().required(),
   username: string().required(),
});

const params = object({
   id: string().required(),
});

const userCreateSchema = object({
   body: body
});

const userUpdateSchema = object({
   body: bodyUpdate,
   params: params,
});

const userParamsIdSchema = object({
   params: params,
});


export {
   userCreateSchema,
   userUpdateSchema,
   userParamsIdSchema
};