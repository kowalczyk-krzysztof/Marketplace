import { Fragment } from 'react';
import spinner from './Spinner.gif';

const Spinner = (): JSX.Element => {
  return (
    <Fragment>
      <img
        src={spinner}
        alt="Loading..."
        style={{
          width: '50px',
          height: '50px',
          margin: 'auto',
          display: 'block',
        }}
        crossOrigin="anonymous"
      ></img>
    </Fragment>
  );
};

export default Spinner;
