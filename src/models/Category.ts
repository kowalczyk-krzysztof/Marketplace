import mongoose, { ObjectId } from 'mongoose';
import { ErrorResponse } from '../utils/ErrorResponse';

interface Category extends mongoose.Document {
  name: mongoose.Types.Array<ObjectId>;
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

CategorySchema.statics.categoryExists = async function (id) {
  let category: Category | null = await Category.findById(id);
  if (!category)
    throw new ErrorResponse(`Category with id of ${id} does not exist`, 404);
  return category;
};

const Category: CategoryModel = mongoose.model<Category, CategoryModel>(
  'Category',
  CategorySchema
);

export default Category;
