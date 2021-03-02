import mongoose, { ObjectId } from 'mongoose';

interface Cart extends mongoose.Document {
  owner: mongoose.Types.Array<ObjectId>;
  product: mongoose.Types.Array<ObjectId>;
}
const CartSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model<Cart & mongoose.Document>('Cart', CartSchema);
export default Cart;
