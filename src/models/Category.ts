import mongoose, { ObjectId } from 'mongoose';
import { ErrorResponse } from '../utils/ErrorResponse';
import Product from './Product';

interface Category extends mongoose.Document {
  name: string;
  products: mongoose.Types.Array<ObjectId>;
}

interface CategoryModel extends mongoose.Model<Category> {
  categoryExists(id: string): Promise<Category>;
}

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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

CategorySchema.statics.categoryExists = async function (id) {
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
