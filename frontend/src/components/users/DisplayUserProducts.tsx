import { FC, Fragment } from 'react';
// Components
import { ProductSummary } from '../products/ProductItemFull';
import DisplayProductsSummary from '../products/DisplayProductsSummary';
interface DisplayUserProductsProps {
  addedProducts: ProductSummary[];
}

const DisplayUserProducts: FC<DisplayUserProductsProps> = ({
  addedProducts,
}): JSX.Element | null => {
  if (addedProducts.length > 0)
    return (
      <Fragment>
        <p>Added prodducts:</p>
        <DisplayProductsSummary
          summaryProducts={addedProducts}
        ></DisplayProductsSummary>
      </Fragment>
    );
  else return null;
};

export default DisplayUserProducts;
