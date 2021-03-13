import { useState, FormEvent, ChangeEvent, FC } from 'react';
// import axios from 'axios';
// Components
import SubmitInputField from './SubmitInputField';
// import SearchProducts from './SearchProducts';

interface SearchProps {
  searchProducts(text: string): Promise<void>;
}

// Searches for text from inputField
const Search: FC<SearchProps> = ({ searchProducts }) => {
  const [text, setText] = useState(``);
  // const [products, setProducts] = useState([]);
  // const [productCount, setproductCount] = useState(0);

  // const searchProducts = async (text: string) => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL}/api/v1/products/find/search?term=${text}`
  //   );
  //   setproductCount(res.data.count);
  //   setProducts(res.data.data);
  // };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setText(e.currentTarget.value);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
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
