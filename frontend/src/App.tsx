import { useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import axios from 'axios';

// Components
import Search from './components/products/search/Search';
import DisplayProduct from './components/products/DisplayProduct';
import Navbar from './components/layout/Navbar';
import SearchProducts from './components/products/search/SearchProducts';

const App = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (error.response.status === 404) {
        window.location.href = `${process.env.REACT_APP_APP_URL}/not-found`;
      }

      return Promise.reject(error.response);
    }
  );
  const [products, setProducts] = useState([]);
  const [productCount, setproductCount] = useState(0);

  const searchProducts = async (text: string) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/products/find/search?term=${text}`
    );
    setproductCount(res.data.count);
    setProducts(res.data.data);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <h1>Just trying out stuff lol</h1>
            <Search searchProducts={searchProducts} />
            <SearchProducts products={products} productCount={productCount} />
          </Route>
          <Route exact path="/not-found"></Route>
          <Route exact path={`/product/:id`} component={DisplayProduct}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
