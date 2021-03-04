import mongoose, { ObjectId } from 'mongoose';
interface Cart extends mongoose.Document {
  owner: mongoose.Types.Array<ObjectId>;
  product: mongoose.Types.Array<ObjectId>;
}
interface CartModel extends mongoose.Model<Cart> {
  cartExists(id: string): Promise<any>;
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

CartSchema.statics.cartExists = async function (id) {
  let cart = await Cart.findOne({ owner: id }).populate(
    'product',
    'name pricePerUnit stock description addedBy photo'
  );
  if (!cart) cart = await Cart.create({ owner: id });
  return cart;
};

const Cart = mongoose.model<Cart, CartModel>('Cart', CartSchema);
export default Cart;
