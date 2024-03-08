import { sendReply } from "@root/config/broker.js";

const generateDummyDataMsg = async (payload, msg) => {
   const data = [];
   const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'India'];
   const chunkSize = 100000; // Generate data in chunks of 100000 entries

   for (let chunk = 0; chunk < Math.ceil(payload.numEntries / chunkSize); chunk++) {
      const chunkData = [];
      for (let i = 1; i <= chunkSize; i++) {
         const index = (chunk * chunkSize) + i;
         if (index > payload.numEntries) break;

         const randomFirstName = `First${index}`;
         const randomLastName = `Last${index}`;
         const randomCompany = `Company${index}`;
         const randomCity = `City${index}`;
         const randomCountry = countries[Math.floor(Math.random() * countries.length)];

         chunkData.push({
            id: index,
            firstName: randomFirstName,
            lastName: randomLastName,
            company: randomCompany,
            city: randomCity,
            country: randomCountry,
         });
      }
      data.push(...chunkData);
   }

   sendReply(msg, {
      data,
   });
};

export default generateDummyDataMsg;