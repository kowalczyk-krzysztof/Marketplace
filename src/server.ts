import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import errorHandler from './middleware/error';
import userRouter from './routes/auth';

dotenv.config({ path: 'config.env' }); // exporting environment variables
connectDB(); // connecting to mongoDB

const app = express();

app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser

app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', userRouter);
app.use(errorHandler); // errorHandler has to be after routers

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(
    `Server is up and running @ http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  );
});
