import { Router } from 'express';
import { loggerConsumer } from './brokers/consumer/logger.consumer.js';

const router = Router();
const ENDPOINT = '/api/notification';

(async () => {
   await loggerConsumer();
})();

//root route
const defaultRes = (res) => {
   return res.status(200).send('Logger Service is Running!');
};
router.get(`${ENDPOINT}`, (_, res) => {
   return defaultRes(res);
});
router.get(`/`, (_, res) => {
   return defaultRes(res);
});

export default router;
