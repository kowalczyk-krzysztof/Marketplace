import { FC, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Components and interfaces
import UserItem from '../../components/users/UserItem';
import {
  statusSelector,
  usersSelector,
  errorSelector,
  fetchUser,
} from './usersSlice';
import Spinner from '../../components/layout/Spinner';

interface DisplayUserProps {
  id: string;
}

/**
 * This interface is needed so I can access <Link to={userPath}></Link>
 * userPath = {
    pathname: `/merchant/${addedById}`,
    state: { productId: ._id },
  };
  For this to work I also need to add StaticContext interface from react-rotuer
 */
// interface LocationState {
//   from: {
//     pathname: string;
//     productId: string;
//   };
// }

const DisplayUser: FC<RouteComponentProps<DisplayUserProps>> = (
  props
): JSX.Element | null => {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const user = useSelector(usersSelector);
  const error = useSelector(errorSelector);
  const status = useSelector(statusSelector);

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [id, dispatch]);

  if (status === 'loading') return <Spinner></Spinner>;
  if (status === 'succeeded' && user[id] !== undefined) {
    return (
      <Fragment>
        <UserItem user={user[id]}></UserItem>
      </Fragment>
    );
  } else return <p>{error}</p>;
};

export default DisplayUser;
