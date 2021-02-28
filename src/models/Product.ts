import mongoose from 'mongoose';
import slugify from 'slugify';

// Had to create an interface for slugify to work
interface Product extends mongoose.Document {
  name: string;
  slug: string;
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
      maxlength: [50, 'Product name can not be more than 50 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity must be higher than 0'],
      min: [1, 'Quantity must be higher than 0'],
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
    },
    addedById: {
      type: String,
      required: true,
      select: false,
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
const Product = mongoose.model('Product', ProductSchema);
export default Product;
