// Load all routes here!
const routes = [
   {
      service: 'services/auth/route.js',
      endpoint: '/api/auth',
      proxy: {
         target: "http://localhost:5001",
         changeOrigin: true,
      }
   },
   {
      service: 'services/user/route.js',
      endpoint: '/api/user',
      proxy: {
         target: "http://localhost:5002",
         changeOrigin: true,
      }
   }
];

export default routes;