import { FC, useState, useEffect } from 'react';
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
  };

  const [product, setProduct] = useState(workaround);

  // Fetching product data from database
  const getProduct = async (_id: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/products/find/product/${_id}`
    );

    setProduct(res.data.data);
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  if (product._id === '') return null;
  else
    return (
      <>
        <ProductItemFull product={product} />
      </>
    );
};

export default DisplayProductFull;
