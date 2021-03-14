import { useState, FormEvent, ChangeEvent, FC } from 'react';
// Components
import SubmitInputField from './SubmitInputField';
interface SearchProps {
  searchProducts(text: string): Promise<void>;
}

// Searches for text from inputField
const Search: FC<SearchProps> = ({ searchProducts }): JSX.Element => {
  const [text, setText] = useState(``);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void =>
    setText(e.currentTarget.value);

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (text === '') {
      window.alert('Please enter something'); // TODO make a better alert
    } else {
      searchProducts(text);
      setText('');
    }
  };

  return (
    <>
      <SubmitInputField
        type="text"
        name="search"
        placeholder="Search products..."
        value={text}
        buttonValue="Search"
        onChange={changeHandler}
        onSubmit={submitHandler}
      ></SubmitInputField>
    </>
  );
};

export default Search;
