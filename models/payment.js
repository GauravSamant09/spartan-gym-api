import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
    member_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    numberOfMonths: Number,
    amount: Number,
    paymentDate: {
        type: Date,
        default: new Date(),
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }

})

var Payment = mongoose.model('Payment', paymentSchema);

export default Payment;