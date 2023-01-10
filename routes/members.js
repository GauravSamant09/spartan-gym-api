import express from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/members.js';

const router = express.Router();

router.get('/', getMembers);
router.post('/', createMember);
router.patch('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;