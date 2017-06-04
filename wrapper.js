'use strict'

import React, { Component } from 'react';
import { compose, applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk';
import rootReducer from './src/reducers'
import App from './src/components/App'
import {persistStore, autoRehydrate} from 'redux-persist';
import {AsyncStorage} from 'react-native';

const logger = createLogger()
//const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)
//const store = createStoreWithMiddleware(rootReducer)
const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(thunk,logger),
    autoRehydrate()
  )
);

persistStore(store, {storage: AsyncStorage});

export default class wrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
