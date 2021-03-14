import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
interface Cart extends mongoose.Document {
  owner: ObjectID;
  products: mongoose.Types.Array<ObjectID | string>;
}
interface CartModel extends mongoose.Model<Cart> {
  cartExists(id: ObjectID): Promise<Cart>;
}

const CartSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);
// Check if cart exists
CartSchema.statics.cartExists = async function (id: ObjectID): Promise<Cart> {
  let cart: Cart | null = await Cart.findOne({ owner: id });
  if (!cart) cart = await Cart.create({ owner: id });
  return cart;
};

const Cart: CartModel = mongoose.model<Cart, CartModel>('Cart', CartSchema);
export default Cart;
