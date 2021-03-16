import { FC, Fragment } from 'react';
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
    <Fragment>
      <ul>
        {summaryProducts.map((product: ProductSummary) => {
          return (
            <li key={product._id}>
              <Link to={`/product/${product.slug}-${product._id}`}>
                {product.name}
              </Link>
              <p>{product.description}</p>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};

export default DisplayProductsSummary;
