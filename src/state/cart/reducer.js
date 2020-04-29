import { reducerFactory, addToArray } from '../utils';
import { ADD_TO_CART } from './actions';

const handlers = {};
const initialState = {
  items: [],
};

handlers[ADD_TO_CART] = addToArray('items');

export default reducerFactory(initialState, handlers);
