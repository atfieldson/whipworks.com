import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

const ReduxWrapper = ({ element }) => (
  <Provider store={store}>{element}</Provider>
);

export default ReduxWrapper;
