import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// Components and interfaces
import {
  showRootChildrenSelector,
  rootsSelector,
  Category,
} from './categoriesSlice';
interface DisplayRootChildrenProps {
  parentId: string;
}

export const DisplayRootChildren: FC<DisplayRootChildrenProps> = ({
  parentId,
}): JSX.Element | null => {
  const showRootChildren = useSelector(showRootChildrenSelector);
  const roots = useSelector(rootsSelector);

  if (showRootChildren[parentId] === true)
    // this checks makes it only shows children categories if parent has showRootChildren === true
    return (
      <Fragment>
        <ul>
          {roots[parentId].children.map((category: Category) => {
            if (category.parent === parentId)
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
  else return null;
};

export default DisplayRootChildren;
