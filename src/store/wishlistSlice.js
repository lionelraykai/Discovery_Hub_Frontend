import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from "../API/endpoints";

// Async thunk to fetch wishlist data
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }

    try {
      const response = await getWishlist();
      if (response.data && response.data.wishlist) {
        return response.data.wishlist;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue("unauthorized");
      }
      return rejectWithValue(err.message || "Failed to fetch wishlist");
    }
  }
);

// Async thunk to toggle an item in the wishlist
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, { getState, dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return { success: false };

    const { wishlistItems } = getState().wishlist;
    const isInWishlist = wishlistItems.some((item) => item._id === productId);

    try {
      let response;
      if (isInWishlist) {
        response = await removeFromWishlistAPI(productId);
      } else {
        response = await addToWishlistAPI(productId);
      }

      let newWishlist = null;
      if (response.data && response.data.wishlist) {
        newWishlist = response.data.wishlist;
      } else {
        const fetchAction = await dispatch(fetchWishlist());
        newWishlist = fetchAction.payload;
      }
      return { success: true, wishlist: newWishlist };
    } catch (err) {
      console.error("Error toggling wishlist in slice:", err);
      return rejectWithValue(err.message || "Error toggling wishlist");
    }
  }
);

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.wishlistItems = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        if (action.payload === "unauthorized") {
          state.wishlistItems = [];
        } else {
          state.error = action.payload;
        }
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.wishlist) {
          state.wishlistItems = action.payload.wishlist;
        }
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
