import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ErrorResponse } from '../utils/ErrorResponse';

interface Product extends mongoose.Document {
  name: string;
  photos: string[];
  quantity: number;
  stock: string;
  description: string;
  addedById: string;
  // slug: string;
  categories: string;
}

// Interface ProductModel is needed for static methods to work with TypeScript
interface ProductModel extends mongoose.Model<Product> {
  productExists(id: string): Promise<Product>;
}
export const ProductSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name needs to be at least 2 characters'],
      maxlength: [30, 'Product name can not be more than 50 characters'],
    },
    photos: [
      {
        type: String,
        default: 'no_photo.jpg',
      },
    ],
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
      minlength: [4, 'Description needs to be at least 4 characters'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    createdAt: { type: Date, immutable: true },
    addedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // slug: String,
    // A slug is a human-readable, unique identifier, used to identify a resource instead of a less human-readable identifier like an id
    categories: [String],
  },

  { timestamps: true } // this has to be passed to constructor, so after the object with all properties
);

ProductSchema.pre<Product>('save', function (next) {
  // this.slug = slugify(this.name, { lower: true });
  next();
});

ProductSchema.statics.productExists = async function (id) {
  let product: Product | null = await Product.findById(id);
  if (!product)
    throw new ErrorResponse(`Product with id of ${id} does not exist`, 404);
  return product;
};

const Product: ProductModel = mongoose.model<Product, ProductModel>(
  'Product',
  ProductSchema
);
export default Product;

// TODO: On remove
