import { Store, combineReducers, createStore } from 'redux';
// import logger from 'redux-logger';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { userSlice, initialState } from './slice/slice';
import { compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistState from "redux-localstorage";

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

const preloadedState = () => {
  return { user: initialState };
};

export type StoreState = ReturnType<typeof preloadedState>;

export type ReduxStore = Store<StoreState>;

// const createStore = () => {
//   const middlewareList = [...getDefaultMiddleware()]//, logger];

//   return configureStore({
//     reducer: rootReducer,
//     middleware: middlewareList,
//     devTools: process.env.NODE_ENV !== 'production',
//     preloadedState: preloadedState(),
//   });
// };

// const enhancer = compose(persistState(['user'], { key: 'user' }))//,applyMiddleware(thunk));

const store = createStore(rootReducer)//,enhancer);

export default store;