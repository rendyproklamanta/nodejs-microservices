module.exports = {
   "env": {
      "node": true,
      "commonjs": true,
      "es2021": true
   },
   "extends": "eslint:recommended",
   "overrides": [
      {
         "env": {
            "node": true
         },
         "files": [
            ".eslintrc.{js,cjs}"
         ],
         "parserOptions": {
            "sourceType": "script"
         }
      }
   ],
   // "parser": "babel-eslint",
   "parserOptions": {
      "ecmaVersion": "latest"
   },
   "rules": {
      "semi": [1, "always"]
   }
};
