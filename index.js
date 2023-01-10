import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import memberRoutes from './routes/members.js'
import paymentRoutes from './routes/payments.js'
import dashboardRoutes from './routes/dashboard.js'

import dotenv from 'dotenv'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('api/members', memberRoutes);
app.use('/payments', paymentRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));
