import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';

// Components
import SearchProductItem from './SearchProductItem';
import { searchProductsSelector } from './searchProductsSlice';
import { ProductSummary } from '../../components/products/DisplayProductsSummary';

// Displays a list of all objects found of type ProductSummary as SearchProductItem if the found product count is higher than 0
const DisplaySearchProducts: FC = (): JSX.Element => {
  const state = useSelector(searchProductsSelector);
  const { searchProducts, error } = state;

  if (!error && searchProducts.length > 0)
    return (
      <Fragment>
        <h2>Products found: {searchProducts.length}</h2>
        <ul>
          {searchProducts.map((product: ProductSummary) => {
            return (
              <li key={product._id}>
                <SearchProductItem product={product} />
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  else return <p>{error}</p>;
};

export default DisplaySearchProducts;
