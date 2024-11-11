import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  //   cart: [
  //     {
  //       pizzaId: 12,
  //       name: "Pepperonni",
  //       quantity: 2,
  //       unitPrice: 16,
  //       totlaPrice: 32,
  //     },
  //   ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      // payload = newItem

      const existingPizza = state.cart.find((pizza) => {
        return pizza.pizzaId === action.payload.pizzaId;
      });

      if (existingPizza) {
        existingPizza.quantity++;

        // For demonstration purposes you could also do it this way
        // cartSlice.caseReducers.increaseItemQuantity(state, action);
      } else {
        state.cart.push(action.payload);
      }
    },
    deleteItem(state, action) {
      // payload = pizzaId

      state.cart = state.cart.filter(
        (pizza) => pizza.pizzaId !== action.payload,
      );
    },
    increaseItemQuantity(state, action) {
      // payload = pizzaId

      const pizza = state.cart.find(
        (pizza) => pizza.pizzaId === action.payload,
      );

      pizza.quantity++;
    },
    decreaseItemQuantity(state, action) {
      // payload = pizzaId

      const pizza = state.cart.find(
        (pizza) => pizza.pizzaId === action.payload,
      );

      pizza.quantity--;

      if (pizza.quantity === 0)
        cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

//Redux recommends that all the redux selector functions should be exported from the correspondant slice starting with the inital get convention naming

//Anyway if we want to go really serious with redux then we will need to check out the 'reselect' library from redux that will teach us how to actually create selector functions in the slice reducer.js Keep in mind that this way of doing it may cause performance issues in larger applications
export function getTotalCartQuantity(store) {
  return store.cart.cart.reduce((acc, pizza) => acc + pizza.quantity, 0);
}
export function getTotalCartPrice(store) {
  return store.cart.cart.reduce(
    (acc, pizza) => acc + pizza.unitPrice * pizza.quantity,
    0,
  );
}

export const getCurrentQuantityById = (id) => (store) => {
  const currentPizza = store.cart.cart.find((pizza) => pizza.pizzaId === id);
  return currentPizza?.quantity || 0;
};

export const getCart = (store) => store.cart.cart;

//Extense explanation from a professor assistance

/*

In a large applications, selectors can involve complex data transformations/computations or filtering. Re-evaluating or re-computing these filters can be resource intensive and can hamper the performance of your application. So therefore, memoization techniques like making use of RESELECT to cache the results of selectors should be considered because that helps you to avoid unnecessary recomputation. RESELECT ensures that the output of the selector gets cached and only re-calculated when its input data undergoes a change otherwise it will use the cached result only.

Second point, is that your Redux store may itself become quite large with complex state that might involve nested properties as well and accessing the same can be costly in terms of performance. Hence in that case you would need to normalize your Redux store by structuring your data in a more efficient way so that the number of lookups that might be needed to access can be reduced.

Third point, it also depends on the update frequency of your Redux store. If your Redux store gets updated on a frequent basis, then selectors might get re-computed excessively and thus it can hamper the performance. So for that one can consider using debouncing or throttling techniques to reduce the frequency of selector recomputations, especially in situations where rapid updates are not required.

Now there could be other points as well but these are some of the points that are worth noting.

 */
