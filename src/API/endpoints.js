import API from "./API";

export const signUpUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserProfile = () => API.get("/auth/me");
export const updateUserProfile = (data) => API.put("/auth/update-profile", data);
export const updateProfileImage = (formData) => API.post("/auth/update-profile-image", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const changePassword = (data) => API.put("/auth/change-password", data);
export const getProducts = (page, limit,category) =>
  API.get(`/products?page=${page}&limit=${limit}${category ? `&category=${category}`:""}`);

export const getCategories = () => API.get("/categories")
export const getProductDetails = (id) => API.get(`/products/${id}`)
export const searchProducts = (query) => API.get(`/products/search?q=${query}`);

// Cart endpoints
export const addToCart = (data) => API.post("/cart/add", data);
export const getCart = () => API.get("/cart");
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete("/cart/clear");

// Address endpoints
export const getAddresses = () => API.get("/address");
export const addAddress = (data) => API.post("/address", data);

// Payment endpoints
export const getPaymentMethods = () => API.get("/payments/methods");
export const processPayment = (data) => API.post("/payments/process", data);

// Order endpoints
export const createOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/myorders");
export const getOrderById = (id) => API.get(`/orders/${id}`);

// Wishlist endpoints
export const addToWishlist = (productId) => API.post("/wishlist", { productId });
export const getWishlist = () => API.get("/wishlist");
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`);
