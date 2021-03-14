import mongoose, { Schema } from 'mongoose';
import { ObjectID } from 'mongodb';

import Category from './Category';
import User from './User';
import { ErrorResponse } from '../utils/ErrorResponse';

interface Product extends mongoose.Document {
  name: string;
  photos: string[];
  quantity: number;
  stock: string;
  description: string;
  addedById: ObjectID;
  pricePerUnit: number;
  categories: mongoose.Types.Array<ObjectID>;
}

// Interface ProductModel is needed for static methods to work with TypeScript
interface ProductModel extends mongoose.Model<Product> {
  productExists(id: ObjectID): Promise<Product>;
  categoryValidation(categories: ObjectID[]): Promise<[ObjectID[], Category[]]>; // This is called a tuple
}
export const ProductSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name needs to be at least 2 characters'],
      maxlength: [30, 'Product name can not be more than 50 characters'],
      index: { type: 'text' },
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
    createdAt: { type: Date, immutable: true },
    addedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },

  { timestamps: true } // this has to be passed to constructor, so after the object with all properties
);

// For some reason for this hook to work you need to use deleteOne - findByIdAndDelete and findOneAndDelete won't work. You also need to pass in options { document: true, query: false } to access "this"
ProductSchema.post<Product>(
  'deleteOne',
  { document: true, query: false },
  async function () {
    // Removing product from categories it belongs to
    const categoriesToRemoveFrom: ObjectID[] = this.categories;
    const categories: Category[] = await Category.find({
      _id: { $in: categoriesToRemoveFrom },
    });
    for (const category of categories) {
      category.products.pull(this.id);
      category.save();
    }
    // Remove product from user who created it
    const owner: ObjectID = this.addedById;
    const user = await User.userExists(owner);
    user.addedProducts.pull(this.id);
    user.save();
  }
);
// Check if products exists
ProductSchema.statics.productExists = async function (
  id: ObjectID
): Promise<Product> {
  let product: Product | null = await Product.findOne({ _id: id });
  if (!product)
    throw new ErrorResponse(`Product with id of ${id} does not exist`, 404);
  return product;
};

// Check if categories are valid
// ATTENTION: This mathod makes it so you add/update categories by name not id
ProductSchema.statics.categoryValidation = async function (
  categories: string[]
): Promise<[ObjectID[], Category[]]> {
  const categoryNamesToCheck: string[] = categories; // Array of category names from req.body.categories

  // Finds categories with names provided in req.body.categories.
  const categoryObjects: Category[] = await Category.find({
    name: { $in: categoryNamesToCheck },
  });

  const validCategoriesByName: string[] = []; // This array will contain names of valid categories
  const invalidCategoriesByName: string[] = []; // This array will contain names of invalid categories
  const validCategoriesById: ObjectID[] = []; // This array will contain IDs of valid categories

  // After fetching valid categories (objects), push their names and IDs to arrays
  for (const category of categoryObjects) {
    validCategoriesByName.push(category.name);
    validCategoriesById.push(category._id);
  }

  // This loop is here so you can send an error with names of categories that don't exist
  for (const categoryName of categoryNamesToCheck) {
    if (!validCategoriesByName.includes(categoryName))
      invalidCategoriesByName.push(categoryName);
  }
  // If any categories were invalid, send error with their names
  if (invalidCategoriesByName.length > 0)
    throw new ErrorResponse(
      `Categories ${invalidCategoriesByName} do not exist`,
      404
    );
  // Return array with valid category IDs and an aray of valid category objects
  return [validCategoriesById, categoryObjects];
};

const Product: ProductModel = mongoose.model<Product, ProductModel>(
  'Product',
  ProductSchema
);
export default Product;
