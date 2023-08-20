// Load all routes here!
const routes = [
   {
      service: '@services/auths/route',
      endpoint: '/api/auths',
      proxy: {
         target: "http://localhost:5001",
         changeOrigin: true,
      }
   },
   {
      service: '@services/users/route',
      endpoint: '/api/users',
      proxy: {
         target: "http://localhost:5002",
         changeOrigin: true,
      }
   }
];

module.exports = routes;