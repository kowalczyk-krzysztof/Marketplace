import mongoose from 'mongoose';
import slugify from 'slugify';
import { Schema } from 'mongoose';
interface Product extends mongoose.Document {
  name: string;
  quantity: number;
  stock: string;
  description: string;
  addedBy: string;
  addedById: string;
  slug: string;
}
export const ProductSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxlength: [50, 'Product name can not be more than 50 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity can not be negative'],
      min: [0, 'Quantity can not be negative'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price must be higher than 0'],
      min: [0, 'Price must be higher than 0'],
    },
    stock: {
      type: String,
      enum: ['OUT OF STOCK', 'IN STOCK', 'NO INFO'],
      default: 'NO INFO',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    createdAt: { type: Date, immutable: true },
    addedBy: {
      type: String,
      required: true,
      immutable: true,
    },
    addedById: {
      type: String,
      required: true,
      immutable: true,
    },
    slug: String,
    // A slug is a human-readable, unique identifier, used to identify a resource instead of a less human-readable identifier like an id
  },
  { timestamps: true } // this has to be passed to constructor, so after the object with all properties
);

ProductSchema.pre<Product>('save', function (next) {
  // Has to be a normal function due to scope
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Product = mongoose.model<Product>('Product', ProductSchema);
export default Product;
