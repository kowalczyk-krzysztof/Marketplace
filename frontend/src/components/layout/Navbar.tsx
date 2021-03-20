import { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
// Components and interfaces
import Search from '../../features/searchProducts/Search';

// TODO: Maker categories a frame(?) with dropdown menus
const Navbar: FC = (): JSX.Element => {
  return (
    <nav>
      <Fragment>
        <Link to="/">Home</Link> <Link to="/profile">Profile</Link>{' '}
        <Link to="/cart">Cart</Link> <Link to="/categories">Categories</Link>
        <Search />
      </Fragment>
    </nav>
  );
};

export default Navbar;
