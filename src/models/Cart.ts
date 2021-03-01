import mongoose from 'mongoose';

interface Cart extends mongoose.Document {
  user: any;
  product: any;
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

const Cart = mongoose.model<Cart>('Cart', CartSchema);
export default Cart;
