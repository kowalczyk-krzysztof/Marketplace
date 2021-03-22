import { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  categoriesSelector,
  searchSelector,
  SET_CATEGORIES_TRUE,
  SET_CATEGORIES_FALSE,
  SET_SEARCH_TRUE,
  SET_SEARCH_FALSE,
} from './navbarSlice';
// Components and interfaces
import Search from '../products/Search';
import DisplayRootCategories from '../categories/DisplayRootCategories';

const Navbar: FC = (): JSX.Element => {
  const dispatch = useDispatch();

  const showCategories = useSelector(categoriesSelector);
  const showSearch = useSelector(searchSelector);

  const rootCategoryHandler = (): void => {
    if (showCategories === false) dispatch(SET_CATEGORIES_TRUE());
    else dispatch(SET_CATEGORIES_FALSE());
  };

  const searchHandler = (): void => {
    if (showSearch === false) dispatch(SET_SEARCH_TRUE());
    else dispatch(SET_SEARCH_FALSE());
  };

  return (
    <nav>
      <Fragment>
        <Link to="/">Home</Link> <Link to="/profile">Profile</Link>{' '}
        <Link to="/cart">Cart</Link>{' '}
        <button onClick={rootCategoryHandler}>Categories</button>
        <button onClick={searchHandler}>Search...</button>
        {showCategories === true ? (
          <DisplayRootCategories></DisplayRootCategories>
        ) : null}
        {showSearch === true ? <Search /> : null}
      </Fragment>
    </nav>
  );
};

export default Navbar;
