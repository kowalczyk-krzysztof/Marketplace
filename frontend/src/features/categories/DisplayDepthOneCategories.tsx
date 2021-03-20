import { FC, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// Components and interfaces
import { fetchDepthOne, categoriesSelector, Category } from './categoriesSlice';
import Spinner from '../../components/layout/Spinner';

export const DisplayDepthOneCategories: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector(categoriesSelector);
  const { depthOne, error, rootId, status } = state;

  useEffect(() => {
    const categoriesExist = depthOne.some(
      (category: Category) => category.parent === rootId
    );
    if (categoriesExist === false && rootId !== '')
      dispatch(fetchDepthOne(rootId));
  }, [rootId, dispatch, depthOne]);
  if (status === 'loading') return <Spinner></Spinner>;
  else if (status === 'succeeded')
    return (
      <Fragment>
        <ul>
          {depthOne.map((category: Category) => {
            if (category.parent === rootId)
              return (
                <li key={category._id}>
                  <Link to={`/category/${category.slug}`}>{category.name}</Link>
                </li>
              );
            else return null;
          })}
        </ul>
      </Fragment>
    );
  else return <p>{error}</p>;
};

export default DisplayDepthOneCategories;
