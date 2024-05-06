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
   },
   {
      service: 'services/logger/route.js',
      endpoint: '/api/loggers',
      proxy: {
         target: "http://host.docker.internal:5003",
         changeOrigin: true,
      }
   },
   {
      service: 'services/notification/route.js',
      endpoint: '/api/notifications',
      proxy: {
         target: "http://host.docker.internal:5004",
         changeOrigin: true,
      }
   },
];

export default routes;