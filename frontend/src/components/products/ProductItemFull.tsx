import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components
import DisplayProductPhotos from './DisplayProductPhotos';
import DisplayProductCategories from './DisplayProductCategories';
import { Category } from './DisplayProductCategories';

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
}

export interface ProductFull extends ProductSummary {
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
      <DisplayProductCategories category={category} />
      <p>Description: {description}</p>
      <p>Stock: {stock}</p>
      <p>Quantity: {quantity}</p>
      <p>Price: ${pricePerUnit} each</p>
      <Link to={`/merchant/${addedById}`}>Seller Profile</Link>
    </div>
  );
};

export default ProductItemFull;
