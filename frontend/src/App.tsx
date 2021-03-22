import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'; // wrapping application in a provider that will subscribe and unsubscribe to store
import { store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
// Components and interfaces
import DisplayProductFull from './features/products/DisplayProductFull';
import Navbar from './features/navbar/Navbar';
import DisplaySearchProducts from './features/products/DisplaySearchProducts';
import DisplayUser from './features/users/DisplayUser';

// redux-persist persistor
const persistor = persistStore(store);

const App = (): JSX.Element => {
  // <Provider store={store}> is how components have access to the store. Anything wrapped with it will have access to store.
  // Routers inside <Switch> are exclusive. Without switch components on route /test and /test/:id would both render on /test.

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
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
          </Switch>
        </div>
      </BrowserRouter>
      {/* </PersistGate> */}
    </Provider>
  );
};

export default App;
