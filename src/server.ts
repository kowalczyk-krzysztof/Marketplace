import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import errorHandler from './middleware/error';
import productRouter from './routes/product';
import userRouter from './routes/auth';
import adminRouter from './routes/admin';
import cartRouter from './routes/cart';

dotenv.config({ path: 'config.env' }); // exporting environment variables
connectDB(); // connecting to mongoDB

const app = express();

app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser

app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/cart', cartRouter);
app.use(errorHandler); // errorHandler has to be after routers

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(
    `Server is up and running @ http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  );
});
