import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components
import { ProductSummary } from '../ProductItem';

interface SearchProductItemProps {
  product: ProductSummary;
}

// Displays a product with type ProductSummary
const SearchProductItem: FC<SearchProductItemProps> = ({
  product: { name, description, _id },
}) => {
  // It's better to make a link styled as button that to make an actual button
  return (
    <div>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <Link to={`/product/${_id}`}>View Product</Link>
    </div>
  );
};

export default SearchProductItem;
