import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components
import { ProductSummary } from '../products/ProductItem';
interface DisplayUserProductsProps {
  addedProducts: ProductSummary[];
}

export const DisplayUserProducts: FC<DisplayUserProductsProps> = ({
  addedProducts,
}) => {
  console.log(addedProducts);
  if (addedProducts.length > 0)
    return (
      <>
        <p>Added prodducts:</p>
        <ul>
          {addedProducts.map((product: ProductSummary) => {
            return (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
                <p>{product.description}</p>
              </li>
            );
          })}
        </ul>
      </>
    );
  else return null;
};

export default DisplayUserProducts;
