import mongoose from 'mongoose';

const memberSchema = mongoose.Schema({
    name: String,
    mobile: String,
    startedOn: {
        type: Date,
        default: new Date(),
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    paymentDueDate: {
        type: Date,
        default: new Date(),
    },
})

var Member = mongoose.model('Member', memberSchema);

export default Member;