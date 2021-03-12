import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
// Components
import ProductItem from './ProductItem';

const URL = process.env.REACT_APP_URL;

interface DisplayProductProps {
  id: string;
}

// This is the interface needed to get access to match.params.id
const DisplayProduct: FC<RouteComponentProps<DisplayProductProps>> = (
  props
) => {
  const { id } = props.match.params; // This is how I get /:id from <Route exact path={`/product/:id`}/>

  const [product, setProduct] = useState({
    // How to make this null?
    name: '',
    photos: [],
    stock: '',
    categories: [],
    quantity: 10,
    pricePerUnit: 50,
    addedById: '',
    description: '',
    _id: '',
  });
  // Fetching product data from database
  const getProduct = async (_id: string): Promise<void> => {
    const res = await axios.get(`${URL}/api/v1/products/find/product/${_id}`);
    setProduct(res.data.data);
  };

  // Rendering the product, how to make it render once without using []?
  useEffect(() => {
    getProduct(id);
  }, []);

  return (
    <div>
      <h1>{product.name}</h1>
      {product.photos.map((photo) => {
        return (
          <img
            key={photo}
            style={{ width: 200, height: 200 }}
            alt={photo}
            src={`http://localhost:5000/uploads/products/604b5f6aa8b25715f45ad40a/${photo}`}
          />
        );
      })}
      <ProductItem product={product} />
    </div>
  );
};

export default DisplayProduct;
