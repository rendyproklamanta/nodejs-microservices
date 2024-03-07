// Load all routes here!
const routes = [
   {
      service: 'services/auth/route.js',
      endpoint: '/api/auths',
      proxy: {
         target: "http://host.docker.internal:5001",
         changeOrigin: true,
      }
   },
   {
      service: 'services/user/route.js',
      endpoint: '/api/users',
      proxy: {
         target: "http://host.docker.internal:5002",
         changeOrigin: true,
      }
   }
];

export default routes;