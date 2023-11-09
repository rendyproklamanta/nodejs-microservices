import { object, string } from "yup";

const body = object().shape({
   username: string().required(),
   password: string().required(),
});

const params = object({
   id: string().required(),
});

const authCreateSchema = object({
   body: body
});

const authUpdateSchema = object({
   body: body,
   params: params,
});

const authParamsIdSchema = object({
   params: params,
});


export {
   authCreateSchema,
   authUpdateSchema,
   authParamsIdSchema
};