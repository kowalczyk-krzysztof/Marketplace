import mongoose from 'mongoose';
// Connecting to mongoDB cluster
export const connectDB = async () => {
  const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
