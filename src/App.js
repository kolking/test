import React from 'react';
import { Provider } from 'react-redux';

import store from './store';

import FooListContainer from './containers/FooList';

export default function App() {
  return (
    <Provider store={store}>
      <FooListContainer />
    </Provider>
  );
}
