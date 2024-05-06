import { Router } from 'express';
import { notificationConsumer } from './brokers/consumer/notif.consumer.js';

const router = Router();
const ENDPOINT = '/api/notification';

(async () => {
   await notificationConsumer();
})();

//root route
const defaultRes = (res) => {
   return res.status(200).send('Notification Service is Running!');
};
router.get(`${ENDPOINT}`, (_, res) => {
   return defaultRes(res);
});
router.get(`/`, (_, res) => {
   return defaultRes(res);
});

export default router;
