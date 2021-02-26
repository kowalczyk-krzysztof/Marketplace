import mongoose, { Schema } from 'mongoose';

const ProductSchema: Schema = new mongoose.Schema({
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
  addedAt: { type: Date, default: Date.now },
  addedBy: {
    type: String,
    required: [true, 'Author is required'],
    maxlenght: [50, 'Author name can not be more than 50 characters'],
  },
});

export default mongoose.model('Product', ProductSchema);
