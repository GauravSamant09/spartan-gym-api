import express from 'express';
import mongoose from 'mongoose';

import Payment from '../models/payment.js';
import Member from '../models/member.js';

const router = express.Router();

export const getPayments = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 10000;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        // const newPayments = Payment.aggregate({ $lookup: { from: "Member", localField: "member_id", foreignField: "_id", as: "members" } })
        // console.log(newPayments);

        // var new = await Payment.aggregate([s

        //     // Join with member     table
        //     {
        //         $lookup:{
        //             from: "Member",       // other table name
        //             localField: "member_id",   // name of users table field
        //             foreignField: "_id", // name of userinfo table field
        //             as: "member_info"         // alias for userinfo table
        //         }
        //     },
        //     {   $unwind:"$member_info" },     // $unwind used for getting data in object or for one record only

        //     // // define some conditions here 
        //     // {
        //     //     $match:{
        //     //         $and:[{"userName" : "admin"}]
        //     //     }
        //     // },

        //     // define which fields are you want to fetch
        //     {   
        //         $project:{
        //             _id : 1,
        //             member_id: 1,
        //             numberOfMonths: 1,
        //             amount: 1,
        //             paymentDate:1,
        //             createdAt: 1,
        //             member_name : "$member_info.name",
        //         } 
        //     },function (error, data) {
        //  return res.json(data);
        // ]);
        const total = await Payment.countDocuments({});
        const payments = await Payment.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
            .populate({ path: 'member_id', select: ['name'] });

        // get members for dropdown also
        const members = await Member.find().sort({ _id: -1 })

        res.json({ memberData: members, data: payments, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPayment = async (req, res) => {
    const payment = req.body;
    const member = await Member.findById(payment.member_id);

    var newDueDate = new Date((member.paymentDueDate).setMonth(member.paymentDueDate.getMonth() + Number(payment.numberOfMonths)))
    await Member.findByIdAndUpdate(payment.member_id, { ...member, paymentDueDate: newDueDate }, { new: true });


    const newPayment = new Payment({ ...payment, createdAt: new Date().toISOString(), paymentDate: new Date().toISOString() })

    try {
        await newPayment.save();
        res.status(201).json({ ...newPayment.toObject(), memberName: member.name });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { member_id, numberOfMonths, amount, paymentDate, createdAt, memberName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Payment with id: ${id}`);

    const updatedPayment = { member_id, numberOfMonths, amount, paymentDate, createdAt, _id: id };

    await Payment.findByIdAndUpdate(id, updatedPayment, { new: true });
    res.json({ ...updatedPayment, memberName: memberName });
}

export default router;