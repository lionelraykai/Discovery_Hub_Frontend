import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from "../API/endpoints";

// Async thunk to fetch cart data
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { items: [], count: 0 };
    }
    
    try {
      const response = await getCart();
      if (response.data && response.data.items) {
        const items = response.data.items;
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        return { items, count };
      } else {
        return { items: [], count: 0 };
      }
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue("unauthorized");
      }
      return rejectWithValue(err.message || "Failed to fetch cart");
    }
  }
);

// Async thunk to remove an item from cart
export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await removeFromCartAPI(productId);
      dispatch(fetchCart());
    } catch (err) {
      console.error("Error removing item from cart:", err);
      return rejectWithValue(err.message || "Error removing item");
    }
  }
);

// Async thunk to clear all cart items
export const clearAll = createAsyncThunk(
  "cart/clearAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await clearCartAPI();
      dispatch(fetchCart());
    } catch (err) {
      console.error("Error clearing cart:", err);
      return rejectWithValue(err.message || "Error clearing cart");
    }
  }
);

const initialState = {
  cartItems: [],
  cartCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartAfterOrder: (state) => {
      state.cartCount = 0;
      state.cartItems = [];
    },
    resetCart: (state) => {
      state.cartCount = 0;
      state.cartItems = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.cartCount = action.payload.count;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === "unauthorized") {
          state.cartCount = 0;
          state.cartItems = [];
        } else {
          state.error = action.payload;
        }
      });
  },
});

export const { clearCartAfterOrder, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
