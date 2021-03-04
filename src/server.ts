import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import { connectDB } from './config/db';
import errorHandler from './middleware/error';
import productRouter from './routes/product';
import userRouter from './routes/user';
import adminRouter from './routes/admin';
import cartRouter from './routes/cart';
import colors from 'colors';

dotenv.config({ path: 'config.env' }); // exporting environment variables
connectDB(); // connecting to mongoDB

const app = express();
// Set body parser
app.use(express.json());
// Set cookie parser
app.use(cookieParser());
// Set file uploader
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, '../', 'views')));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/cart', cartRouter);
app.use(errorHandler); // errorHandler has to be after routers

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(
    colors.yellow.bgGreen.bold(
      `Server is up and running @ http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
    )
  );
});
