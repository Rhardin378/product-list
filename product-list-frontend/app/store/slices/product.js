import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const axios = require("axios");

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ pageNum = 1, category, price = "lowest", query = "" }) => {
    let response;

    if (!category || category == "#") {
      response = await axios.get("http://localhost:8001/products/", {
        params: {
          page: pageNum,
          price: price,
          query: query,
        },
      });
    } else {
      console.log(category);
      response = await axios.get("http://localhost:8001/products/", {
        params: {
          page: pageNum,
          category: category,
          price: price,
          query: query,
        },
      });
    }
    return response.data;
  }
);
export const productSlice = createSlice({
  name: "products",
  initialState: {
    productsToShow: [],
    productQuery: {},
    productCount: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productsToShow = action.payload.products;
        state.count = action.payload.count;
        state.productQuery = action.payload.responseQuery;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export default productSlice.reducer;
