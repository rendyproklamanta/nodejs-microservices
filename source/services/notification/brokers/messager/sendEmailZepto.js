import dotenv from 'dotenv';
dotenv.config();
import { SendMailClient } from "zeptomail";

const sendEmailZeptoMsg = (payload) => {
   const url = "api.zeptomail.com/";
   const token = "";

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
   }).then((resp) => {
      console.log("success");
   }).catch((error) => console.log(error));
};

export {
   sendEmailZeptoMsg,
};