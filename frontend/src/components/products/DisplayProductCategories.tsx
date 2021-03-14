import { FC } from 'react';
import { Link } from 'react-router-dom';

export interface Category {
  name: string;
  _id: string;
}

interface DisplayProductCategoriesProps {
  categories: Category[];
}

const DisplayProductCategories: FC<DisplayProductCategoriesProps> = ({
  categories,
}): JSX.Element => {
  if (categories.length === 0) return <p>Categories: none</p>;
  else
    return (
      <>
        <p>Categories:</p>
        <ul>
          {categories.map((category) => {
            return (
              <li key={category._id}>
                <Link to={`/category/${category.name}`}>{category.name}</Link>
              </li>
            );
          })}
        </ul>
      </>
    );
};

export default DisplayProductCategories;
