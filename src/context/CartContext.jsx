import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const item = action.payload;
      const existItem = state.cartItems.find(i => i._id === item._id);
      let updatedCart;
      if (existItem) {
        updatedCart = state.cartItems.map(i =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updatedCart = [...state.cartItems, { ...item, qty: 1 }];
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };

    case "REMOVE_ITEM":
      const filteredCart = state.cartItems.filter(i => i._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(filteredCart));
      return { ...state, cartItems: filteredCart };

    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      return { ...state, cartItems: [] };

    case "UPDATE_QTY":
      const { _id, qty } = action.payload;
      const updatedQtyCart = state.cartItems.map(i =>
        i._id === _id ? { ...i, qty } : i
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedQtyCart));
      return { ...state, cartItems: updatedQtyCart };

    default:
      return state;
  }
}

// Context
const CartContext = createContext();

// Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook for easy usage
export function useCart() {
  return useContext(CartContext);
}
