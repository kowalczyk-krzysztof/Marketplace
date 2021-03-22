import { FC, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// Components and interfaces
import {
  fetchPathToRoot,
  Category,
  pathToRootSelector,
  errorSelector,
  pathStatusSelector,
} from './categoriesSlice';
import Spinner from '../../components/layout/Spinner';

interface DisplayCategoryTreeProps {
  category: Category;
}

const DisplayCategoryTree: FC<DisplayCategoryTreeProps> = ({
  category,
}): JSX.Element => {
  const dispatch = useDispatch();
  // const state = useSelector(categoriesSelector);
  // const { pathToRoot, error, pathStatus } = state;

  const pathToRoot = useSelector(pathToRootSelector);
  const error = useSelector(errorSelector);
  const pathStatus = useSelector(pathStatusSelector);

  useEffect(() => {
    dispatch(fetchPathToRoot(category.slug, category._id));
  }, [dispatch, category.slug, category._id]);

  // IMPORTANT! categoryTree will be in root - > child order (animals -> domestic animals - > cats)
  if (pathStatus === 'loading') return <Spinner></Spinner>;
  else if (pathStatus === 'succeeded' && category._id in pathToRoot === true) {
    const categoryTree = pathToRoot[category._id].path;
    return (
      <Fragment>
        <p>
          {categoryTree.map((category: Category, index: number) => {
            return (
              <Fragment key={category._id}>
                <Link to={`/category/${category.slug}`}>{category.name}</Link>

                {index !== categoryTree.length - 1 ? ` --> ` : null}
              </Fragment>
            );
          })}
        </p>
      </Fragment>
    );
  } else return <p>{error}</p>;
};

export default DisplayCategoryTree;
