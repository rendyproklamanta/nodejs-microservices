import { sendQueue } from '@root/config/broker.js';
import { QUEUE_LOGGER_MAIL } from '@root/config/queue/loggerQueue.js';
import dotenv from 'dotenv';
dotenv.config();
import { SendMailClient } from "zeptomail";

const sendEmailZeptoMsg = async (payload) => {
   const url = "api.zeptomail.com/";
   const token = "";
   let response = '';
   let error = '';

   const client = new SendMailClient({ url, token });

   client.sendMail({
      "from": payload.from,
      "to": payload.to,
      "subject": payload.subject,
      "textbody": payload.text,
      "htmlbody": payload.text,
      "track_clicks": true,
      "track_opens": true,
      "client_reference": "",
   }).then((res) => {
      console.log("🚀 ~ sendEmailZeptoMsg ~ res:", res);
      response = res;
   }).catch((err) => {
      console.log(err);
      error = err;
   });

   // send to logger
   const logPayload = {
      res: response,
      error,
      ...payload,
   };
   const queue = QUEUE_LOGGER_MAIL;
   await sendQueue(queue, logPayload);

};

export {
   sendEmailZeptoMsg,
};