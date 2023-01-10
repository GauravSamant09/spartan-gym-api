import express from 'express';
import { getPayments, createPayment, updatePayment } from '../controllers/payments.js';
import { getMembers } from '../controllers/members.js';

const router = express.Router();

router.get('/', getPayments);
router.post('/', createPayment);
router.patch('/:id', updatePayment);

export default router;