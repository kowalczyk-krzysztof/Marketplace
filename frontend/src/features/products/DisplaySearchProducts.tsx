import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  errorSelector,
  statusSelector,
  productsSelector,
} from './productsSlice';
// Components and interfaces
import SearchProductItem from './SearchProductItem';
import { ProductSummary } from '../../components/products/DisplayProductsSummary';
import Spinner from '../../components/layout/Spinner';

// Displays a list of all objects found of type ProductSummary as SearchProductItem if the found product count is higher than 0
const DisplaySearchProducts: FC = (): JSX.Element => {
  const error = useSelector(errorSelector);
  const status = useSelector(statusSelector);
  const products = useSelector(productsSelector);
  const resultLength = Object.keys(products).length;

  if (status === 'loading') return <Spinner></Spinner>;
  else if (status === 'succeeded' && resultLength > 0)
    return (
      <Fragment>
        <h2>Products found: {resultLength}</h2>
        <ul>
          {Object.values(products).map((product: ProductSummary) => {
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
