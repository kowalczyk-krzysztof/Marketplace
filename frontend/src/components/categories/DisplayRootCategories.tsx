import { FC, MouseEvent, useEffect, useState } from 'react';
import axios from 'axios';
//Components
import { Category } from './DisplayCategoryTree';
import DisplayDepthOneCategories from './DisplayDepthOneCategories';

export interface DisplayRootCategoriesProps {}
export const DisplayRootCategories: FC<DisplayRootCategoriesProps> = () => {
  const [roots, setRoots] = useState([]);
  const [showChildren, setshowChildren] = useState(false);

  const [renderChildren, setrenderChildren] = useState('');

  const findRoots = async (): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/roots`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    setRoots(res.data.data);
  };

  useEffect(() => {
    findRoots();
  }, []);

  const onCLick = (e: MouseEvent<HTMLButtonElement>) => {
    setshowChildren(true);
    const { value } = e.target as HTMLInputElement;
    setrenderChildren(value);
  };

  return (
    <div>
      {roots.map((category: Category) => {
        return (
          <button onClick={onCLick} value={category._id} key={category._id}>
            {category.name}
          </button>
        );
      })}
      {showChildren === true ? (
        <DisplayDepthOneCategories
          categoryId={renderChildren}
        ></DisplayDepthOneCategories>
      ) : null}
    </div>
  );
};

export default DisplayRootCategories;
