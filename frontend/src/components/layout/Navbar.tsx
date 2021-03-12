import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  return (
    <nav>
      <ul>
        <li key="home">
          <Link to="/">Home</Link>
        </li>
        <li key="profile">
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
