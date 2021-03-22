import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components and interfaces
import DisplayProductPhotos from './DisplayProductPhotos';
import DisplayCategoryTree from '../../features/categories/DisplayCategoryTree';
import { Category } from '../../features/categories/categoriesSlice';

export interface ProductFull {
  _id: string;
  name: string;
  description: string;
  slug: string;
  photos: string[];
  stock: string;
  category: Category;
  quantity: number;
  pricePerUnit: number;
  addedById: string;
}

interface ProductItemFullProps {
  product: ProductFull;
}

// Full product item
const ProductItemFull: FC<ProductItemFullProps> = ({
  product: {
    _id,
    name,
    description,
    photos,
    stock,
    category,
    quantity,
    pricePerUnit,
    addedById,
  },
}): JSX.Element => {
  return (
    <div>
      <h1>{name}</h1>
      <DisplayProductPhotos photos={photos} _id={_id} />
      <p>Categories: </p>
      <DisplayCategoryTree category={category} />
      <p>Description: {description}</p>
      <p>Stock: {stock}</p>
      <p>Quantity: {quantity}</p>
      <p>Price: ${pricePerUnit} each</p>
      <Link to={`/user/${addedById}`}>Seller Profile</Link>
    </div>
  );
};

export default ProductItemFull;
