import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components
import DisplayProductPhotos from '../layout/DisplayProductPhotos';

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
}

export interface Category {
  name: string;
  _id: string;
}

export interface ProductFull extends ProductSummary {
  photos: string[];
  stock: string;
  categories: Category[];
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
    _id,
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
      <h1>{name}</h1>
      <DisplayProductPhotos photos={photos} _id={_id} />
      <p>Description: {description}</p>
      <p>Stock: {stock}</p>
      {categories.length !== 0 ? (
        <p>
          Categories:{' '}
          {categories.map((category) => {
            const names = [];
            names.push(category.name);
            return names;
          })}
        </p>
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
