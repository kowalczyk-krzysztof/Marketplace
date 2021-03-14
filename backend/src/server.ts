import express, { urlencoded } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import xssAdvanced from 'xss-advanced';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import colors from 'colors';

import errorHandler from './middleware/error';
import productRouter from './routes/product';
import userRouter from './routes/user';
import adminRouter from './routes/admin';
import cartRouter from './routes/cart';
import categoryRouter from './routes/categories';
import { connectDB } from './config/db';

dotenv.config({ path: 'config.env' }); // exporting environment variables
connectDB(); // connecting to mongoDB

const app = express();
// Set body parser
app.use(express.json());
app.use(urlencoded({ extended: true }));
// Prevent xss - needs to be after body parser
app.use(xssAdvanced());
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Prevent http param pollution
app.use(hpp());
// Enable CORS - this is needed so I can connect with frontend
app.use(cors());
// Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Set cookie parser
app.use(cookieParser());
// Set file uploader - createParentPath: true allows for dynamic paths
app.use(fileupload({ createParentPath: true, tempFileDir: '/tmp/' }));
// Set static folder
app.use(express.static(path.join(__dirname, '../', 'views')));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/categories', categoryRouter);
app.use(errorHandler); // errorHandler has to be after routers

const PORT = ((process.env.PORT as unknown) as number) || 5000;

app.listen(PORT, (): void => {
  console.log(
    colors.yellow.bgGreen.bold(
      `Server is up and running @ http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
    )
  );
});
