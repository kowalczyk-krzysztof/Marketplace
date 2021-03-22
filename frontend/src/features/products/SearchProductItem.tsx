import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components and interfaces
import { ProductSummary } from '../../components/products/DisplayProductsSummary';

interface SearchProductItemProps {
  product: ProductSummary;
}

// Displays a product with type ProductSummary
const SearchProductItem: FC<SearchProductItemProps> = ({
  product: { name, description, _id, slug },
}): JSX.Element => {
  // It's better to make a link styled as button that to make an actual button
  return (
    <div>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <Link to={`/product/${slug}-${_id}`}>View Product</Link>
    </div>
  );
};

export default SearchProductItem;
