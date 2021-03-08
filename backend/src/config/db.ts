import mongoose from 'mongoose';
import colors from 'colors';
// Connecting to mongoDB cluster
export const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    colors.yellow.bgCyan.bold(`MongoDB Connected: ${conn.connection.host}`)
  );
};
