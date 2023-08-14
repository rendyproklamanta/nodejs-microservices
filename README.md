##Nodejs Based Microservices
- Using docker
- Seperate directory services for runing each docker service

##Tech and Packages we use in this project:

- Node.js framework Express.js.
- Mongodb use for database .
- Mongoose for all schema validation and database connection.
- JsonwebToken for create jsonwebtoken.
- BcryptJs for password encryption.
- Day.js for data format.
- Dotenv for use environment variable.
- Nodemon for run on dev server.
- Cors and Body parser
- morgan http logger
- express validator

###Step 1 : Configure your .env file:

Within the project directory you'll find a .env.example file just rename it as .env and paste your Mongo_Uri and JWT_SECRET.

###Step 2 : Running the project:

```
-- Import data to mongodb --
⦁ yarn data:import

-- Install dep and run --
⦁ yarn install
⦁ yarn dev
⦁ ngrok http 3000
```
