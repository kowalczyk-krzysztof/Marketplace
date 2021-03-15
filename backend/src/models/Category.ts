import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';

import Product from './Product';
import { ErrorResponse } from '../utils/ErrorResponse';

interface Category extends mongoose.Document {
  name: string;
  description: string;
  parent: ObjectID;
  products: mongoose.Types.Array<ObjectID>;
}
interface CategoryModel extends mongoose.Model<Category> {
  categoryExists(id: ObjectID): Promise<Category>;
}

const CategorySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [4, 'Description needs to be at least 4 characters'],
      maxlength: [500, 'Description can not be more than 500 characters'],
      index: { type: 'text' },
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      minlength: [2, 'Category name needs to be at least 2 characters'],
      maxlength: [30, 'Category name can not be more than 50 characters'],
      index: { type: 'text' },
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Category',
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

CategorySchema.pre<Category>(
  'deleteOne',
  { document: true, query: false },
  // document: true makes it so the hook works on document, not the query
  async function () {
    // Deleting category from all products in this category
    const products: Product[] = await Product.find({
      categories: this._id,
    });

    for (const product of products) {
      product.categories.pull(this._id);
      product.save();
    }
  }
);
// Check if category exists
CategorySchema.statics.categoryExists = async function (
  id: ObjectID
): Promise<Category> {
  let category: Category | null = await Category.findOne({ _id: id });
  if (!category)
    throw new ErrorResponse(`Category with id of ${id} does not exist`, 404);
  return category;
};

const Category: CategoryModel = mongoose.model<Category, CategoryModel>(
  'Category',
  CategorySchema
);

export default Category;
