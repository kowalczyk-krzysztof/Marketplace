import { FC, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// Components and interfaces
import {
  fetchPathToRoot,
  categoriesSelector,
  Category,
} from './categoriesSlice';
import Spinner from '../../components/layout/Spinner';

interface DisplayCategoryTreeProps {
  category: Category;
}

const DisplayCategoryTree: FC<DisplayCategoryTreeProps> = ({
  category,
}): JSX.Element => {
  const dispatch = useDispatch();
  const state = useSelector(categoriesSelector);
  const { pathToRoot, error, status } = state;
  useEffect(() => {
    if (category && pathToRoot.length === 0)
      dispatch(fetchPathToRoot(category.slug));
  }, [dispatch, category, pathToRoot]);
  // IMPORTANT! categoryTree will be in root - > child order (animals -> domestic animals - > cats)
  // For some weird reason I need to add key on <Fragment>
  if (status === 'loading') return <Spinner></Spinner>;
  else if (status === 'succeeded')
    return (
      <Fragment>
        <p>
          {pathToRoot.map((category: Category, index: number) => {
            return (
              <Fragment key={category._id}>
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
                {index !== pathToRoot.length - 1 ? ` --> ` : null}
              </Fragment>
            );
          })}
        </p>
      </Fragment>
    );
  else return <p>{error}</p>;
};

export default DisplayCategoryTree;
