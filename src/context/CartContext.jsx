import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../API/endpoints';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        setCartCount(0);
        setCartItems([]);
        return;
    }
    
    try {
      setLoading(true);
      const response = await getCart();
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        const count = response.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart in context:", err);
      // If unauthorized, clear cart
      if (err.response?.status === 401) {
        setCartCount(0);
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const refreshCart = () => {
    fetchCartData();
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCartAPI(productId);
      fetchCartData();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const clearAll = async () => {
    try {
      await clearCartAPI();
      fetchCartData();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const clearCartAfterOrder = () => {
    setCartCount(0);
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartCount, cartItems, refreshCart, removeItem, clearAll, clearCartAfterOrder, loading }}>
      {children}
    </CartContext.Provider>
  );
};
