import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartBanner.css";

const CartBanner = () => {
  const { cartCount, cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Define which pages should show the banner
  const allowedPages = ["/", "/product"];
  const isAllowedPage = allowedPages.some((path) => location.pathname === "/" || location.pathname.startsWith("/product/"));

  useEffect(() => {
    // Show banner if there are items and it's an allowed page, AND we are NOT on the cart page
    if (cartCount > 0 && isAllowedPage && location.pathname !== "/cart") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [cartCount, location.pathname, isAllowedPage]);

  if (!isVisible) return null;

  // Get the most recently added item's image if possible
  const lastItemImage = cartItems[cartItems.length - 1]?.product?.images?.[0] || "";

  return (
    <div className="cart-banner-wrapper">
      <div className="cart-banner-container">
        <div className="cart-banner-content" onClick={() => navigate("/cart")}>
          <div className="cart-banner-info">
            <div className="cart-item-preview">
                {lastItemImage ? (
                    <img src={lastItemImage} alt="Last added item" className="mini-preview-img" />
                ) : (
                    <span className="material-symbols-outlined">shopping_bag</span>
                )}
                <span className="cart-count-badge">{cartCount}</span>
            </div>
            <div className="cart-text-bundle">
                <span className="cart-banner-title">Your Bag</span>
                <span className="cart-banner-subtitle">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for checkout
                </span>
            </div>
          </div>
          <button className="cart-banner-btn">
            View Bag
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartBanner;
