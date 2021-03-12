import { useState } from 'react';
import axios from 'axios';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

// Components
import Search from './components/products/search/Search';
import SearchProducts from './components/products/search/SearchProducts';
import DisplayProduct from './components/products/DisplayProduct';
import Navbar from './components/layout/Navbar';

const URL = process.env.REACT_APP_URL;

const App = () => {
  const [products, setProducts] = useState([]);
  const [productCount, setproductCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (text: string) => {
    setLoading(true);
    const res = await axios.get(
      `${URL}/api/v1/products/find/search?term=${text}`
    );
    setproductCount(res.data.count);
    setProducts(res.data.data);
    setLoading(false);
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
          <Route exact path={`/product/:id`} component={DisplayProduct}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
