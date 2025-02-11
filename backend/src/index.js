import express from 'express';
import connectToDB from './config/db_connection.js';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { instructorRouter } from './routes/instructor.route.js';

dotenv.config();

const app = express();
const PORT = 8080 || process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/instructor', instructorRouter);

connectToDB()
.then((res) => {
    // console.log(res)
})
.catch((error) => {
    console.log(error);
});


app.listen(PORT, () => console.log(`server started on Port ${PORT}`));