import spinner from './Spinner.gif';

const Spinner = (): JSX.Element => (
  <>
    <img
      src={spinner}
      alt="Loading..."
      style={{ width: '200px', margin: 'auto', display: 'block' }}
    ></img>
  </>
);

export default Spinner;
