import { FC, Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Components
import { Category } from './DisplayCategoryTree';

export interface DisplayDepthOneCategoriesProps {
  categoryId: string;
}
export const DisplayDepthOneCategories: FC<DisplayDepthOneCategoriesProps> = ({
  categoryId,
}) => {
  const [categories, setCategories] = useState([]);
  // Getting depth one categories for root passed in categoryId
  const findChildren = async (_id: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/category/children/${_id}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    setCategories(res.data);
  };

  useEffect(() => {
    findChildren(categoryId);
  }, [categoryId]);

  return (
    <Fragment>
      <ul>
        {categories.map((category: Category) => {
          return (
            <li key={category._id}>
              <Link to={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};

export default DisplayDepthOneCategories;
