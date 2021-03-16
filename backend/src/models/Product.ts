import mongoose, { Schema } from 'mongoose';
import { ObjectID } from 'mongodb';
import fs from 'fs';

import Category from './Category';
import User from './User';
import { ErrorResponse } from '../utils/ErrorResponse';
import { slugify } from '../utils/slugify';

interface Product extends mongoose.Document {
  name: string;
  photos: string[];
  quantity: number;
  stock: string;
  description: string;
  addedById: ObjectID;
  pricePerUnit: number;
  category: ObjectID | null;
  slug: string;
}

// Interface ProductModel is needed for static methods to work with TypeScript
interface ProductModel extends mongoose.Model<Product> {
  productExists(id: ObjectID): Promise<Product>;
}
export const ProductSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name needs to be at least 2 characters'],
      maxlength: [30, 'Product name can not be more than 50 characters'],
      index: true,
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
      index: { type: 'text' },
    },
    addedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    slug: String,
  },

  { timestamps: true } // this has to be passed to constructor, so after the object with all properties
);

// Create slug from name
ProductSchema.pre<Product>('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

// For some reason for this hook to work you need to use deleteOne - findByIdAndDelete and findOneAndDelete won't work. You also need to pass in options { document: true, query: false } to access "this"
// TODO: Delete images
ProductSchema.post<Product>(
  'deleteOne',
  { document: true, query: false },
  async function () {
    // Removing product from category it belongs to
    const category = this.category as ObjectID;
    const categoryToRemoveFrom = await Category.categoryIdExists(category);
    categoryToRemoveFrom.products.pull(this.id);
    categoryToRemoveFrom.save();
    // Remove product from user who created it
    const owner: ObjectID = this.addedById;
    const user = await User.userExists(owner);
    user.addedProducts.pull(this.id);
    user.save();
    // Deleting photos
    const dir = `${process.env.FILE_UPLOAD_PATH}/products/${this.id}`;
    fs.rmdirSync(dir, { recursive: true }); // recursive makes it so it also deletes all files in the folder
  }
);
// Check if products exists
ProductSchema.statics.productExists = async function (
  id: ObjectID
): Promise<Product> {
  const product: Product | null = await Product.findOne({ _id: id });
  if (!product)
    throw new ErrorResponse(`Product with id of ${id} does not exist`, 404);
  return product;
};

const Product: ProductModel = mongoose.model<Product, ProductModel>(
  'Product',
  ProductSchema
);
export default Product;
