import express from 'express';
import Member from '../models/member.js';

const router = express.Router();

export const getDashboard = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 100;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await Member.countDocuments({});
        const members = await Member.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        const todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);

        const defaulters = members.filter(member =>
            todaysDate >= new Date(member.paymentDueDate).setHours(0, 0, 0, 0)
        );
        // defaulters.forEach(element => {
        //     var Difference_In_Time = todaysDate.getTime() - (new Date(element.paymentDueDate).setHours(0, 0, 0, 0)).getTime();
        //     defaulters.numberOfDays = Difference_In_Time / (1000 * 3600 * 24);
        // });

        res.json({ data: defaulters, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export default router;