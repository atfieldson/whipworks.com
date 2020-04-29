export const ADD_TO_CART = 'ADD_TO_CART';

export const addToCart = (sku, description, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: {
    sku,
    quantity,
    description,
  },
});
