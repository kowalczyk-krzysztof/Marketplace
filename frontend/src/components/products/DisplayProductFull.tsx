import { FC, useState, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
// Components
import ProductItemFull from './ProductItemFull';
import { ProductFull } from './ProductItemFull';

interface DisplayProductFullProps {
  id: string;
}

// This is the interface needed to get access to match.params.id
const DisplayProductFull: FC<RouteComponentProps<DisplayProductFullProps>> = (
  props
): JSX.Element | null => {
  const { id } = props.match.params; // This is how I get /:id from <Route exact path={`/product/:id`}/>
  // Dummy product as a workaround for setting state
  const workaround: ProductFull = {
    name: '',
    photos: [],
    stock: '',
    category: { name: '', _id: '', description: '', parent: '', slug: '' },
    quantity: 0,
    pricePerUnit: 0,
    addedById: '',
    description: '',
    _id: '',
    slug: '',
  };

  const [product, setProduct] = useState(workaround);

  // Fetching product data from database
  const getProduct = async (_id: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/products/find/product/${_id}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    setProduct(res.data.data);
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  if (product._id === '') return null;
  else
    return (
      <Fragment>
        <ProductItemFull product={product} />
      </Fragment>
    );
};

export default DisplayProductFull;
