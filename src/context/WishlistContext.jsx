import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from '../API/endpoints';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getWishlist();
      if (response.data) {
        setWishlistItems(response.data);
      }
    } catch (err) {
      console.error("Error fetching wishlist in context:", err);
      if (err.response?.status === 401) {
        setWishlistItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return false; // Should handle login redirect in component

    const isInWishlist = wishlistItems.some(item => item._id === productId);

    try {
      if (isInWishlist) {
        await removeFromWishlistAPI(productId);
      } else {
        await addToWishlistAPI(productId);
      }
      await fetchWishlistData();
      return true;
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      return false;
    }
  };

  const refreshWishlist = () => {
    fetchWishlistData();
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, refreshWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};
