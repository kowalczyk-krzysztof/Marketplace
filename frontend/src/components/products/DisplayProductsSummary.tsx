import { FC } from 'react';
import { Link } from 'react-router-dom';
// Components
import { ProductSummary } from '../products/ProductItemFull';
interface DisplayProductsSummaryProps {
  summaryProducts: ProductSummary[];
}

const DisplayProductsSummary: FC<DisplayProductsSummaryProps> = ({
  summaryProducts,
}): JSX.Element => {
  return (
    <>
      <ul>
        {summaryProducts.map((product: ProductSummary) => {
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
};

export default DisplayProductsSummary;
