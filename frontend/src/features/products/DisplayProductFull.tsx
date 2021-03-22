import { FC, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
// Components and interfaces
import { useSelector, useDispatch } from 'react-redux';
import ProductItemFull from '../../components/products/ProductItemFull';
import {
  productsSelector,
  errorSelector,
  statusSelector,
  fetchProduct,
} from './productsSlice';
import Spinner from '../../components/layout/Spinner';

interface DisplayProductFullProps {
  id: string;
}

// This is the interface needed to get access to match.params.id
const DisplayProductFull: FC<RouteComponentProps<DisplayProductFullProps>> = (
  props
): JSX.Element | null => {
  const { id } = props.match.params; // This is how I get /:id from <Route exact path={`/product/:id`}/>
  const dispatch = useDispatch();
  const product = useSelector(productsSelector);
  const error = useSelector(errorSelector);
  const status = useSelector(statusSelector);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  if (status === 'loading') return <Spinner></Spinner>;
  if (status === 'succeeded' && product[id] !== undefined) {
    return (
      <Fragment>
        <ProductItemFull product={product[id]} />
      </Fragment>
    );
  } else return <p>{error}</p>;
};

export default DisplayProductFull;
