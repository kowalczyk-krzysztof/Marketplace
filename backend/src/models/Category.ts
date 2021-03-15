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
  categoryIdExists(id: ObjectID): Promise<Category>;
  categoryNameExists(categoryName: string): Promise<Category>;
  findPath(categoryName: string): Promise<QueryResult[]>;
}
// Interface for getting path to root of category
interface QueryResult {
  _id: string;
  name: string;
  structure: number;
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
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Category',
      index: true,
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
      category: this._id,
    });

    for (const product of products) {
      product.category = null;
      product.save();
    }
  }
);
// Check if category exists by ID
CategorySchema.statics.categoryIdExists = async function (
  id: ObjectID
): Promise<Category> {
  let category: Category | null = await Category.findOne({ _id: id });
  if (!category)
    throw new ErrorResponse(`Category with id of ${id} does not exist`, 404);
  return category;
};
// Check if category exists by name
CategorySchema.statics.categoryNameExists = async function (
  categoryName: string
): Promise<Category> {
  let category: Category | null = await Category.findOne({
    name: categoryName,
  });
  if (!category)
    throw new ErrorResponse(
      `Category with name ${categoryName} does not exist`,
      404
    );
  return category;
};
// Find path to root
CategorySchema.statics.findPath = async function (
  categoryName: string
): Promise<QueryResult[]> {
  // Find pathy to root category
  const findPath = await Category.aggregate([
    {
      $match: {
        name: categoryName, // starting category
      },
    },
    {
      $graphLookup: {
        from: 'categories', // the collection we operate in
        startWith: '$_id', // what value we search for starts with, $_id is for ObjectID
        connectFromField: 'parent', //  field name whose value $graphLookup uses to recursively match against the connectToField
        connectToField: '_id', // field name in other documents against which to match the value of the field specified by the connectFromField parameter.
        depthField: 'structure', // this is the field that will show the route
        as: 'path', // name of the array field added to each output document. Contains the documents traversed in the $graphLookup stage to reach the document.
      },
    },

    {
      $project: {
        'path._id': 1,
        'path.name': 1,
        'path.structure': 1,
      },
    },
  ]);

  const path: QueryResult[] = findPath[0].path;
  // Sorting the array in ascending order
  const sortedCategories = path.sort(function (a: QueryResult, b: QueryResult) {
    return a.structure - b.structure;
  });

  return sortedCategories;
};

const Category: CategoryModel = mongoose.model<Category, CategoryModel>(
  'Category',
  CategorySchema
);

export default Category;
