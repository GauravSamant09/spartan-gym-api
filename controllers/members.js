import express from 'express';
import mongoose from 'mongoose';

import Member from '../models/member.js';

const router = express.Router();

export const getMembers = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 100;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await Member.countDocuments({});
        const members = await Member.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: members, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createMember = async (req, res) => {
    const member = req.body;

    const newMember = new Member({ ...member, creator: req.userId, createdAt: new Date().toISOString(), startedOn: new Date().toISOString(), paymentDueDate: new Date().toISOString() })

    try {
        await newMember.save();

        res.status(201).json(newMember);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateMember = async (req, res) => {
    const { id } = req.params;
    const { name, mobile, creator, startedOn, paymentDueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No member with id: ${id}`);

    const updatedMember = { creator, name, mobile, startedOn, paymentDueDate, _id: id };

    await Member.findByIdAndUpdate(id, updatedMember, { new: true });

    res.json(updatedMember);
}

export const deleteMember = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No member with id: ${id}`);

    await Member.findByIdAndRemove(id);

    res.json({ message: "Member deleted successfully." });
}

export default router;