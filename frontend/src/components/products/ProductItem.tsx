import { FC } from 'react';
import { Link } from 'react-router-dom';

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
}

export interface ProductFull extends ProductSummary {
  photos: string[];
  stock: string;
  categories: string[];
  quantity: number;
  pricePerUnit: number;
  addedById: string;
}

export interface ProductItemProps {
  product: ProductFull;
}

// Full product item
const ProductItem: FC<ProductItemProps> = ({
  product: {
    name,
    description,
    photos,
    stock,
    categories,
    quantity,
    pricePerUnit,
    addedById,
  },
}) => {
  return (
    <div>
      <p>Description: {description}</p>
      <p>Stock: {stock}</p>
      {categories.length !== 0 ? (
        <p>Categories: {categories}</p>
      ) : (
        <p>Categories: none</p>
      )}
      <p>Quantity: {quantity}</p>
      <p>Price: ${pricePerUnit} each</p>
      <Link to="/">Seller Profile</Link>
    </div>
  );
};

export default ProductItem;
