import { useState, FormEvent, ChangeEvent, FC, Fragment } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './productsSlice';
// Components and interfaces
import SubmitInputField from '../../components/products/SubmitInputField';

// Searches for text from inputField
const Search: FC = (): JSX.Element => {
  const dispatch = useDispatch(); // dispatch
  const [text, setText] = useState(``); // NOTE: For forms it's better to use local state rather than redux
  const history = useHistory(); // this is how I get redirected

  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.currentTarget.value);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (text === '') {
      window.alert('Please enter something'); // TODO make a better alert
    } else {
      dispatch(fetchProducts(text)); // dispatching to redux store
      setText('');
      history.push('/search-results'); // redirecting onSubmit has to be done in onSubmit method
    }
  };

  return (
    <Fragment>
      <SubmitInputField
        type="text"
        name="search"
        placeholder="Search products..."
        value={text}
        buttonValue="Search"
        onChange={changeHandler}
        onSubmit={submitHandler}
      ></SubmitInputField>
    </Fragment>
  );
};

export default Search;
