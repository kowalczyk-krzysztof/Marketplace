import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { searchProductsSelector } from './searchProductsSlice';
// Components and interfaces
import SearchProductItem from './SearchProductItem';
import { ProductSummary } from '../../components/products/DisplayProductsSummary';
import Spinner from '../../components/layout/Spinner';

// Displays a list of all objects found of type ProductSummary as SearchProductItem if the found product count is higher than 0
const DisplaySearchProducts: FC = (): JSX.Element => {
  const state = useSelector(searchProductsSelector);
  const { searchProducts, error, status } = state;
  if (status === 'loading') return <Spinner></Spinner>;
  else if (status === 'succeeded' && searchProducts.length > 0)
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
