import { useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import axios from 'axios';
// Components
import DisplayProductFull from './components/products/DisplayProductFull';
import Navbar from './components/layout/Navbar';
import DisplaySearchProducts from './components/products/search/DisplaySearchProducts';
import DisplayUser from './components/users/DisplayUser';
import DisplayRootCategories from './components/categories/DisplayRootCategories';

const App = (): JSX.Element => {
  // TODO: Better error handler
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (error.response.status === 404) {
        window.location.href = `${process.env.REACT_APP_APP_URI}/not-found`;
      }

      return Promise.reject(error.response);
    }
  );
  // I need those as a global state so each time I go back/forward I won't need to repeat the search query
  const [searchProductsList, setSearchProductList] = useState([]); // list of products that are result of search query
  const [searchProductCount, setSearchProductCount] = useState(0); // product count

  const searchProducts = async (text: string): Promise<void> => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/products/find/search?term=${text}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    setSearchProductCount(res.data.count);
    setSearchProductList(res.data.data);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar searchProducts={searchProducts} />
        <Switch>
          <Route exact path="/">
            <h1>Marketplace</h1>
          </Route>
          <Route exact path="/search-results">
            <DisplaySearchProducts
              products={searchProductsList}
              productCount={searchProductCount}
            />
          </Route>
          <Route exact path="/not-found"></Route>
          <Route
            exact
            path={`/product/:slug-:id/`}
            component={DisplayProductFull}
          ></Route>
          <Route exact path={`/user/:id/`} component={DisplayUser}></Route>
          <Route
            exact
            path={`/categories/`}
            component={DisplayRootCategories}
          ></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
