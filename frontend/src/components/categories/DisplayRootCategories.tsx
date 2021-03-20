import { FC, MouseEvent, useEffect, useState } from 'react';
import axios from 'axios';
//Components
import { Category } from './DisplayCategoryTree';
import DisplayDepthOneCategories from './DisplayDepthOneCategories';

export interface DisplayRootCategoriesProps {}
export const DisplayRootCategories: FC<DisplayRootCategoriesProps> = () => {
  const [roots, setRoots] = useState([]); // state for getting array of root categories
  const [showChildren, setshowChildren] = useState(false); // state for whether to render depth one categories or not
  const [renderChildren, setRenderChildren] = useState(''); // state to pass category _id to DisplayDepthOneCategories

  // Getting all root categories
  const findRoots = async (): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/roots`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    setRoots(res.data);
  };

  useEffect(() => {
    findRoots();
  }, []);
  // Needed to somehow pass category._id from button to DisplayDepthOneCategories element. Decided to use button value for that.
  const onCLick = (e: MouseEvent<HTMLButtonElement>) => {
    setshowChildren(true);
    const { value } = e.target as HTMLInputElement; // this is how I get value from button value
    setRenderChildren(value);
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
