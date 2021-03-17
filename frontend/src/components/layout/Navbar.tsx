import { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
// Components
import Search from '../products/search/Search';

interface NavbarProps {
  searchProducts(text: string): Promise<void>;
}

const Navbar: FC<NavbarProps> = ({ searchProducts }): JSX.Element => {
  return (
    <nav>
      <Fragment>
        <Link to="/">Home</Link> <Link to="/profile">Profile</Link>{' '}
        <Link to="/cart">Cart</Link> <Link to="/categories">Categories</Link>
        <Search searchProducts={searchProducts} />
      </Fragment>
    </nav>
  );
};

export default Navbar;
