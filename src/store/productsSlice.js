import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getCategories } from "../API/endpoints";

// Async thunk to fetch products with pagination and category filtering
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, category }, { rejectWithValue }) => {
    try {
      const response = await getProducts(page, limit, category);
      // Introduce a 500ms delay for smooth UI transition matching the original component design
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      return rejectWithValue(err.message || "An error occurred while fetching products");
    }
  }
);

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategories();
      if (response.data.success) {
        return response.data.categories;
      } else {
        return rejectWithValue("Failed to fetch categories");
      }
    } catch (err) {
      return rejectWithValue(err.message || "An error occurred while fetching categories");
    }
  }
);

const initialState = {
  products: [],
  loading: true,
  error: null,
  page: 1,
  totalPages: 1,
  totalProducts: 0,
  categories: [],
  selectedCategory: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.page = 1; // Reset to page 1 when category changes
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories cases
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setPage, setSelectedCategory, clearError } = productsSlice.actions;
export default productsSlice.reducer;
