import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
// Components
import UserItem from './UserItem';

interface DisplayUserProps {
  id: string;
}

/**
 * This interface is needed so I can access <Link to={userPath}></Link>
 * userPath = {
    pathname: `/merchant/${addedById}`,
    state: { productId: _id },
  };
  For this to work I also need to add StaticContext interface from react-rotuer
 */
// interface LocationState {
//   from: {
//     pathname: string;
//     productId: string;
//   };
// }

const DisplayUser: FC<RouteComponentProps<DisplayUserProps>> = (props) => {
  const { id } = props.match.params;

  const workaround = {
    _id: '',
    photo: '',
    name: '',
    role: '',
    addedProducts: [],
  };

  const [user, setUser] = useState(workaround);

  const getUser = async (_id: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/user/user/${_id}`
    );

    setUser(res.data.data);
  };

  useEffect(() => {
    getUser(id);
  }, [id]);

  if (user._id === '') return null;
  else
    return (
      <div>
        <UserItem user={user}></UserItem>
      </div>
    );
};

export default DisplayUser;
