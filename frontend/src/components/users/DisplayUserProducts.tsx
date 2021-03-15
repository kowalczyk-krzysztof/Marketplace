import { FC } from 'react';
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
      <>
        <p>Added prodducts:</p>
        <DisplayProductsSummary
          summaryProducts={addedProducts}
        ></DisplayProductsSummary>
      </>
    );
  else return null;
};

export default DisplayUserProducts;
