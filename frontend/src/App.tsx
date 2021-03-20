import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'; // wrapping application in a provider that will subscribe and unsubscribe to store
import { store } from './app/store';
// Components and interfaces
import DisplayProductFull from './components/products/DisplayProductFull';
import Navbar from './components/layout/Navbar';
import DisplaySearchProducts from './features/searchProducts/DisplaySearchProducts';
import DisplayUser from './components/users/DisplayUser';
import DisplayRootCategories from './features/categories/DisplayRootCategories';

const App = (): JSX.Element => {
  // <Provider store={store}> is how components have access to the store. Anything wrapped with it will have access to store.
  // Routers inside <Switch> are exclusive. Without switch components on route /test and /test/:id would both render on /test.

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/">
              <h1>Marketplace</h1>
            </Route>
            <Route exact path="/search-results">
              <DisplaySearchProducts />
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
    </Provider>
  );
};

export default App;
