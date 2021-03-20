import { FC, MouseEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchRoots,
  categoriesSelector,
  SET_ROOT_ID,
  Category,
} from './categoriesSlice';
// Components and interfaces
import {} from './categoriesSlice';
import DisplayDepthOneCategories from './DisplayDepthOneCategories';
import Spinner from '../../components/layout/Spinner';

/**
 * Logic:
 * 1. Check state.roots - if it is empty, dispatch fetchRoots and render results (categories) as buttons. Buttons have a value of category._id.
 * 2. When clicking a category button a check is performed if (state.rootId !== event.target.value) and if true then event.target.value is dispatched as action SET_ROOT_ID.
 * 3. Then in DisplayDepthOneCategories a check is performed to see if state.depthOne contains any objects with parent === state.rootId (category data model is tree model with parent reference). This is to avoid duplicates and sending unnecessary API requests. If state.depthOne does not contain such objects and rootId isn't an empty string, then dispatch action fetchDepthOne.
 * 4. If API request in fetchDepthOne is succesful, dispatch action GET_DEPTH_ONE_SUCCESS which pushes all categories from payload to state.depthOne
 * 5. Then state.depthOne is mapped and all objects with .parent === rootId are rendered.
 */

export const DisplayRootCategories: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector(categoriesSelector);
  const { roots, error, rootId, status } = state;

  useEffect(() => {
    // makes it so I don't refetch roots all the time
    if (roots.length === 0) dispatch(fetchRoots());
  }, [roots.length, dispatch]);

  // Needed to somehow pass category._id from button, decided to use button value for that.
  const onCLick = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.target as HTMLInputElement; // this is how I get value from button value
    if (rootId !== value) dispatch(SET_ROOT_ID(value));
  };
  if (status === 'loading') return <Spinner></Spinner>;
  else if (status === 'succeeded')
    return (
      <div>
        {roots.map((category: Category) => {
          return (
            <button onClick={onCLick} value={category._id} key={category._id}>
              {category.name}
            </button>
          );
        })}
        <DisplayDepthOneCategories></DisplayDepthOneCategories>
      </div>
    );
  else return <p>{error}</p>;
};
// TODO: Do a redirect instead of rendering error
export default DisplayRootCategories;
