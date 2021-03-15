import { FC } from 'react';
// Components
import SearchProductItem from './SearchProductItem';
import { ProductSummary } from '../ProductItemFull';

interface DisplaySearchProductsProps {
  products: ProductSummary[];
  productCount: number;
}

// Displays a list of all objects found of type ProductSummary as SearchProductItem if the found product count is higher than 0
const DisplaySearchProducts: FC<DisplaySearchProductsProps> = ({
  products,
  productCount,
}): JSX.Element | null => {
  if (productCount > 0)
    return (
      <>
        <h2>Products found: {productCount}</h2>
        <ul>
          {products.map((product: ProductSummary) => {
            return (
              <li key={product._id}>
                <SearchProductItem product={product} />
              </li>
            );
          })}
        </ul>
      </>
    );
  else {
    return null;
  }
};

export default DisplaySearchProducts;
