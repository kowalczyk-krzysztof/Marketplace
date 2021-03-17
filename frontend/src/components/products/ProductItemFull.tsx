import { FC, Suspense } from 'react';
import { Link } from 'react-router-dom';
// Components
import DisplayProductPhotos from './DisplayProductPhotos';
import DisplayCategoryTree from '../categories/DisplayCategoryTree';
import { Category } from '../categories/DisplayCategoryTree';

import Spinner from '../layout/Spinner';

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
  slug: string;
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
      <Suspense fallback={<Spinner></Spinner>}>
        <DisplayProductPhotos photos={photos} _id={_id} />
      </Suspense>
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
