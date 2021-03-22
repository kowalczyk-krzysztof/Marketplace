import { FC, Fragment, MouseEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Category,
  fetchRoots,
  rootsSelector,
  errorSelector,
  rootStatusSelector,
  showRootChildrenSelector,
  SET_SHOW_ROOT_CHILDREN,
  SHOW_ROOT_CHILDREN_TRUE,
  SHOW_ROOT_CHILDREN_FALSE,
} from './categoriesSlice';
// Components and interfaces
import DisplayRootChildren from './DisplayRootChildren';
import Spinner from '../../components/layout/Spinner';

/**
 * Logic:
 * 1. If roots haven't been fetched yet, dispatch fetchRoots
 * 2. fetchRoots returns all root categories (parent === null), each with a children array that contains all direct children (objects)
 * 3. Root categories are mapped as buttons with value set as their _id
 * 4. onClick sets the state.rootId to button value
 * 5. If showRootChildren === true then <DisplayRootChildren> renders
 * 6. DisplayRootChildren does a check if state.rootId !== '' and if true it dispatches GET_ROOT_CHILDREN
 * 7. GET_ROOT_CHILDREN finds index of root with _id === state.rootId and sets rootChildren to children array of that root
 */

export const DisplayRootCategories: FC = () => {
  const dispatch = useDispatch();

  const roots = useSelector(rootsSelector);
  const error = useSelector(errorSelector);
  const rootStatus = useSelector(rootStatusSelector);
  const showRootChildren = useSelector(showRootChildrenSelector);

  useEffect(() => {
    dispatch(fetchRoots());
  }, [dispatch]);

  // Needed to somehow pass category._id from button, decided to use button value for that.
  const onCLick = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLInputElement; // this is how I get value from button value

    if (value in showRootChildren === false)
      // checking if key with name value exists
      dispatch(SET_SHOW_ROOT_CHILDREN(value));
    // Toggling visbility
    if (showRootChildren[value] === false)
      dispatch(SHOW_ROOT_CHILDREN_TRUE(value));
    if (showRootChildren[value] === true)
      dispatch(SHOW_ROOT_CHILDREN_FALSE(value));
  };
  // Object.values(roots).map is how I iterate over object
  if (rootStatus === 'loading') return <Spinner></Spinner>;
  else if (rootStatus === 'succeeded')
    return (
      <div>
        {Object.values(roots).map((category: Category) => {
          return (
            <Fragment key={category._id}>
              <button onClick={onCLick} value={category._id} key={category._id}>
                {category.name}
              </button>
              <DisplayRootChildren
                parentId={category._id}
              ></DisplayRootChildren>
            </Fragment>
          );
        })}
      </div>
    );
  else return <p>{error}</p>;
};
// TODO: Do a redirect instead of rendering error
export default DisplayRootCategories;
