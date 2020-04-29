export const reducerFactory = (initialState, handlers) => (
  state = initialState,
  action
) => {
  const handler = handlers[action.type];

  if (handler) {
    return handler(state, action);
  }
  return state;
};

export const addToArray = stateKey => (state, action) => ({
  ...state,
  [stateKey]: [...stateKey, action.payload],
});
