import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts,getCategories } from "../API/endpoints";
export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async ({ page, limit, category }, { rejectWitValue }) => {
    try {
      const response = await getProducts(page, limit, category);
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWitValue(
          response.data.message || "Failed to fetch product",
        );
      }
    } catch (err) {
      return rejectWitValue(
        err.message || "An error occured, during fecthing the products",
      );
    }
  },
);
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWitValue }) => {
    try {
      const response = await getCategories();
      if (response.data.success) {
        return response.data.categories;
      } else {
        return rejectWitValue(
          response.data.message || "Failed to fetch product",
        );
      }
    } catch (err) {
      return rejectWitValue(
        err.message || "An error occured, during fecthing the products",
      );
    }
  },
);

const initialState = {
  products: [],
  loading: false,
  categories: [],
  totalPages:1,
  totalProducts: 0,
  selectedCategory: null,
  error: null,
  page: 1,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages
        state.totalProducts = action.payload.totalProducts;
        state.loading = false;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   Fetch Category

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {setPage,setSelectedCategory,clearError} = productSlice.actions
export default productSlice.reducer